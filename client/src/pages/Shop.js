import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { itemsAPI } from "../utils/api";
import "../styles/pages/shop.css";

export default function Shop() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await itemsAPI.getAll();
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price_cents - b.price_cents;
      case "price-high":
        return b.price_cents - a.price_cents;
      case "newest":
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="shop-page">
      <div className="container">
        <h1>Shop All Items</h1>

        <div className="shop-controls">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <p className="item-count">{sorted.length} items found</p>
        </div>

        <div className="products-grid">
          {sorted.map((item) => (
            <Link
              key={item.id}
              to={`/item/${item.id}`}
              className="product-card"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="product-image">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} />
                ) : (
                  <div className="placeholder">{item.era}</div>
                )}
                <span className="era-tag">{item.era}</span>
              </div>
              <h3>{item.title}</h3>
              <p className="description">{item.description.substring(0, 60)}...</p>
              <p className="price">£{(item.price_cents / 100).toFixed(2)}</p>
              <button className="btn btn-small">View Details</button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
