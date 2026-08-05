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
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');

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
    setError('');

    // Multipart form so the optional photo travels with the fields
    const formData = new FormData();
    formData.append('item_id', `TRR-NEW-${Date.now()}`);
    formData.append('seller_id', user.id || 1);
    formData.append('category_id', Number(categoryId));
    formData.append('title', title);
    formData.append('description', description);
    formData.append('era', era);
    formData.append('price', Number(price));
    formData.append('currency', 'GBP');
    if (imageFile) {
      formData.append('image', imageFile);
    }

    api
      .post('/api/items', formData)
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        console.log('Error:', err.response?.data || err);
        setError(err.response?.data?.message || 'Listing failed — please try again.');
      });
  };

  return (
    <div className="plain-page">
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

        <label htmlFor="photo">Photo (JPEG/PNG/WebP, max 5MB)</label>
        <input
          id="photo"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={(event) => setImageFile(event.target.files[0] || null)}
        />

        <button className="btn btn-primary" type="submit">List Item</button>

        {error && <div className="form-error">{error}</div>}
      </form>
    </div>
  );
};

export default CreateItem;
