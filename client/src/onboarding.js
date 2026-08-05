// Onboarding preferences, stored in localStorage under `onboarding`.
// Shape: { eras: ['1980s'], categoryIds: [2, 4], done: true }
// Always stores DATA values (era '2000s', numeric category ids) — never display labels.

const KEY = 'onboarding';

export const readOnboarding = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return {
      eras: Array.isArray(parsed.eras) ? parsed.eras : [],
      categoryIds: Array.isArray(parsed.categoryIds) ? parsed.categoryIds.map(Number) : [],
      done: Boolean(parsed.done),
    };
  } catch {
    return null;
  }
};

export const saveOnboarding = ({ eras, categoryIds, done }) => {
  localStorage.setItem(KEY, JSON.stringify({ eras, categoryIds, done }));
};

// First-time visitors only: anyone with an account skips the quiz gate.
export const needsOnboarding = () =>
  !readOnboarding()?.done && !localStorage.getItem('authToken');
