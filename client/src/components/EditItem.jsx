import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import api from '../api';
import ItemForm from './ItemForm';

const EditItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/api/items/${id}`)
      .then((response) => setItem(response.data))
      .catch((err) => console.error('Failed to fetch item', err));
  }, [id]);

  const handleSubmit = (formData) => {
    setError('');

    api
      .put(`/api/items/${id}`, formData)
      .then(() => {
        navigate('/my-listings');
      })
      .catch((err) => {
        console.log('Error:', err.response?.data || err);
        setError(err.response?.data?.message || 'Update failed — please try again.');
      });
  };

  if (!item) {
    return <div className="plain-page"><p className="empty-note">Loading listing…</p></div>;
  }

  return (
    <div className="plain-page">
      <h1>Edit Listing</h1>
      <ItemForm initial={item} submitLabel="Save Changes" onSubmit={handleSubmit} error={error} />
    </div>
  );
};

export default EditItem;
