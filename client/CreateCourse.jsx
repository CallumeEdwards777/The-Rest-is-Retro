import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api';

const CreateCourse = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const getUserEmail = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      return '';
    }

    try {
      const tokenWithoutPrefix = token.replace('token ', '');
      const payload = tokenWithoutPrefix.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));

      return decodedPayload.data.email;
    } catch (error) {
      console.log('Unable to read user email from token:', error);
      return '';
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newCourse = {
      title,
      description,
      created_by: getUserEmail(),
      categoryId: Number(categoryId),
    };

    console.log('Sending:', newCourse);

    api
      .post('/api/courses', newCourse)
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
      <h1>Create Course</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Course title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />

        <textarea
          placeholder="Course description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Category ID"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          required
        />

        <button type="submit">Create Course</button>
      </form>
    </div>
  );
};

export default CreateCourse;