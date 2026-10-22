/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#171717',
    tint: '#ef4b12',

    // Core surfaces
    background: '#ffffff',
    foreground: '#171717',

    // Cards / elevated surfaces
    card: '#ffffff',
    cardForeground: '#171717',

    // Primary action color (buttons, links, active states)
    primary: '#f45116',
    primaryForeground: '#ffffff',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#f3f5f3',
    secondaryForeground: '#202720',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#f3f5f3',
    mutedForeground: '#767b78',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#eaf5ed',
    accentForeground: '#23643a',

    // Destructive actions (delete, error states)
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#e6e9e7',
    input: '#e6e9e7',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 12,
};

export default colors;
