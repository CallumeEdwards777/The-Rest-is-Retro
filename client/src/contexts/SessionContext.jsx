import { createContext, useState, useContext } from 'react';

export const SessionContext = createContext();

const loadStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('sessionUser')) || {};
  } catch {
    return {};
  }
};

export function SessionProvider({ children }) {
  const [user, setUserState] = useState(loadStoredUser);

  // Persist so the username survives a page refresh (the token already does)
  const setUser = (newUser) => {
    setUserState(newUser);
    localStorage.setItem('sessionUser', JSON.stringify(newUser));
  };

  return (
    <SessionContext.Provider value={{ user, setUser }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
