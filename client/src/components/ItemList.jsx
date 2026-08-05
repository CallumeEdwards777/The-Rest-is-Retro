import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';

import ItemCard from './ItemCard';
import { eraLabel } from './ItemCard';
import { readOnboarding } from '../onboarding';

const ERAS = ['1970s', '1980s', '1990s', '2000s'];

const ItemList = () => {
  // Answers from the welcome quiz become the starting filters. Empty = show everything.
  const prefs = readOnboarding();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pickedEras, setPickedEras] = useState(prefs?.eras || []);
  const [pickedCategories, setPickedCategories] = useState(prefs?.categoryIds || []);
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

  useEffect(() => {
    api.get('/api/categories')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Failed to fetch categories', error));
  }, []);

  const matchesEra = (item) => pickedEras.length === 0 || pickedEras.includes(item.era);
  const matchesCategory = (item) =>
    pickedCategories.length === 0 || pickedCategories.includes(item.category_id);

  const visibleItems = items.filter(matchesEra).filter(matchesCategory);
  const countFor = (e) => items.filter(matchesCategory).filter((item) => item.era === e).length;
  const countForCategory = (id) =>
    items.filter(matchesEra).filter((item) => item.category_id === id).length;

  const toggle = (setList, value) => {
    setList((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const personalised = pickedEras.length > 0 || pickedCategories.length > 0;

  return (
    <>
      <section className="hero">
        <div className="wrap row">
          <div>
            <h1>
              {personalised ? (
                <>Your favourites,<br /><span className="alt">back on sale.</span></>
              ) : (
                <>Every era,<br /><span className="alt">still for sale.</span></>
              )}
            </h1>
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
                  className={`chip ${pickedEras.length === 0 ? 'active' : ''}`}
                  onClick={() => setPickedEras([])}
                >
                  All decades <span className="count">{items.filter(matchesCategory).length}</span>
                </button>
                {ERAS.map((e) => (
                  <button
                    key={e}
                    className={`chip ${pickedEras.includes(e) ? 'active' : ''}`}
                    onClick={() => toggle(setPickedEras, e)}
                  >
                    {e === '2000s' ? 'Y2K' : `’${e.slice(2, 4)}s`} <span className="count">{countFor(e)}</span>
                  </button>
                ))}
              </div>
              {query && <div className="sort">Results for “{query}” · <Link to="/">clear</Link></div>}
            </div>

            <div className="chips chips-sub">
              <button
                className={`chip chip-small ${pickedCategories.length === 0 ? 'active' : ''}`}
                onClick={() => setPickedCategories([])}
              >
                All categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  className={`chip chip-small ${pickedCategories.includes(c.id) ? 'active' : ''}`}
                  onClick={() => toggle(setPickedCategories, c.id)}
                >
                  {c.category_name} <span className="count">{countForCategory(c.id)}</span>
                </button>
              ))}
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
