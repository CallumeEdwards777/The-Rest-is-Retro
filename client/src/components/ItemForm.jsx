import { useState, useEffect } from 'react';

import api from '../api';

const ERAS = ['1970s', '1980s', '1990s', '2000s'];

const CONDITIONS = [
  { value: 'tested_working', label: 'Tested & working' },
  { value: 'display_only', label: 'Display only' },
  { value: 'age_wear', label: 'Wear consistent with age' },
];

// Shared listing form: CreateItem uses it empty, EditItem passes `initial`
const ItemForm = ({ initial = null, submitLabel = 'List Item', onSubmit, error }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [price, setPrice] = useState(initial?.price != null ? String(initial.price) : '');
  const [era, setEra] = useState(initial?.era || ERAS[0]);
  const [categoryId, setCategoryId] = useState(initial?.category_id || '');
  const [categories, setCategories] = useState([]);
  const [condition, setCondition] = useState(initial?.condition || 'tested_working');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories');
        setCategories(response.data);
        if (!initial && response.data.length > 0) {
          setCategoryId(response.data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };

    fetchCategories();
  }, [initial]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('era', era);
    formData.append('price', Number(price));
    formData.append('category_id', Number(categoryId));
    formData.append('condition', condition);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    onSubmit(formData);
  };

  return (
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

      <select value={condition} onChange={(event) => setCondition(event.target.value)}>
        <option value="" disabled>Condition…</option>
        {CONDITIONS.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>

      <label htmlFor="photo">Photo (JPEG/PNG/WebP, max 5MB){initial ? ' — leave empty to keep current' : ''}</label>
      <input
        id="photo"
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={(event) => setImageFile(event.target.files[0] || null)}
      />

      <button className="btn btn-primary" type="submit">{submitLabel}</button>

      {error && <div className="form-error">{error}</div>}
    </form>
  );
};

export default ItemForm;
