import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { itemsAPI } from "../utils/api";
import { useCart } from "../contexts/CartContext";
import "../styles/pages/product-detail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await itemsAPI.getById(id);
        setItem(res.data);
      } catch (err) {
        console.error("Error fetching item:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }
    navigate("/cart");
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!item) return <div className="container" style={{ padding: "2rem" }}>Product not found</div>;

  const priceGBP = (item.price_cents / 100).toFixed(2);

  return (
    <div className="product-detail">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

        <div className="detail-grid">
          {/* Product Image */}
          <div className="detail-image">
            {item.image_url ? (
              <img src={item.image_url} alt={item.title} />
            ) : (
              <div className="placeholder">{item.era}</div>
            )}
          </div>

          {/* Product Info */}
          <div className="detail-info">
            <div className="era-badge">{item.era}</div>
            <h1>{item.title}</h1>
            <p className="price">£{priceGBP}</p>

            <div className="description">
              <h3>Description</h3>
              <p>{item.description}</p>
            </div>

            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} min="1" />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div className="actions">
              <button className="btn btn-primary" onClick={handleAddToCart}>
                Add to Cart (£{(parseInt(item.price_cents) * quantity / 100).toFixed(2)})
              </button>
              <button className="btn btn-outline">Save for Later</button>
            </div>

            <div className="product-meta">
              <p><strong>Status:</strong> {item.status}</p>
              <p><strong>Item ID:</strong> {item.item_id || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
