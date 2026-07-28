import React, { useState, useEffect } from 'react';
import api from '../api';

const SavedItems = () => {
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    const fetchSavedItems = async () => {
      try {
        const response = await api.get('/api/subscribed-courses'); // TODO: confirm real endpoint with Callum!!
        setSavedItems(response.data);
      } catch (error) {
        console.error('Failed to fetch saved items', error);
      }
    };

    fetchSavedItems();
  }, []);

  return (
    <div>
      <h2>My saved items</h2>
      <ul>
        {savedItems.map((course) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SavedItems;
