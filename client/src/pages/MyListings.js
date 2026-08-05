import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { itemsAPI } from "../utils/api";
import "../styles/pages/my-listings.css";

export default function MyListings() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    era: "70s",
    price_cents: "",
    category_id: "1",
    image: null,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchItems = async () => {
      try {
        const res = await itemsAPI.getAll();
        // Filter items by current user (seller_id = user.id)
        const userItems = res.data.filter((item) => item.seller_id === user.id);
        setItems(userItems);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [isAuthenticated, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("era", formData.era);
      form.append("price_cents", formData.price_cents);
      form.append("category_id", formData.category_id);
      form.append("seller_id", user.id);
      if (formData.image) {
        form.append("image", formData.image);
      }

      const res = await itemsAPI.create(form);
      setItems([...items, res.data]);
      setFormData({
        title: "",
        description: "",
        era: "70s",
        price_cents: "",
        category_id: "1",
        image: null,
      });
      setShowForm(false);
    } catch (err) {
      console.error("Error creating item:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await itemsAPI.delete(id);
        setItems(items.filter((item) => item.id !== id));
      } catch (err) {
        console.error("Error deleting item:", err);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="my-listings">
      <div className="container">
        <div className="listings-header">
          <h1>My Listings</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Add New Item"}
          </button>
        </div>

        {showForm && (
          <form className="listing-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <select
                value={formData.era}
                onChange={(e) => setFormData({ ...formData, era: e.target.value })}
              >
                <option>70s</option>
                <option>80s</option>
                <option>90s</option>
                <option>00s</option>
              </select>
              <input
                type="number"
                placeholder="Price (pence)"
                value={formData.price_cents}
                onChange={(e) => setFormData({ ...formData, price_cents: e.target.value })}
                required
              />
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              >
                <option value="1">Clothing</option>
                <option value="2">Electronics</option>
                <option value="3">Furniture</option>
                <option value="4">Vinyl & Music</option>
                <option value="5">Toys & Games</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create Listing
            </button>
          </form>
        )}

        {items.length === 0 ? (
          <div className="no-listings">
            <p>You haven't listed any items yet</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Create Your First Listing
            </button>
          </div>
        ) : (
          <div className="listings-table">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Era</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="thumbnail">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} />
                      ) : (
                        <div className="placeholder-thumb">{item.era}</div>
                      )}
                    </td>
                    <td>{item.title}</td>
                    <td>{item.era}</td>
                    <td>£{(item.price_cents / 100).toFixed(2)}</td>
                    <td>{item.status}</td>
                    <td className="actions">
                      <Link to={`/item/${item.id}`} className="btn btn-small">
                        View
                      </Link>
                      <button
                        className="btn btn-small btn-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
