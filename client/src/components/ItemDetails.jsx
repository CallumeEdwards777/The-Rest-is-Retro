import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const ItemDetails = () => {
  const [item, setItem] = useState({});
  const [showDelegates, setShowDelegates] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/api/items/${id}`);
        console.log(response.data);
        // GET /api/items/:id returns the item directly (res.json(item)),
        // not wrapped in { item: ... } - was reading response.data.course before
        setItem(response.data);
      } catch (error) {
        console.error(`Failed to fetch item with id ${id}`, error);
      }
    };

    fetchItem();
  }, []);

  const toggleDelegates = () => {
    setShowDelegates(!showDelegates);
  }

  const handleEnroll = () => {
    console.log('Enroll');
  }

  return (
    <div>
      <h2>Item Details {item.id}</h2>
      {item.id && (
        <>
        <div className="card">
          <div>Item Number: {item.id}</div>
          <div>Item Title: {item.title}</div>
          <div>Item Description: {item.description}</div>
          {/* category association exists in models/index.js but server/routes/item.js's
              GET /:id doesn't `include` it - blank until that's added server-side */}
          <div>Item Category: {item.category?.category_name}</div>
          <div>Users: {item.users?.length}</div>
          <div className="card-options">
            <button className="button" onClick={() => toggleDelegates()}>View Delegates</button>
            <button className="button" onClick={() => handleEnroll()}>Enroll</button>
          </div>
        </div>

        {showDelegates && (
          <div className="card mt-5">
            <h3>Delegates</h3>
            <div className="delegate-list">
              {/* no users/delegates association exists on Item at all yet (only a single
                  postedBy owner) - guarding with (item.users || []) so this never crashes,
                  but it'll stay empty until that's actually designed and added server-side */}
              {(item.users || []).map((user) => (
                <div key={user.id} className="delegate">
                  <div>{user.username}</div>
                  <div>{user.email}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
      )}
    </div>
  );
};

export default ItemDetails;