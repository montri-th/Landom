// Owner-approved Landom UI subset from Google Fonts. Brand logos are separate.
export const UI_GLYPHS = Object.freeze(["account_tree", "article", "close", "emoji_events", "expand_less", "expand_more", "history", "language", "open_in_new", "pause", "play_arrow", "school", "search", "tune", "verified"]);
export function uiIconMarkup(name, className = "") {
  if (!UI_GLYPHS.includes(name) || !/^[a-zA-Z0-9 _-]*$/.test(className)) throw new Error("Unknown interface icon or unsafe class");
  return `<span class="ui-icon${className ? " " + className : ""}" aria-hidden="true">${name}</span>`;
}
