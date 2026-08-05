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

// --- account-backed copy, so picks survive a new browser or device ---

export const pushPreferences = async (api, { eras, categoryIds }) => {
  try {
    await api.put('/api/users/me/preferences', { eras, categoryIds });
  } catch (error) {
    // never block the journey on this — the local copy is already saved
    console.error('Could not save preferences to the account', error);
  }
};

// Called right after login: the account's saved picks win over whatever
// this browser happened to remember.
export const pullPreferences = async (api) => {
  try {
    const { data } = await api.get('/api/users/me');
    const stored = data.user?.preferences;
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    const prefs = {
      eras: Array.isArray(parsed.eras) ? parsed.eras : [],
      categoryIds: Array.isArray(parsed.categoryIds) ? parsed.categoryIds.map(Number) : [],
      done: true,
    };
    saveOnboarding(prefs);
    return prefs;
  } catch (error) {
    console.error('Could not load preferences from the account', error);
    return null;
  }
};
