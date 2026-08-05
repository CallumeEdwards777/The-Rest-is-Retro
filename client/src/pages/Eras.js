import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoriesAPI, itemsAPI } from "../utils/api";
import "../styles/pages/eras.css";

export default function Eras() {
  const [categories, setCategories] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, itemsRes] = await Promise.all([
          categoriesAPI.getAll(),
          itemsAPI.getAll(),
        ]);
        setCategories(catRes.data);
        setAllItems(itemsRes.data);
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
    <div className="eras-page">
      <div className="container">
        <h1>Explore by Era</h1>
        <p className="subtitle">Browse our curated collections from different decades</p>

        <div className="eras-grid">
          {categories.map((cat) => {
            const itemCount = allItems.filter((item) => item.category_id === cat.id).length;
            return (
              <Link key={cat.id} to={`/category/${cat.id}`} className="era-card-large">
                <div className="era-card-image">
                  {cat.image_url ? (
                    <img src={cat.image_url} alt={cat.category_name} />
                  ) : (
                    <span className="category-name">{cat.category_name}</span>
                  )}
                </div>
                <div className="era-card-info">
                  <h3>{cat.category_name}</h3>
                  <p>{itemCount} items</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
