import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

import AccountStep from './AccountStep';
import { readOnboarding, saveOnboarding } from '../onboarding';

// value = the era stored in the database; label = what the shopper reads.
const ERAS = [
  // blurbs name things visible in each photo that the shop actually sells
  { value: '1970s', label: '’70s', blurb: 'Flares, vinyl, turntables' },
  { value: '1980s', label: '’80s', blurb: 'Boomboxes, blazers, high-tops' },
  { value: '1990s', label: '’90s', blurb: 'Bombers, CD players, beige PCs' },
  { value: '2000s', label: 'Y2K', blurb: 'Metallics, iMacs, low-rise jeans' },
];

// Categories come from the API, so the picture is looked up by name and
// simply omitted if the team adds a category we have no photo for.
const CATEGORY_PICS = {
  Clothing: 'TRR-80S-CLO-2001',
  Electronics: 'TRR-90S-ELE-3007',
  Furniture: 'TRR-80S-FUR-2008',
  'Vinyl & Music': 'TRR-70S-VIN-1004',
  'Toys & Games': 'TRR-80S-TOY-2010',
};

const Welcome = () => {
  const navigate = useNavigate();
  const saved = readOnboarding();

  const [step, setStep] = useState(0);
  const [eras, setEras] = useState(saved?.eras || []);
  const [categoryIds, setCategoryIds] = useState(saved?.categoryIds || []);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/api/categories')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Failed to fetch categories', error));
  }, []);

  // Functional update so two fast taps in the same render batch both register.
  const toggle = (setList, value) => {
    setList((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const finish = (prefs) => {
    saveOnboarding({ ...prefs, done: true });
    navigate('/');
  };

  const questions = [
    {
      title: 'Which decades speak to you?',
      tiles: true,
      options: ERAS.map((e) => ({
        key: e.value,
        label: e.label,
        blurb: e.blurb,
        src: `/onboarding/${e.value}.jpg`,
        on: eras.includes(e.value),
        toggle: () => toggle(setEras, e.value),
      })),
      chosen: eras.length,
    },
    {
      title: 'What do you hunt for?',
      tiles: false,
      options: categories.map((c) => ({
        key: c.id,
        label: c.category_name,
        blurb: null,
        src: CATEGORY_PICS[c.category_name] && `/item-images/${CATEGORY_PICS[c.category_name]}.jpg`,
        on: categoryIds.includes(c.id),
        toggle: () => toggle(setCategoryIds, c.id),
      })),
      chosen: categoryIds.length,
    },
  ];

  // Last panel is the account step, so there is one dot more than there are questions.
  const accountStep = questions.length;
  const onAccountStep = step === accountStep;
  const q = questions[step];

  return (
    <div className="auth-page">
      <div className="auth quiz">
        <span className="logo">
          The <span className="rest">Rest</span> is <span className="retro">Retro</span>
        </span>
        <p className="tagline">Two quick questions and your feed is ready.</p>

        <div className="dots">
          {[...questions, 'account'].map((_, i) => (
            <i key={i} className={i <= step ? 'on' : ''} />
          ))}
        </div>

        {onAccountStep ? (
          <>
            <AccountStep
              picks={{ eras, categoryIds }}
              onDone={() => finish({ eras, categoryIds })}
            />
            <div className="quiz-nav">
              <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>
                Back
              </button>
            </div>
          </>
        ) : (
          <>
            <h1>{q.title}</h1>

            <div className={`opts ${q.tiles ? 'tiles' : ''}`}>
              {q.options.map((o) => (
                <button
                  key={o.key}
                  type="button"
                  className={`opt ${q.tiles ? 'tile' : ''} ${o.on ? 'on' : ''}`}
                  onClick={o.toggle}
                >
                  {o.src && <img src={o.src} alt="" />}
                  <span className="opt-text">
                    <span className="opt-label">{o.label}</span>
                    {o.blurb && <span className="opt-blurb">{o.blurb}</span>}
                  </span>
                  <span className="opt-tick">✓</span>
                </button>
              ))}
            </div>

            <div className="quiz-nav">
              {step > 0 && (
                <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>
                  Back
                </button>
              )}
              <button
                className="btn btn-primary"
                disabled={q.chosen === 0}
                onClick={() => setStep(step + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}

        <button
          className="skip"
          onClick={() => finish(onAccountStep ? { eras, categoryIds } : { eras: [], categoryIds: [] })}
        >
          {onAccountStep ? 'Just browse for now' : 'Skip for now'}
        </button>
      </div>
    </div>
  );
};

export default Welcome;
