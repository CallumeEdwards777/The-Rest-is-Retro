import { useState, useEffect } from 'react';
import api from '../api';

const SavedItems = () => {
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    const fetchSavedItems = async () => {
      try {
        // TODO: no saved-items endpoint exists on the server yet — this page is
        // not routed anywhere until that feature is built.
        const response = await api.get('/api/saved-items');
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
        {savedItems.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SavedItems;
