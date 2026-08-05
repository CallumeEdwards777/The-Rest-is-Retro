import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';

import { eraLabel, formatPrice } from './ItemCard';

const ItemDetails = () => {
  const [item, setItem] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [seller, setSeller] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/api/items/${id}`);
        setItem(response.data);

        const [categoryRes, sellerRes] = await Promise.allSettled([
          api.get(`/api/categories/${response.data.category_id}`),
          api.get(`/api/users/${response.data.seller_id}`),
        ]);
        if (categoryRes.status === 'fulfilled') setCategoryName(categoryRes.value.data?.category_name || '');
        if (sellerRes.status === 'fulfilled') setSeller(sellerRes.value.data);
      } catch (error) {
        console.error(`Failed to fetch item with id ${id}`, error);
      }
    };

    fetchItem();
  }, [id]);

  const handleBuy = () => {
    // Wired to the real buy endpoint in the buy-flow step.
    console.log('Buy clicked for item', item?.id);
  };

  const getInitials = (username) => (username ? username.slice(0, 2).toUpperCase() : '?');

  if (!item) {
    return <main className="wrap"><p className="empty-note">Loading relic…</p></main>;
  }

  const isSold = item.status === 'sold';

  return (
    <main className="wrap">
      <div className="crumbs">
        <Link to="/">Browse</Link> &nbsp;/&nbsp; {eraLabel(item.era)} &nbsp;/&nbsp; {item.title}
      </div>

      <div className="layout">
        <div className="photo">
          <img src={`/item-images/${item.item_id}.jpg`} alt={item.title} />
        </div>

        <div className="panel">
          <div className="tags">
            <span className={`tag era era-${item.era}`}>{eraLabel(item.era)}</span>
            {categoryName && <span className="tag cat">{categoryName}</span>}
            {item.status === 'verified' && <span className="tag check">✓ Verified listing</span>}
            {isSold && <span className="tag sold">Sold</span>}
          </div>

          <h1>{item.title}</h1>
          <div className="price">{formatPrice(item.price)}</div>
          <div className="vat">Free UK delivery · 14-day returns</div>

          <button className="btn btn-primary btn-big" onClick={handleBuy} disabled={isSold}>
            {isSold ? 'Sold' : 'Buy now'}
          </button>

          {seller && (
            <div className="seller">
              <div className="avatar">{getInitials(seller.username)}</div>
              <div>
                <div className="who">{seller.username}</div>
                <div className="sub">Seller on The Rest is Retro since 2026</div>
              </div>
            </div>
          )}

          <div className="desc">
            <h2>The story</h2>
            <p>{item.description}</p>
          </div>

          <div className="facts">
            <div><span>Item ID</span><span>{item.item_id}</span></div>
            <div><span>Era</span><span>{item.era}</span></div>
            {categoryName && <div><span>Category</span><span>{categoryName}</span></div>}
            <div><span>Status</span><span>{item.status}</span></div>
          </div>
        </div>
      </div>

      <footer className="site-footer">
        <span>The Rest is Retro — curated vintage, sold by era.</span>
        <span>The rest is history.</span>
      </footer>
    </main>
  );
};

export default ItemDetails;
