import { Link } from 'react-router-dom'

export const eraLabel = (era) => (era === '2000s' ? 'Y2K' : era);

export const formatPrice = (price) => `£${Number(price).toFixed(0)}`;

const ItemCard = ({ item }) => {
  return (
    <Link className="card" to={`/item/${item.id}`}>
      <div className="imgbox">
        <img src={`/item-images/${item.item_id}.jpg`} alt={item.title} loading="lazy" />
        <span className={`era-badge era-${item.era}`}>{eraLabel(item.era)}</span>
        {item.status === 'verified' && <span className="verified-dot">✓ Verified</span>}
      </div>
      <div className="meta">
        <div className="title">{item.title}</div>
        <div className="price">{formatPrice(item.price)}</div>
      </div>
    </Link>
  )
}

export default ItemCard
