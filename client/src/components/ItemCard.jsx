import { Link } from 'react-router-dom'

import { API_BASE_URL } from '../api';
import { useSaved } from '../contexts/SavedContext';

export const eraLabel = (era) => (era === '2000s' ? 'Y2K' : era);

export const formatPrice = (price) => `£${Number(price).toFixed(0)}`;

// Uploaded photo wins; seeded items fall back to the item_id image convention.
// Uploads are stored as a relative path and served by the API, not by Vite.
export const itemImage = (item) => {
  if (!item.image_url) return `/item-images/${item.item_id}.jpg`;
  return item.image_url.startsWith('/uploads/')
    ? `${API_BASE_URL}${item.image_url}`
    : item.image_url;
};

const ItemCard = ({ item }) => {
  const { savedIds, toggleSaved } = useSaved();
  const saved = savedIds.includes(item.id);

  const handleToggleSaved = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(item.id);
  };

  return (
    <Link className={`card${item.status === 'sold' ? ' sold' : ''}`} to={`/item/${item.id}`}>
      <div className="imgbox">
        <img src={itemImage(item)} alt={item.title} loading="lazy" />
        <span className={`era-badge era-${item.era}`}>{eraLabel(item.era)}</span>
        {item.status === 'sold' ? (
          <span className="sold-dot">Sold</span>
        ) : (
          item.status === 'verified' && <span className="verified-dot">✓ Verified</span>
        )}
        <button
          className={`heart ${saved ? 'on' : ''}`}
          onClick={handleToggleSaved}
          aria-label="Save item"
        >
          {saved ? '♥' : '♡'}
        </button>
      </div>
      <div className="meta">
        <div className="title">{item.title}</div>
        <div className="price">{formatPrice(item.price)}</div>
      </div>
    </Link>
  )
}

export default ItemCard
