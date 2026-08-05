import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import "../styles/pages/cart.css";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container cart-empty">
        <h1>Shopping Cart</h1>
        <p>Your cart is empty</p>
        <Link to="/shop" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        <div className="cart-grid">
          {/* Cart Items */}
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} />
                  ) : (
                    <div className="placeholder">{item.era}</div>
                  )}
                </div>

                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p className="era">{item.era}</p>
                  <p className="price">£{((item.price_cents || 0) / 100).toFixed(2)}</p>
                </div>

                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}>−</button>
                  <input type="number" value={item.quantity || 1} readOnly />
                  <button onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}>+</button>
                </div>

                <div className="item-total">
                  £{(((item.price_cents || 0) / 100) * (item.quantity || 1)).toFixed(2)}
                </div>

                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>£{(cartTotal / 100).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>£0.00</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>£0.00</span>
            </div>
            <div className="summary-total">
              <span>Total:</span>
              <span>£{(cartTotal / 100).toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="btn btn-primary btn-full">
              Proceed to Checkout
            </Link>

            <button className="btn btn-outline btn-full" onClick={clearCart}>
              Clear Cart
            </button>

            <Link to="/shop" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
