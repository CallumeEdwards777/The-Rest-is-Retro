import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api';
import { useSession } from '../contexts/SessionContext';

const ERAS = ['1970s', '1980s', '1990s', '2000s'];

const CreateItem = () => {
  const navigate = useNavigate();
  const { user } = useSession();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [era, setEra] = useState(ERAS[0]);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories');
        setCategories(response.data);
        if (response.data.length > 0) {
          setCategoryId(response.data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newItem = {
      item_id: `TRR-NEW-${Date.now()}`,
      seller_id: user.id || 1,
      category_id: Number(categoryId),
      title,
      description,
      era,
      price: Number(price),
      currency: 'GBP',
      status: 'available',
    };

    api
      .post('/api/items', newItem)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.log('Error:', error);

        if (error.response) {
          console.log('Response:', error.response.data);
        }
      });
  };

  return (
    <div>
      <h1>List an Item</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Item title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />

        <textarea
          placeholder="Item description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />

        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Price (GBP)"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          required
        />

        <select value={era} onChange={(event) => setEra(event.target.value)}>
          {ERAS.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.category_name}</option>
          ))}
        </select>

        <button type="submit">List Item</button>
      </form>
    </div>
  );
};

export default CreateItem;
