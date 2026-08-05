import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api';

import ItemCard, { eraLabel, formatPrice, itemImage } from './ItemCard';
import { useSaved } from '../contexts/SavedContext';

const CONDITION_LABELS = {
  tested_working: 'Tested & working',
  display_only: 'Display only',
  age_wear: 'Wear consistent with age',
};

const ItemDetails = () => {
  const [item, setItem] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [seller, setSeller] = useState(null);
  const [allItems, setAllItems] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();
  const [buyError, setBuyError] = useState('');
  const { savedIds, toggleSaved } = useSaved();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/api/items/${id}`);
        setItem(response.data);

        const [categoryRes, sellerRes, itemsRes] = await Promise.allSettled([
          api.get(`/api/categories/${response.data.category_id}`),
          api.get(`/api/users/${response.data.seller_id}`),
          api.get('/api/items'),
        ]);
        if (categoryRes.status === 'fulfilled') setCategoryName(categoryRes.value.data?.category_name || '');
        if (sellerRes.status === 'fulfilled') setSeller(sellerRes.value.data);
        if (itemsRes.status === 'fulfilled') setAllItems(itemsRes.value.data);
      } catch (error) {
        console.error(`Failed to fetch item with id ${id}`, error);
      }
    };

    fetchItem();
  }, [id]);

  const handleBuy = async () => {
    if (!localStorage.getItem('authToken')) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.post(`/api/items/${id}/buy`);
      navigate('/confirm', {
        state: {
          item: response.data.item,
          orderRef: response.data.order.ref,
          categoryName,
          seller,
        },
      });
    } catch (error) {
      console.error('Buy failed', error);
      setBuyError(error.response?.data?.message || 'Purchase failed — please try again.');
    }
  };

  const getInitials = (username) => (username ? username.slice(0, 2).toUpperCase() : '?');

  if (!item) {
    return <main className="wrap"><p className="empty-note">Loading relic…</p></main>;
  }

  const isSold = item.status === 'sold';
  const saved = savedIds.includes(item.id);

  // "More from this decade": reuses the already-fetched item list — same era, not self, first 3.
  const sameEra = allItems.filter((i) => i.era === item.era && i.id !== item.id);
  const moreItems = sameEra.slice(0, 3);
  const remaining = sameEra.length - moreItems.length;

  return (
    <main className="wrap">
      <div className="crumbs">
        <Link to="/">Browse</Link> &nbsp;/&nbsp; {eraLabel(item.era)} &nbsp;/&nbsp; {item.title}
      </div>

      <div className="layout">
        <div className="photo plate">
          <img src={itemImage(item)} alt={item.title} />
        </div>

        <div className="panel">
          <div className="kicker">{eraLabel(item.era)} / {categoryName} / {item.item_id}</div>

          <h1>{item.title}</h1>
          <div className="price">
            {formatPrice(item.price)}
            {item.status === 'verified' && <span className="tag check">✓ Verified listing</span>}
            {isSold && <span className="tag sold">Sold</span>}
            {item.condition && <span className="tag cat">{CONDITION_LABELS[item.condition]}</span>}
          </div>

          <button className="btn btn-primary btn-big" onClick={handleBuy} disabled={isSold}>
            {isSold ? 'Sold' : 'Buy now'}
          </button>
          {buyError && <div className="form-error">{buyError}</div>}

          {seller && (
            <Link to={'/seller/' + item.seller_id} className="seller">
              <div className="avatar">{getInitials(seller.username)}</div>
              <div>
                <div className="who">{seller.username}</div>
                <div className="sub">Seller on The Rest is Retro since 2026</div>
              </div>
            </Link>
          )}

          {item.status === 'verified' && (
            <div className="trust">
              <h3>The TRR guarantee</h3>
              <ul>
                <li><span>✓</span> Seller submitted label, barcode or serial evidence</li>
                <li><span>✓</span> Evidence checked against product records before the listing went live</li>
                <li><span>✓</span> Full refund if it turns out not to be genuine</li>
                <li><span>✓</span> Seller identity verified</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="rule" />

      <div className="layout bands">
        <div className="desc">
          <h2>The story</h2>
          <p>{item.description}</p>
        </div>

        <div className="facts">
          <div><span>Item ID</span><span>{item.item_id}</span></div>
          <div><span>Era</span><span>{item.era}</span></div>
          {categoryName && <div><span>Category</span><span>{categoryName}</span></div>}
          <div><span>Status</span><span>{item.status}</span></div>
          <div><span>Condition</span><span>{CONDITION_LABELS[item.condition] || '—'}</span></div>
        </div>
      </div>

      {sameEra.length > 0 && (
        <section className="more">
          <h2>More from the {eraLabel(item.era)}</h2>
          <div className="grid">
            {moreItems.map((i) => (
              <ItemCard key={i.id} item={i} />
            ))}
            {remaining > 0 && (
              <Link to={`/?era=${item.era}`} className="more-more">
                {remaining} more relics from the {eraLabel(item.era)} · Browse the decade →
              </Link>
            )}
          </div>
        </section>
      )}

      <div className="buybar">
        <span className="price">{formatPrice(item.price)}</span>
        <button
          className={`heart ${saved ? 'on' : ''}`}
          onClick={() => toggleSaved(item.id)}
          aria-label="Save item"
        >
          {saved ? '♥' : '♡'}
        </button>
        <button className="btn btn-primary" onClick={handleBuy} disabled={isSold}>
          {isSold ? 'Sold' : 'Buy now'}
        </button>
      </div>
    </main>
  );
};

export default ItemDetails;
