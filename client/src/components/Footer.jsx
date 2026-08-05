import { Link, useLocation } from "react-router-dom";

const ERAS = [
  ["All decades", "/"],
  ["’70s", "/?era=1970s"],
  ["’80s", "/?era=1980s"],
  ["’90s", "/?era=1990s"],
  ["Y2K", "/?era=2000s"],
];

const Footer = () => {
  // Card-flow screens (quiz, login, signup) are centered rituals — no footer there.
  const { pathname } = useLocation();
  if (["/welcome", "/login", "/signup"].includes(pathname)) return null;

  return (
    <footer className="site-footer">
      <div className="rule" aria-hidden="true" />
      <div className="wrap cols">
        <div>
          <div className="brand-name">
            The <span className="rest">Rest</span> is{" "}
            <span className="retro">Retro</span>
          </div>
          <p className="brand-line">Curated vintage, sold by decade.</p>
          <div className="stamp">Est. 2026 · London</div>
        </div>

        <div className="shop">
          <h3>Shop</h3>
          <ul>
            {ERAS.map(([label, href]) => (
              <li key={href}>
                <Link to={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="pair">
          <div>
            <h3>Sell</h3>
            <ul>
              <li>
                <Link to="/create-item">Sell an item</Link>
              </li>
              <li>
                <Link to="/my-listings">My listings</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>Help</h3>
            <ul>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/verification">How verification works</Link>
              </li>
              <li>
                <Link to="/faq#contact">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="base">
        <div className="wrap">
          <span>© 2026 The Rest is Retro · London</span>
          <div className="socials">
            <a href="#" aria-label="Instagram">
              IG
            </a>
            <a href="#" aria-label="Facebook">
              FB
            </a>
            <a href="#" aria-label="TikTok">
              TT
            </a>
            <a href="#" aria-label="X">
              X
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
