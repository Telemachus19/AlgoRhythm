export const COLORS = {
  bg: "#0a0a0a",
  green: "#39ff14",
  red: "#ff003c",
  blue: "#00f3ff",
  gray: "#666666",
  white: "#ffffff",
  darkGray: "#333333",
};
const FAMILIES = [
  "'VT323', monospace",
  "'Share Tech Mono', monospace",
  "'Jersey 10', monospace",
  "'Jersey 25', monospace",
  "'Courier New', monospace",
];

let activeFontIndex = 0;

// Mutable Font Object
export const FONTS = {
  main: "32px 'VT323', monospace",
  header: "bold 64px 'VT323', monospace",
  small: "24px 'VT323', monospace",
  huge: "bold 100px 'VT323', monospace",
};

export function cycleFont(direction) {
  activeFontIndex =
    (activeFontIndex + direction + FAMILIES.length) % FAMILIES.length;
  const family = FAMILIES[activeFontIndex];

  FONTS.main = `32px ${family}`;
  FONTS.header = `bold 64px ${family}`;
  FONTS.small = `24px ${family}`;
  FONTS.huge = `bold 100px ${family}`;
}

export function getCurrentFontName() {
  return FAMILIES[activeFontIndex].split(",")[0].replace(/'/g, "");
}
