import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import api from '../api';
import ItemCard from './ItemCard';
import { useSaved } from '../contexts/SavedContext';

const SavedItems = () => {
  const [items, setItems] = useState([]);
  const { savedIds } = useSaved();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchSavedItems = async () => {
      try {
        const response = await api.get('/api/saved-items');
        setItems(response.data.items);
      } catch (error) {
        console.error('Failed to fetch saved items', error);
      }
    };

    if (token) fetchSavedItems();
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const visibleItems = items.filter((item) => savedIds.includes(item.id));

  return (
    <main className="wrap listings-page">
      <h1 className="page-title">Saved items</h1>
      <p className="page-sub">{visibleItems.length} saved — tap the heart on any item to keep it here.</p>
      {visibleItems.length === 0 ? (
        <p className="empty-note">Nothing saved yet. Tap the ♡ on anything you like.</p>
      ) : (
        <div className="grid">
          {visibleItems.map((item) => <ItemCard key={item.id} item={item} />)}
        </div>
      )}
    </main>
  );
};

export default SavedItems;
