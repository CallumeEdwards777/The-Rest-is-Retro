import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const ItemDetails = () => {
  const [item, setItem] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/api/items/${id}`);
        setItem(response.data);
      } catch (error) {
        console.error(`Failed to fetch item with id ${id}`, error);
      }
    };

    fetchItem();
  }, [id]);

  const handleBuy = () => {
    // Buy flow is not built yet — placeholder until the order feature exists.
    console.log('Buy clicked for item', item?.id);
  };

  if (!item) {
    return <p>Loading item…</p>;
  }

  return (
    <div className="item-details">
      <div className="card">
        <img
          className="card-image"
          src={`/item-images/${item.item_id}.jpg`}
          alt={item.title}
        />
        <h2>{item.title}</h2>
        <p>{item.description}</p>
        <div className="item-meta">
          <div>Era: {item.era}</div>
          <div>Price: {item.price} {item.currency}</div>
          <div>Status: {item.status}</div>
        </div>
        <div className="card-options">
          <button className="button" onClick={handleBuy}>Buy</button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
