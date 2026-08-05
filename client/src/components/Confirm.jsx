import { Link, Navigate, useLocation } from 'react-router-dom';

import { eraLabel, formatPrice, itemImage } from './ItemCard';
import { useSession } from '../contexts/SessionContext';

const Confirm = () => {
  const { state } = useLocation();
  const { user } = useSession();

  if (!state?.item) {
    return <Navigate to="/" replace />;
  }

  const { item, orderRef, categoryName, seller } = state;

  return (
    <div className="confirm-page">
      <div className="done">
        <div className="medal">✓</div>
        <h1>It’s yours!</h1>
        <div className="sub">
          Purchase confirmed{seller ? ` — ${seller.username} has been notified` : ''} and your relic
          ships within 2 working days.
        </div>

        <div className="order">
          <img src={itemImage(item)} alt={item.title} />
          <div>
            <div className="t">{item.title}</div>
            <div className="s">
              {eraLabel(item.era)}{categoryName ? ` · ${categoryName}` : ''}{seller ? ` · sold by ${seller.username}` : ''}
            </div>
          </div>
          <div className="p">{formatPrice(item.price)}</div>
        </div>
        <div className="ref">
          Order ref: {orderRef}{user.username ? ` · ${user.username}` : ''}
        </div>

        <div className="actions">
          <Link className="btn btn-primary btn-big" to="/">Keep digging</Link>
        </div>

        <div className="tagline">The rest is history.</div>
      </div>
    </div>
  );
};

export default Confirm;
