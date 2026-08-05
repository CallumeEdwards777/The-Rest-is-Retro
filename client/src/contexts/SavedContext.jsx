import { createContext, useState, useContext, useEffect } from 'react';

import api from '../api';

export const SavedContext = createContext();

export function SavedProvider({ children }) {
  const [savedIds, setSavedIds] = useState([]);

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
      window.location.href = '/login';
      return;
    }

    const isSaved = savedIds.includes(itemId);
    setSavedIds((current) =>
      isSaved ? current.filter((id) => id !== itemId) : [...current, itemId]
    );

    const request = isSaved
      ? api.delete(`/api/saved-items/${itemId}`)
      : api.post(`/api/saved-items/${itemId}`);

    request.catch((error) => {
      console.error('Failed to update saved item', error);
      refreshSaved();
    });
  };

  return (
    <SavedContext.Provider value={{ savedIds, toggleSaved, refreshSaved }}>
      {children}
    </SavedContext.Provider>
  );
}

export const useSaved = () => useContext(SavedContext);
