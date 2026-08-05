import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

import { readOnboarding, saveOnboarding } from '../onboarding';

// value = the era stored in the database; label = what the shopper reads.
// pic = a real listing photo that reads instantly at thumbnail size.
const ERAS = [
  { value: '1970s', label: '’70s', blurb: 'Disco, denim, warm wood', pic: 'TRR-70S-FUR-1003' },
  { value: '1980s', label: '’80s', blurb: 'Neon, chrome, big sound', pic: 'TRR-80S-TOY-2005' },
  { value: '1990s', label: '’90s', blurb: 'Grunge, plastic, first tech', pic: 'TRR-90S-ELE-3012' },
  { value: '2000s', label: 'Y2K', blurb: 'Shine, flip phones, gadgets', pic: 'TRR-Y2K-CLO-4006' },
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
      options: ERAS.map((e) => ({
        key: e.value,
        label: e.label,
        blurb: e.blurb,
        pic: e.pic,
        on: eras.includes(e.value),
        toggle: () => toggle(setEras, e.value),
      })),
      chosen: eras.length,
    },
    {
      title: 'What do you hunt for?',
      options: categories.map((c) => ({
        key: c.id,
        label: c.category_name,
        blurb: null,
        pic: CATEGORY_PICS[c.category_name],
        on: categoryIds.includes(c.id),
        toggle: () => toggle(setCategoryIds, c.id),
      })),
      chosen: categoryIds.length,
    },
  ];

  const q = questions[step];
  const isLast = step === questions.length - 1;

  return (
    <div className="auth-page">
      <div className="auth quiz">
        <span className="logo">
          The <span className="rest">Rest</span> is <span className="retro">Retro</span>
        </span>
        <p className="tagline">Two quick questions and your feed is ready.</p>

        <div className="dots">
          {questions.map((_, i) => (
            <i key={i} className={i <= step ? 'on' : ''} />
          ))}
        </div>

        <h1>{q.title}</h1>

        <div className="opts">
          {q.options.map((o) => (
            <button
              key={o.key}
              type="button"
              className={`opt ${o.on ? 'on' : ''}`}
              onClick={o.toggle}
            >
              {o.pic && <img src={`/item-images/${o.pic}.jpg`} alt="" />}
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
            onClick={() => (isLast ? finish({ eras, categoryIds }) : setStep(step + 1))}
          >
            {isLast ? 'Show me my finds' : 'Next'}
          </button>
        </div>

        <button className="skip" onClick={() => finish({ eras: [], categoryIds: [] })}>
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default Welcome;
