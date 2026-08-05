import { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api';

export const SavedContext = createContext();

export function SavedProvider({ children }) {
  const [savedIds, setSavedIds] = useState([]);
  const navigate = useNavigate();
  const inFlight = useRef(new Set());

  const refreshSaved = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setSavedIds([]);
      return;
    }

    try {
      const response = await api.get('/api/saved-items');
      setSavedIds(response.data.items.map((item) => item.id));
    } catch (error) {
      console.error('Failed to fetch saved items', error);
    }
  };

  useEffect(() => {
    refreshSaved();
  }, []);

  const toggleSaved = (itemId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // One request in flight per item: a double-tap can't race POST vs DELETE
    // into a state where the heart and the server disagree.
    if (inFlight.current.has(itemId)) return;
    inFlight.current.add(itemId);

    const isSaved = savedIds.includes(itemId);
    setSavedIds((current) =>
      isSaved ? current.filter((id) => id !== itemId) : [...current, itemId]
    );

    const request = isSaved
      ? api.delete(`/api/saved-items/${itemId}`)
      : api.post(`/api/saved-items/${itemId}`);

    request
      .catch((error) => {
        console.error('Failed to update saved item', error);
        refreshSaved();
      })
      .finally(() => {
        inFlight.current.delete(itemId);
      });
  };

  return (
    <SavedContext.Provider value={{ savedIds, toggleSaved, refreshSaved }}>
      {children}
    </SavedContext.Provider>
  );
}

export const useSaved = () => useContext(SavedContext);
