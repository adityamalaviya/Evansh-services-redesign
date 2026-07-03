/**
 * Design system tokens for Evanish Services
 */
export const tokens = {
  colors: {
    primary: {
      light: "#CCFBF1", // teal-100
      DEFAULT: "#14B8A6", // teal-500
      dark: "#0F766E", // teal-700
    },
    background: {
      light: "#F8FAFC", // slate-50
      DEFAULT: "#F1F5F9", // slate-100
    },
    text: {
      main: "#1E293B", // slate-800
      muted: "#64748B", // slate-500
    }
  },
  spacing: {
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  },
  animations: {
    transition: "transition-all duration-300 ease-in-out",
    hover: "hover:scale-105 hover:shadow-lg",
  }
} as const;
