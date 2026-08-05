import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';

import ItemCard from './ItemCard';
import { eraLabel } from './ItemCard';

const ERAS = ['1970s', '1980s', '1990s', '2000s'];

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [era, setEra] = useState('all');
  const [requiresLogin, setRequiresLogin] = useState(false);

  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (query) {
          const response = await api.get(`/api/items/search?search=${encodeURIComponent(query)}`);
          setItems(response.data.items);
        } else {
          const response = await api.get('/api/items');
          setItems(response.data);
        }
      } catch (error) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          setRequiresLogin(true);
          return;
        }

        console.error('Failed to fetch items', error);
      }
    };

    fetchItems();
  }, [query]);

  const visibleItems = era === 'all' ? items : items.filter((item) => item.era === era);
  const countFor = (e) => items.filter((item) => item.era === e).length;

  return (
    <>
      <section className="hero">
        <div className="wrap row">
          <div>
            <h1>Every era,<br /><span className="alt">still for sale.</span></h1>
            <p>Curated vintage sold by decade, not by drawer. Every listing checked and verified before it goes live.</p>
          </div>
          <div className="stamp">Est. 2026 · London<br />{items.length || 48} relics in stock</div>
        </div>
      </section>

      <main className="wrap">
        {requiresLogin ? (
          <p className="empty-note">
            Please <Link to="/login">log in</Link> to view items.
          </p>
        ) : (
          <>
            <div className="toolbar">
              <div className="chips">
                <button
                  className={`chip ${era === 'all' ? 'active' : ''}`}
                  onClick={() => setEra('all')}
                >
                  All decades <span className="count">{items.length}</span>
                </button>
                {ERAS.map((e) => (
                  <button
                    key={e}
                    className={`chip ${era === e ? 'active' : ''}`}
                    onClick={() => setEra(e)}
                  >
                    {e === '2000s' ? 'Y2K' : `’${e.slice(2, 4)}s`} <span className="count">{countFor(e)}</span>
                  </button>
                ))}
              </div>
              {query && <div className="sort">Results for “{query}” · <Link to="/">clear</Link></div>}
            </div>

            {visibleItems.length === 0 ? (
              <p className="empty-note">Nothing found{query ? ` for “${query}”` : ''}. Try another decade or search.</p>
            ) : (
              <div className="grid">
                {visibleItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </>
        )}

        <footer className="site-footer">
          <span>The Rest is Retro — curated vintage, sold by era.</span>
          <span>Eras: {ERAS.map(eraLabel).join(' · ')}</span>
        </footer>
      </main>
    </>
  );
};

export default ItemList;
