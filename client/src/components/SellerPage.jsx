import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';

import ItemCard from './ItemCard';

const SellerPage = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchSeller = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const [userRes, itemsRes] = await Promise.allSettled([
          api.get(`/api/users/${id}`),
          api.get('/api/items'),
        ]);

        if (cancelled) return;

        if (userRes.status === 'fulfilled') {
          setSeller(userRes.value.data);
        } else {
          setNotFound(true);
        }

        if (itemsRes.status === 'fulfilled') {
          setItems(itemsRes.value.data.filter((item) => String(item.seller_id) === String(id)));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSeller();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return null;

  if (notFound) {
    return (
      <main className="wrap listings-page">
        <h1 className="page-title">Seller not found</h1>
        <p className="empty-note">
          That seller doesn&rsquo;t exist. <Link to="/">Back to the shop</Link>.
        </p>
      </main>
    );
  }

  return (
    <main className="wrap listings-page">
      <h1 className="page-title">{seller.username}</h1>
      <p className="page-sub">{items.length} relics listed · seller on The Rest is Retro</p>
      <div className="grid">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
};

export default SellerPage;
