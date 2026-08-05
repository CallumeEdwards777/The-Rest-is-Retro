import { useState, useEffect, useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';

import api from '../api';
import { useSession } from '../contexts/SessionContext';
import { eraLabel, formatPrice, itemImage } from './ItemCard';

const STATUS_LABELS = {
  pending_verification: 'Pending verification',
  verified: '✓ Verified',
  sold: 'Sold',
};

const MyListings = () => {
  const [items, setItems] = useState([]);
  const { user } = useSession();
  const token = localStorage.getItem('authToken');

  const fetchListings = useCallback(async () => {
    try {
      const response = await api.get('/api/items');
      setItems(response.data.filter((item) => item.seller_id === user.id));
    } catch (error) {
      console.error('Failed to fetch listings', error);
    }
  }, [user.id]);

  useEffect(() => {
    if (token) fetchListings();
  }, [token, fetchListings]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/items/${id}`);
      fetchListings();
    } catch (error) {
      console.error('Failed to delete listing', error);
    }
  };

  const handleRelist = async (id) => {
    try {
      await api.post(`/api/items/${id}/relist`);
      fetchListings();
    } catch (error) {
      console.error('Failed to relist item', error);
    }
  };

  return (
    <main className="wrap listings-page">
      <h1 className="page-title">My listings</h1>
      <p className="page-sub">
        Everything you&rsquo;re selling. New listings show as pending until they&rsquo;re verified.
      </p>

      {items.length === 0 ? (
        <p className="empty-note">
          Nothing listed yet. <Link to="/create-item">List your first item</Link> — it takes a minute.
        </p>
      ) : (
        <div className="listing-rows">
          {items.map((item) => (
            <div className="listing-row" key={item.id}>
              <img src={itemImage(item)} alt={item.title} />
              <div className="listing-info">
                <Link to={`/item/${item.id}`} className="listing-title">{item.title}</Link>
                <div className="listing-sub">
                  {eraLabel(item.era)} · {formatPrice(item.price)}
                </div>
              </div>
              <span className={`listing-status status-${item.status}`}>
                {STATUS_LABELS[item.status] || item.status}
              </span>
              <div className="listing-actions">
                <Link className="btn btn-ghost btn-compact" to={`/edit-item/${item.id}`}>Edit</Link>
                {item.status === 'sold' && (
                  <button className="btn btn-ghost btn-compact" onClick={() => handleRelist(item.id)}>
                    Relist
                  </button>
                )}
                <button className="btn btn-ghost btn-compact" onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MyListings;
