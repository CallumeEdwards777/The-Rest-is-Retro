import { createContext, useState, useContext } from "react";

// Create the context
export const ThemeContext = createContext();

// Theme provider component
export function ThemeProvider({ children }) {
  const [themeColor, setThemeColor] = useState("#ffffff"); // Default theme color is white

  const changeTheme = (color) => {
    setThemeColor(color);
  };

  return (
    <ThemeContext.Provider value={{ themeColor, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);