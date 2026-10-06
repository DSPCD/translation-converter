// Minimal i18n: strings live in i18n/<code>.json, English is the fallback.
//   data-i18n="key"       sets textContent
//   data-i18n-html="key"  same, but understands <lime>..</lime> and <crowdin>..</crowdin>
//   data-i18n-aria="key"  sets aria-label
// Strings may contain {name} placeholders, filled by t(key, { name: ... }).
const CROWDIN_PROJECT_URL = "https://crowdin.com/project/dyson-sphere-program";
const RTL_LANGUAGES = ["ar", "he"];

const I18N = (() => {
  const cache = {};
  let current = "en";

  function load(code) {
    if (!cache[code]) {
      cache[code] = fetch(`./src/i18n/${code}.json`)
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json();
        })
        .catch(() => { delete cache[code]; return {}; });
    }
    return cache[code];
  }

  const strings = {};

  function t(key, params = {}) {
    const text = (strings[current] || {})[key] ?? (strings.en || {})[key] ?? key;
    return text.replace(/\{(\w+)\}/g, (match, name) => (name in params ? params[name] : match));
  }

  // builds nodes from a string with <lime> and <crowdin> markers, without innerHTML
  function rich(key, params) {
    const fragment = document.createDocumentFragment();
    const text = t(key, params);
    const marker = /<(lime|crowdin)>(.*?)<\/\1>/g;
    let last = 0;
    for (const match of text.matchAll(marker)) {
      fragment.append(text.slice(last, match.index));
      let node;
      if (match[1] === "lime") {
        node = document.createElement("span");
        node.className = "lime";
      } else {
        node = document.createElement("a");
        node.className = "lightgreen";
        node.href = CROWDIN_PROJECT_URL;
        node.target = "_blank";
        node.rel = "noopener";
      }
      node.textContent = match[2];
      fragment.append(node);
      last = match.index + match[0].length;
    }
    fragment.append(text.slice(last));
    return fragment;
  }

  function apply(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
    root.querySelectorAll("[data-i18n-html]").forEach((node) => { node.replaceChildren(rich(node.dataset.i18nHtml)); });
    root.querySelectorAll("[data-i18n-aria]").forEach((node) => { node.setAttribute("aria-label", t(node.dataset.i18nAria)); });
  }

  async function setLanguage(code) {
    [strings.en, strings[code]] = await Promise.all([load("en"), load(code)]);
    current = code;
    const base = code.split("_")[0];
    document.documentElement.lang = code.replace("_", "-");
    document.documentElement.dir = RTL_LANGUAGES.includes(base) ? "rtl" : "ltr";
    apply();
    document.dispatchEvent(new CustomEvent("i18n", { detail: code }));
  }

  return { t, setLanguage, get language() { return current; } };
})();

const t = I18N.t;
