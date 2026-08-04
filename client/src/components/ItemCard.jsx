import React from 'react'

import { Link } from 'react-router-dom'

const ItemCard = ({item}) => {
  return (
    <div className="card">
        <div className="card-title">Item Number: {item.id}</div>
        <div className="card-description">Item Title: {item.title}</div>
        <div className="card-options">
          <Link className="button" to={`/item/${item.id}`}>View Details</Link>
          <Link className="button" to={`/item/${item.id}`}>Enroll</Link>
        </div>
    </div>
  )
}

export default ItemCard