import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

import ItemCard from './ItemCard';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [requiresLogin, setRequiresLogin] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/api/items');

        console.log('items', response.data);

        setItems(response.data);
      } catch (error) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          setRequiresLogin(true);
          return;
        }

        console.error('Failed to fetch items', error);
      }
    };

    fetchItems();
  }, []);

  return (
    <div>
      <h2>All Items</h2>
      {requiresLogin ? (
        <p>
          Please <Link to="/login">log in</Link> to view items.
        </p>
      ) : (
        <div className="item-list">
          {items.map((item) => (
            <ItemCard key={item.id} course={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemList;
