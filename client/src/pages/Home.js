import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoriesAPI, itemsAPI } from "../utils/api";
import "../styles/pages/home.css";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, itemsRes] = await Promise.all([
          categoriesAPI.getAll(),
          itemsAPI.getAll(),
        ]);
        setCategories(categoriesRes.data);
        setFeaturedItems(itemsRes.data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="home">
      {/* Hero Section */}
      <section
        className="hero"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/banner.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="hero-content">
          <h1>Step Into Your Era</h1>
          <p>Curated retro clothing from every decade.</p>
          <div className="hero-buttons">
            <Link to="/shop" className="btn btn-primary">
              Shop Now
            </Link>
            <Link to="/eras" className="btn btn-secondary">
              Discover Your Era
            </Link>
          </div>
        </div>
      </section>

      {/* Eras Section */}
      <section className="eras-section">
        <h2>Explore by Era</h2>
        <div className="eras-grid">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/category/${cat.id}`} className="era-card">
              <div className="era-image">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.category_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>{cat.category_name}</span>
                )}
              </div>
              <button className="btn btn-small">Shop for {cat.category_name}</button>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <h2>Featured Items</h2>
        <div className="products-grid">
          {featuredItems.map((item) => (
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
              <p className="price">£{(item.price_cents / 100).toFixed(2)}</p>
              <div className="product-actions">
                <button className="btn btn-small">Add to Cart</button>
                <button className="btn btn-small btn-outline">View Details</button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <h2>Why Retro?</h2>
        <p>
          Every piece has lived a life—now it's ready for yours. Discover the charm of the imperfect.
          Our carefully curated collection celebrates nostalgia, sustainability, and the stories behind
          each vintage find.
        </p>
        <Link to="/about" className="btn btn-secondary">
          Learn More
        </Link>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <h2>Join the Retro Club</h2>
        <p>Get exclusive drops & discounts.</p>
        <form className="newsletter-form">
          <input type="email" placeholder="Enter your email" required />
          <button type="submit" className="btn btn-primary">
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}
