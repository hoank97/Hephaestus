// Constants
const THEME = "theme";
const LIGHT = "light";
const DARK = "dark";

// Initial color scheme
// Can be "light", "dark", or empty string for system's prefers-color-scheme
const initialColorScheme = LIGHT;

type Theme = typeof LIGHT | typeof DARK;

function isTheme(value: string | null | undefined): value is Theme {
  return value === LIGHT || value === DARK;
}

function getPreferTheme(): Theme {
  // get theme data from local storage (user's explicit choice)
  const currentTheme = localStorage.getItem(THEME);
  if (isTheme(currentTheme)) return currentTheme;
  if (currentTheme) localStorage.removeItem(THEME);

  // return initial color scheme if it is set (site default)
  if (isTheme(initialColorScheme)) return initialColorScheme;

  // return user device's prefer color scheme (system fallback)
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? DARK
    : LIGHT;
}

// Use existing theme value from inline script if available, otherwise detect
let themeValue = isTheme(window.theme?.themeValue)
  ? window.theme.themeValue
  : getPreferTheme();

function setTheme(val: string): void {
  themeValue = isTheme(val) ? val : getPreferTheme();
  if (window.theme) {
    window.theme.themeValue = themeValue;
  }
}

function setPreference(): void {
  localStorage.setItem(THEME, themeValue);
  reflectPreference();
}

function reflectPreference(): void {
  document.firstElementChild?.setAttribute("data-theme", themeValue);

  document
    .querySelector("#theme-btn")
    ?.setAttribute(
      "aria-label",
      `Switch to ${themeValue === LIGHT ? DARK : LIGHT} theme`
    );

  // Get a reference to the body element
  const body = document.body;

  // Check if the body element exists before using getComputedStyle
  if (body) {
    // Get the computed styles for the body element
    const computedStyles = window.getComputedStyle(body);

    // Get the background color property
    const bgColor = computedStyles.backgroundColor;

    // Set the background color in <meta theme-color ... />
    document
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", bgColor);
  }
}

// Update the global theme API
if (window.theme) {
  window.theme.themeValue = themeValue;
  window.theme.getTheme = () => themeValue;
  window.theme.setTheme = setTheme;
  window.theme.setPreference = setPreference;
  window.theme.reflectPreference = reflectPreference;
} else {
  window.theme = {
    themeValue,
    setPreference,
    reflectPreference,
    getTheme: () => themeValue,
    setTheme,
  };
}

// Ensure theme is reflected (in case body wasn't ready when inline script ran)
reflectPreference();

function setThemeFeature(): void {
  // set on load so screen readers can get the latest value on the button
  reflectPreference();

  // now this script can find and listen for clicks on the control
  const themeBtn = document.querySelector("#theme-btn");
  if (!themeBtn || themeBtn.getAttribute("data-theme-listener") === "true") {
    return;
  }

  themeBtn.setAttribute("data-theme-listener", "true");
  themeBtn.addEventListener("click", () => {
    themeValue = themeValue === LIGHT ? DARK : LIGHT;
    window.theme?.setTheme(themeValue);
    setPreference();
  });
}

// Set up theme features after page load
setThemeFeature();

// Runs on view transitions navigation
document.addEventListener("astro:after-swap", setThemeFeature);

// Set theme-color value before page transition
// to avoid navigation bar color flickering in Android dark mode
document.addEventListener("astro:before-swap", event => {
  const astroEvent = event;
  const bgColor = document
    .querySelector("meta[name='theme-color']")
    ?.getAttribute("content");

  if (bgColor) {
    astroEvent.newDocument
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", bgColor);
  }
});
