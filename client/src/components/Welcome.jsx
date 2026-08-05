import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

import { readOnboarding, saveOnboarding } from '../onboarding';

// value = the era stored in the database; label = what the shopper reads.
const ERAS = [
  { value: '1970s', label: '’70s', blurb: 'Disco, denim, warm wood' },
  { value: '1980s', label: '’80s', blurb: 'Neon, chrome, big sound' },
  { value: '1990s', label: '’90s', blurb: 'Grunge, plastic, first tech' },
  { value: '2000s', label: 'Y2K', blurb: 'Shine, flip phones, gadgets' },
];

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
      sub: 'Pick as many as you like — this shapes what you see first.',
      options: ERAS.map((e) => ({
        key: e.value,
        label: e.label,
        blurb: e.blurb,
        on: eras.includes(e.value),
        toggle: () => toggle(setEras, e.value),
      })),
      twoUp: true,
      chosen: eras.length,
    },
    {
      title: 'What do you hunt for?',
      sub: 'We’ll put your kind of relics at the top.',
      options: categories.map((c) => ({
        key: c.id,
        label: c.category_name,
        blurb: null,
        on: categoryIds.includes(c.id),
        toggle: () => toggle(setCategoryIds, c.id),
      })),
      twoUp: false,
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
        <p className="q-sub">{q.sub}</p>

        <div className={`opts ${q.twoUp ? 'two' : ''}`}>
          {q.options.map((o) => (
            <button
              key={o.key}
              type="button"
              className={`opt ${o.on ? 'on' : ''}`}
              onClick={o.toggle}
            >
              <span className="opt-label">{o.label}</span>
              {o.blurb && <span className="opt-blurb">{o.blurb}</span>}
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
