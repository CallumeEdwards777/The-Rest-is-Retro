import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { categoriesAPI, itemsAPI } from "../utils/api";
import "../styles/pages/category.css";

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, itemsRes] = await Promise.all([
          categoriesAPI.getById(id),
          itemsAPI.getAll(),
        ]);
        setCategory(catRes.data);
        // Filter items by category_id
        const filtered = itemsRes.data.filter((item) => item.category_id === parseInt(id));
        setItems(filtered);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const sortedItems = [...items].sort((a, b) => {
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
    <div className="category-page">
      <div className="container">
        <h1>{category?.category_name || "Category"}</h1>
        <p className="item-count">{items.length} items</p>

        <div className="filters">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {items.length === 0 ? (
          <div className="no-items">
            <p>No items in this category yet</p>
          </div>
        ) : (
          <div className="products-grid">
            {sortedItems.map((item) => (
              <div key={item.id} className="product-card" onClick={() => navigate(`/item/${item.id}`)}>
                <div className="product-image">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} />
                  ) : (
                    <div className="placeholder">{item.era}</div>
                  )}
                  <span className="era-badge">{item.era}</span>
                </div>
                <h3>{item.title}</h3>
                <p className="description">{item.description.substring(0, 60)}...</p>
                <p className="price">£{(item.price_cents / 100).toFixed(2)}</p>
                <button className="btn btn-small">View Details</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
