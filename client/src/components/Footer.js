import { Link } from "react-router-dom";
import "../styles/components/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        {/* Contact Column */}
        <div className="footer-column">
          <h4>Contact</h4>
          <p>info@yourbrand.com</p>
          <p>+44 (0)1234 567890</p>
          <p>Epochfield, UK</p>
        </div>

        {/* Quick Links Column */}
        <div className="footer-column">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/eras">Eras</Link>
          <Link to="/about">About</Link>
          <Link to="/faqs">FAQs</Link>
          <Link to="/returns">Returns & Shipping</Link>
        </div>

        {/* Socials Column */}
        <div className="footer-column">
          <h4>Follow Us</h4>
          <a href="#instagram">Instagram</a>
          <a href="#tiktok">TikTok</a>
          <a href="#pinterest">Pinterest</a>
          <a href="#facebook">Facebook</a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container">
          <p>© 2026 The Rest is Retro — All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
