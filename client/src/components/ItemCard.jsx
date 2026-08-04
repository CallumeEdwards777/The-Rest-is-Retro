import { Link } from 'react-router-dom'

const ItemCard = ({ item }) => {
  return (
    <div className="card">
        <img
          className="card-image"
          src={`/item-images/${item.item_id}.jpg`}
          alt={item.title}
        />
        <div className="card-title">{item.title}</div>
        <div className="card-meta">{item.era} · {item.price} {item.currency}</div>
        <div className="card-options">
          <Link className="button" to={`/item/${item.id}`}>View Details</Link>
        </div>
    </div>
  )
}

export default ItemCard
