export const BRAND = {
  name: "Retro",
  tagline: "Everything Vintage",

  colors: {
    light: {
      primary: "#B45F3D",
      secondary: "#6E715D",
      neutral: "#F4EDE2",
      dark: "#2F2F2F",
      background: "#FFFFFF",
      surface: "#F9F7F4",
      text: "#2F2F2F",
      textSecondary: "#6E715D",
      border: "#E8E3DB",
    },
    dark: {
      primary: "#D4866B",
      secondary: "#A1A399",
      neutral: "#2F2F2F",
      dark: "#F4EDE2",
      background: "#1A1A1A",
      surface: "#2A2A2A",
      text: "#F4EDE2",
      textSecondary: "#A1A399",
      border: "#3A3A3A",
    },
  },

  typography: {
    fontFamily: {
      serif: "'Cormorant', 'Playfair Display', serif",
      sans: "'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', sans-serif",
    },
    sizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
  },

  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },

  eras: [
    { id: "50s", name: "50s", label: "1950s" },
    { id: "60s", name: "60s", label: "1960s" },
    { id: "70s", name: "70s", label: "1970s" },
    { id: "80s", name: "80s", label: "1980s" },
    { id: "90s", name: "90s", label: "1990s" },
    { id: "00s", name: "00s", label: "2000s" },
  ],
};

export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
