import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api';
import ItemForm from './ItemForm';

const CreateItem = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = (formData) => {
    setError('');
    formData.append('currency', 'GBP');

    api
      .post('/api/items', formData)
      .then(() => {
        navigate('/my-listings');
      })
      .catch((err) => {
        console.log('Error:', err.response?.data || err);
        setError(err.response?.data?.message || 'Listing failed — please try again.');
      });
  };

  return (
    <div className="plain-page">
      <h1>List an Item</h1>
      <ItemForm submitLabel="List Item" onSubmit={handleSubmit} error={error} />
    </div>
  );
};

export default CreateItem;
