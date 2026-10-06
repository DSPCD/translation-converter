const VERSION = "0.10.35.29104";

const LASTUPDATE = "06/10/2026"; // dd/mm/yyyy

const GA_ID = "G-TDNLFWC28N";

const $ = (id) => document.getElementById(id);

$('game-version').textContent = `v. ${VERSION}`;

// localStorage can throw (private mode, blocked site data)
function getPref(name) {
  try { return localStorage.getItem(name); } catch (e) { return null; }
}
function setPref(name, value) {
  try { localStorage.setItem(name, value); } catch (e) { /* not persisted */ }
}

const bgImages = [
  {img: "dspbg_0", credit: null},
  {img: "dspbg_1", credit: null},
  {img: "dspbg_2", credit: "u/sword112345"},
  {img: "dspbg_3", credit: "u/dbmsX"},
  {img: "dspbg_4", credit: "u/nthexwn"},
  {img: "dspbg_5", credit: "u/Sudden_Explorer_7280"},
  {img: "dspbg_6", credit: "u/dmigowski"},
  {img: "dspbg_7", credit: "u/fergusonia_ssi"},
  {img: "dspbg_8", credit: "u/FreyaAstral"},
  {img: "dspbg_9", credit: "u/Efficient-Frame-7334"},
  {img: "dspbg_10", credit: "u/KrAsTaLaR"},
];

// the game reads UTF-16LE with BOM (TextEncoder only does UTF-8)
function utf16le(text) {
  const out = new Uint16Array(text.length + 1);
  out[0] = 0xFEFF;
  for (let i = 0; i < text.length; i++) out[i + 1] = text.charCodeAt(i);
  return new Blob([out], { type: "text/plain" });
}

const BG_SECONDS = 20;
const BG_TICK_MS = 100;
let bgIndex = -1;
let bgRemainingMs = BG_SECONDS * 1000;
let autoBgTimer = null;

function renderBgTimer() {
  $('bg-timer-bar').style.width = `${(bgRemainingMs / (BG_SECONDS * 1000)) * 100}%`;
}

function changeBackgroundImage() {
  let index;
  do {
    index = Math.floor(Math.random() * bgImages.length);
  } while (index === bgIndex && bgImages.length > 1);
  bgIndex = index;
  const selectedImage = bgImages[index];
  document.body.style.backgroundImage = `url('src/assets/bg/${selectedImage.img}.webp')`;
  $('bg-credit-block').classList.toggle('hidden', !selectedImage.credit);
  $('bgcredit').textContent = selectedImage.credit || "";
  bgRemainingMs = BG_SECONDS * 1000;
  renderBgTimer();
}
changeBackgroundImage();

function setAutoBackground(on) {
  clearInterval(autoBgTimer);
  autoBgTimer = null;
  $('auto-bg').checked = on;
  $('bg-timer').hidden = !on;
  setPref('dspConverterAutoBg', on ? 'yes' : 'no');
  if (!on) return;
  bgRemainingMs = BG_SECONDS * 1000;
  renderBgTimer();
  autoBgTimer = setInterval(() => {
    if (document.hidden) return;
    bgRemainingMs -= BG_TICK_MS;
    if (bgRemainingMs <= 0) changeBackgroundImage();
    else renderBgTimer();
  }, BG_TICK_MS);
}

function loadAnalytics() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID);
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

function initConsent() {
  const choice = getPref('dspConverterAnalytics');
  if (choice === 'yes') {
    loadAnalytics();
    return;
  }
  if (choice === 'no') return;
  const banner = $('consent');
  const main = document.querySelector('main');
  const reserveSpace = () => { main.style.bottom = banner.hidden ? '' : `${banner.offsetHeight}px`; };
  banner.hidden = false;
  reserveSpace();
  window.addEventListener('resize', reserveSpace);
  const answer = (value) => {
    setPref('dspConverterAnalytics', value);
    banner.hidden = true;
    reserveSpace();
    if (value === 'yes') loadAnalytics();
  };
  $('consent-accept').addEventListener('click', () => answer('yes'));
  $('consent-decline').addEventListener('click', () => answer('no'));
}

class Locale {
  constructor(name, folder, latin) {
    this.name = name;
    this.folder = folder;
    this.latin = latin;
  }
}

const LOCALES = new Map();

LOCALES.set("af", new Locale("Afrikaans", 1078, 0));
LOCALES.set("sq", new Locale("Albanian", 1052, 0));
LOCALES.set("ar", new Locale("Arabic", 14337, 0));
LOCALES.set("ca", new Locale("Catalan", 1027, 0));
LOCALES.set("zh_CN", new Locale("Chinese Simplified", 2052, 1));
LOCALES.set("zh_TW", new Locale("Chinese Traditional", 1028, 1));
LOCALES.set("cs", new Locale("Czech", 1029, 0));
LOCALES.set("da", new Locale("Danish", 1030, 0));
LOCALES.set("nl", new Locale("Dutch", 1043, 0));
LOCALES.set("en", new Locale("English", 2057, 0));
LOCALES.set("fi", new Locale("Finnish", 1035, 0));
LOCALES.set("fr", new Locale("French", 1036, 0));
LOCALES.set("de", new Locale("German", 1031, 0));
LOCALES.set("el", new Locale("Greek", 1032, 0));
LOCALES.set("he", new Locale("Hebrew", 1037, 0));
LOCALES.set("hu", new Locale("Hungarian", 1038, 0));
LOCALES.set("it", new Locale("Italian", 1040, 0));
LOCALES.set("ja", new Locale("Japanese", 1041, 1));
LOCALES.set("ko", new Locale("Korean", 1042, 1));
LOCALES.set("no", new Locale("Norwegian", 1044, 0));
LOCALES.set("pl", new Locale("Polish", 1045, 0));
LOCALES.set("pt_BR", new Locale("Portuguese Brazilian", 1046, 0));
LOCALES.set("pt_PT", new Locale("Portuguese", 2070, 0));
LOCALES.set("ro", new Locale("Romanian", 1048, 0));
LOCALES.set("ru", new Locale("Russian", 1049, 0));
LOCALES.set("sr", new Locale("Serbian (Cyrillic)", 3098, 0));
LOCALES.set("es_ES", new Locale("Spanish", 1034, 0));
LOCALES.set("sv_SE", new Locale("Swedish", 1053, 0));
LOCALES.set("tr", new Locale("Turkish", 1055, 0));
LOCALES.set("uk", new Locale("Ukrainian", 1058, 0));
LOCALES.set("vi", new Locale("Vietnamese", 1066, 0));

const TRANSLATION_FIX = {
  "base_ImageLogo0_5": "UI/Textures/dsp-logo-en",
  "base_ImageLogo1_5": "UI/Textures/dsp-logo-flat-en",
  "base_ImageLogo2_0": "UI/Textures/dsp-logo-flat-en",
  "base_AudioResPostfix_5": "-en",
  "base_ResPostfix_5": "-en",
  "base_CutsceneBGM0_0": "Musics/df-cutscene-en",
}

const RESTART_KEY = "base_需要重启完全生效_3";

const EXTRA_FILES = [
  "[outsource].txt",
  "[user].txt",
  "combat.txt",
  "parameters.txt"
];

// Wiki tutorials: json keys "tutorial_<N>_<i>", i = index among the template's lines that are neither blank nor a {$...} directive
const TUTORIAL_PREFIX = "tutorial_";
const TUTORIAL_TEMPLATE = (number) => `./data/Wiki/tutorial/tutorial-${number}-en.txt`;

const tutorialNumbers = (data) => [...new Set(Object.keys(data)
  .map((key) => key.startsWith(TUTORIAL_PREFIX) ? Number(key.split("_")[1]) : null)
  .filter((number) => number !== null))].sort((a, b) => a - b);

// English template (CRLF) + translated values -> file text. Directives and blank lines come from the template;
// a missing or empty translation falls back to the English line. The caller writes it as UTF-8 with BOM.
function buildTutorialFile(template, number, data) {
  let index = 0;
  return template.replace(/^\uFEFF/, "").split("\r\n").map((line) => {
    if (line === "" || line.startsWith("{$")) return line;
    return data[`${TUTORIAL_PREFIX}${number}_${index++}`] || line;
  }).join("\r\n");
}

const PLACEHOLDER =/\{(?:\d+|\[\d+\])\}/g;
const TAG = /<\/?[a-zA-Z][^<>]*>/g;
// item icon codes such as \\tieb-; (matched on the raw text, where line breaks are still real characters)
const ICON_TAG = /\\+[a-zA-Z0-9]+-?;/g;

// browser language -> one of the LOCALES codes, or null
function detectLanguage() {
  const special = { nb: 'no', nn: 'no', sv: 'sv_SE', es: 'es_ES' };
  for (const tag of navigator.languages || [navigator.language]) {
    const [language, ...rest] = String(tag).replace('_', '-').split('-');
    const lang = language.toLowerCase();
    const region = (rest.find((part) => /^[A-Za-z]{2}$/.test(part)) || '').toUpperCase();
    let code = special[lang] || lang;
    if (lang === 'zh') code = rest.includes('Hant') || ['TW', 'HK', 'MO'].includes(region) ? 'zh_TW' : 'zh_CN';
    if (lang === 'pt') code = region === 'PT' ? 'pt_PT' : 'pt_BR';
    if (LOCALES.has(code)) return code;
  }
  return null;
}

let UI_LANGUAGE = getPref('dspConverterUi');
if (!LOCALES.has(UI_LANGUAGE)) UI_LANGUAGE = detectLanguage() || 'en';
let SELECTED_LOCALE = getPref('dspConverterLang');
if (!LOCALES.has(SELECTED_LOCALE)) SELECTED_LOCALE = UI_LANGUAGE;

// source strings, used to check that translations keep their {0} placeholders; fetched on first use
let sourcePromise = null;
function loadSource() {
  sourcePromise = sourcePromise || fetch('./data/DysonSphereProgram_The_Dark_Fog.json')
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .catch((error) => {
      sourcePromise = null; // allow a retry
      throw new Error(t('err_source', { message: error.message }));
    });
  return sourcePromise;
}

const NATIVE_NAMES = {
  af: 'Afrikaans', sq: 'Shqip', ar: 'العربية', ca: 'Català', zh_CN: '简体中文', zh_TW: '繁體中文', cs: 'Čeština',
  da: 'Dansk', nl: 'Nederlands', en: 'English', fi: 'Suomi', fr: 'Français', de: 'Deutsch', el: 'Ελληνικά',
  he: 'עברית', hu: 'Magyar', it: 'Italiano', ja: '日本語', ko: '한국어', no: 'Norsk', pl: 'Polski',
  pt_BR: 'Português Brasileiro', pt_PT: 'Português Europeu', ro: 'Română', ru: 'Русский', sr: 'Српски',
  es_ES: 'Español', sv_SE: 'Svenska', tr: 'Türkçe', uk: 'Українська', vi: 'Tiếng Việt',
};
const DISPLAY_TAGS = { sr: 'sr-Cyrl', zh_CN: 'zh-Hans', zh_TW: 'zh-Hant' };

function fillSelect(select, selected) {
  select.replaceChildren();
  LOCALES.forEach((value, key) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = NATIVE_NAMES[key] || value.name;
    option.selected = key === selected;
    select.appendChild(option);
  });
}

function initLocales() {
  fillSelect($("ui-language"), UI_LANGUAGE);
  fillSelect($("locale-selection"), SELECTED_LOCALE);
}

function renderLastUpdate() {
  const [day, month, year] = LASTUPDATE.split('/').map(Number);
  const tag = DISPLAY_TAGS[UI_LANGUAGE] || UI_LANGUAGE.replace('_', '-');
  let date = LASTUPDATE;
  try {
    const format = new Intl.DateTimeFormat([tag, 'en'], { dateStyle: 'long', timeZone: 'UTC' });
    // keep the plain dd/mm/yyyy when the browser has no data for this language (it would fall back to English)
    if (format.resolvedOptions().locale.split('-')[0] === tag.split('-')[0]) date = format.format(new Date(Date.UTC(year, month - 1, day)));
  } catch (error) { /* keep the raw dd/mm/yyyy */ }
  $('last-update').textContent = t('updated', { date });
}

function renderFileName() {
  const file = $("FileInput").files[0];
  $("file-name").textContent = file ? file.name : t("no_file_chosen");
}

function setUiLanguage(code) {
  UI_LANGUAGE = code;
  setPref('dspConverterUi', code);
  document.title = '';
  return I18N.setLanguage(code).then(() => { document.title = t('title'); });
}

// the last file that passed the check, and the zip built from it for the selected language
let checked = null;
let preparedZip = null;
let checkId = 0;

function updateLocale(select) {
  SELECTED_LOCALE = select.value;
  setPref('dspConverterLang', SELECTED_LOCALE);
  if (checked) { // the header and folder name depend on the language: build the zip again
    prepareZip();
    setStatus(t("checked_ok"));
  }
}

function setStatus(text) {
  $("status").textContent = text;
}

// the results card is only shown while it has something to say
function syncResults() {
  $("error-box").hidden = !$("ErrorDisplay").textContent;
  $("results").hidden = $("error-box").hidden && !$("error-strings").hasChildNodes();
}

function showError(error) {
  $("ErrorDisplay").textContent = error;
  syncResults();
}

function clearMessages() {
  $("error-strings").replaceChildren();
  showError("");
  setStatus("");
}

let busy = false;
function updateDownloadState() {
  const button = $("download-button");
  button.hidden = !checked; // only offered for a translation that passed the check
  button.disabled = busy; // and not clickable twice while the file is being saved
}

// the zip depends on the language (Header.txt, the numbered folder and the tutorial file names), so it is built per language
// layout: Locale/Header.txt, Locale/<folder>/*.txt and Wiki/Tutorial/tutorial-<N>-<locale>.txt
async function buildZip({ files, data }) {
  const locale = SELECTED_LOCALE; // everything language dependent is read before the first await
  const translationZip = new JSZip();
  const localeFolder = translationZip.folder("Locale");
  localeFolder.file("Header.txt", utf16le(generateHeader().replace(/\r?\n/g, "\r\n")));
  const translationsFolder = localeFolder.folder(LOCALES.get(locale).folder);
  files.forEach((blob, name) => translationsFolder.file(`${name}.txt`, blob));

  const extras = await Promise.all(EXTRA_FILES.map(async (name) => {
    const response = await fetch(`./data/static/${name}`);
    if (!response.ok) throw new Error(t("err_extra", { name, status: response.status }));
    return [name, await response.blob()];
  }));
  extras.forEach(([name, blob]) => translationsFolder.file(name, blob));

  // translations from before the tutorials existed have no tutorial keys: no Wiki folder for them
  const numbers = tutorialNumbers(data);
  const tutorialFolder = numbers.length ? translationZip.folder("Wiki").folder("Tutorial") : null;
  const templates = await Promise.all(numbers.map(async (number) => {
    const response = await fetch(TUTORIAL_TEMPLATE(number));
    if (!response.ok) throw new Error(t("err_extra", { name: `tutorial-${number}-en.txt`, status: response.status }));
    return [number, await response.text()];
  }));
  templates.forEach(([number, template]) => {
    tutorialFolder.file(`tutorial-${number}-${locale}.txt`, new Blob(["\uFEFF" + buildTutorialFile(template, number, data)], { type: "text/plain" }));
  });

  return {
    blob: await translationZip.generateAsync({ type: "blob" }),
    name: `dsp-translation-${locale.replace("_", "-")}.zip`,
  };
}

function prepareZip() {
  preparedZip = checked ? buildZip(checked) : null;
  if (preparedZip) preparedZip.catch(() => {}); // a failure is reported when Download is clicked
}

// choosing or dropping a file only checks it; nothing is downloaded until the button is clicked
async function checkFile() {
  const id = ++checkId;
  checked = null;
  preparedZip = null;
  updateDownloadState();
  const file = $("FileInput").files[0];
  if (!file) return;
  try {
    if (!file.name.toLowerCase().endsWith('.json')) throw new Error(t("err_type"));

    setStatus(t("checking"));
    const [source, text] = await Promise.all([loadSource(), file.text()]);
    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new Error(t("err_json", { message: error.message }));
    }

    const { files, problems, warnings } = createFilesFromJson(data, source);
    if (id !== checkId) return; // another file was chosen in the meantime
    renderProblems(problems, "error");
    renderProblems(warnings, "warning");
    if (problems.length) throw new Error(t("err_translation"));

    checked = { files, data };
    prepareZip();
    setStatus(t("checked_ok"));
  } catch (error) {
    if (id !== checkId) return;
    console.error(error);
    setStatus("");
    showError(error.message);
  } finally {
    if (id === checkId) updateDownloadState();
  }
}

async function downloadTranslation() {
  if (!preparedZip) return;
  busy = true;
  updateDownloadState();
  showError("");
  try {
    setStatus(t("converting"));
    const { blob, name } = await preparedZip;
    saveAs(blob, name);
    setStatus(t("done", { name }));
  } catch (error) {
    console.error(error);
    setStatus("");
    showError(error.message);
    prepareZip(); // allow another try
  } finally {
    busy = false;
    updateDownloadState();
  }
}

function generateHeader() {
  let localeProps = LOCALES.get(SELECTED_LOCALE);

  let headerHeader = `[Localization Project]
Version=1.1
2052,简体中文,zh-CN,zh,1033,1
1033,English,en-US,en,2052,0
1036,français,fr-FR,fr,1033,0,0
1031,Deutsch,de-DE,de,1033,0,0
1041,日本語,ja-JA,ja,1033,1,0
1042,한국어,ko-KO,ko,1033,1,0
3082,Español,es-ES,es,1033,0,0`

  let headerFooter = `
base=0
combat=0
creation=0
prototype=-1
keys=0
dictionary=3
parameters=0
[outsource]=-6
[user]=-9
`;

  let headerLocaleElements = [localeProps.folder,
  localeProps.name,
  SELECTED_LOCALE.replace(/_/g, ""),
    SELECTED_LOCALE,
    "1033",
  localeProps.latin];
  let headerBody = headerLocaleElements.join(",");

  let headerElements = [headerHeader, headerBody, headerFooter];

  return headerElements.join("\n");
}

function copyText(input) {
  input.select();
  if (navigator.clipboard) {
    navigator.clipboard.writeText(input.value).catch((error) => console.error("error copying text", error));
  } else {
    document.execCommand("copy");
  }
}

function h(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// kind "error" blocks the download, "warning" is informational
function renderProblems(problems, kind) {
  if (!problems.length) return;
  const container = $("error-strings");
  const isError = kind === "error";
  container.appendChild(h("div", isError ? "translation-error" : "translation-warning",
    t(isError ? "banner_error" : "banner_warning")));
  container.appendChild(h("div", "problem-count", t(isError ? "count_errors" : "count_warnings", { count: problems.length })));
  problems.forEach((problem) => {
    const box = h("div", `string-with-error${isError ? "" : " warning"}`);

    const keyRow = h("div", "key");
    keyRow.appendChild(h("span", "text", t("label_key")));
    const input = h("input", "text");
    input.type = "text";
    input.readOnly = true;
    input.value = problem.key;
    input.addEventListener("click", () => copyText(input));
    keyRow.appendChild(input);
    box.appendChild(keyRow);

    const sourceRow = h("div", "source");
    sourceRow.appendChild(h("span", "text", t("label_source")));
    sourceRow.appendChild(h("span", "translation-text", problem.source));
    box.appendChild(sourceRow);

    const translationRow = h("div", "translation");
    translationRow.appendChild(h("span", "text", t("label_translation")));
    translationRow.appendChild(h("span", "translation-text", problem.value));
    box.appendChild(translationRow);

    [["label_missing_vars", problem.missing], ["label_unexpected_vars", problem.unexpected],
      ["label_unbalanced_tags", problem.unbalancedTags], ["label_missing_tags", problem.missingTags],
      ["label_unexpected_tags", problem.unexpectedTags]].forEach(([label, list]) => {
      if (!list || !list.length) return;
      // one line per kind, with every item as a chip on it
      const row = h("div", "missing");
      row.appendChild(h("span", "text", t(label)));
      list.forEach((item) => row.appendChild(h("span", "variable-missing", item)));
      box.appendChild(row);
    });

    container.appendChild(box);
  });
  syncResults();
}

// real tabs/line breaks would break the tab-separated, one-entry-per-line format
function escapeValue(raw) {
  return raw
    // Matches the literal text "\n", UNLESS it's the start of a tag
    .replace(/\\n(?![a-zA-Z0-9]*-?;)/g, "\\\\n")
    // Matches the literal text "\r", UNLESS it's the start of a tag
    .replace(/\\r(?![a-zA-Z0-9]*-?;)/g, "\\\\r")
    .replace(/\t/g, "\\t")
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n");
}

// "<color=#fff>" -> "<color>", "</b>" -> "</b>"
function tagNames(text) {
  return (text.match(TAG) || []).map((tag) => tag.replace(/^<(\/?[a-zA-Z0-9]+)[^>]*>$/, "<$1>").toLowerCase());
}

// tag names whose opening and closing counts differ, e.g. "<color>" opened but never closed
function unbalancedTags(names) {
  const net = {};
  names.forEach((name) => {
    const bare = name.replace(/[</>]/g, "");
    net[bare] = (net[bare] || 0) + (name.startsWith("</") ? -1 : 1);
  });
  return Object.keys(net).filter((bare) => net[bare] !== 0).map((bare) => `<${bare}>`);
}

// items of "from" that are not matched one-to-one in "against"
function multisetDiff(from, against) {
  const left = [...against];
  return from.filter((item) => {
    const at = left.indexOf(item);
    if (at === -1) return true;
    left.splice(at, 1);
    return false;
  });
}

// returns { files: Map<name, Blob>, problems: [...], warnings: [...] }
// problems block the conversion (the game would break), warnings are cosmetic differences from the source
function createFilesFromJson(data, source) {
  const files = new Map();
  const problems = [];
  const warnings = [];
  let filename = null;
  let fileContent = "";

  // placeholders and tags of one string against the source: errors go to problems, tag differences to warnings
  const validate = (key, value) => {
    if (source[key]) {
      const expected = source[key].match(PLACEHOLDER) || [];
      const found = value.match(PLACEHOLDER) || [];
      const missing = expected.filter((variable) => !found.includes(variable));
      const unexpected = [...new Set(found.filter((variable) => !expected.includes(variable)))];

      const sourceTags = tagNames(source[key]);
      const valueTags = tagNames(value);
      const unbalanced = unbalancedTags(valueTags).filter((name) => !unbalancedTags(sourceTags).includes(name));
      const sourceIcons = source[key].match(ICON_TAG) || [];
      const valueIcons = data[key].match(ICON_TAG) || [];
      const missingTags = [...new Set([...multisetDiff(sourceTags, valueTags), ...multisetDiff(sourceIcons, valueIcons)])];
      const unexpectedTags = [...new Set([...multisetDiff(valueTags, sourceTags), ...multisetDiff(valueIcons, sourceIcons)])];

      const entry = { key, source: source[key], value };
      if (missing.length || unexpected.length || unbalanced.length) {
        problems.push({ ...entry, missing, unexpected, unbalancedTags: unbalanced });
      } else if (missingTags.length || unexpectedTags.length) {
        warnings.push({ ...entry, missingTags, unexpectedTags });
      }
    }
  };

  Object.keys(data).forEach(function (key) {
    const value = escapeValue(data[key]);

    // Wiki tutorial texts are not Locale files: checked like the others, built by buildTutorialFile()
    if (key.startsWith(TUTORIAL_PREFIX)) {
      validate(key, value);
      return;
    }

    const props = key.split("_");
    if (props.length !== 3 && props.length !== 4) {
      throw new Error(`Unexpected key format: ${key}`);
    }
    const file = props[0];
    const original = props[1];
    const questionMark = props.length === 4 ? props[2] : "";
    const num = props[props.length - 1];

    if (filename !== null && file !== filename) {
      files.set(filename, utf16le(fileContent));
      fileContent = "";
    }
    filename = file;

    validate(key, value);

    let text = value;
    if (TRANSLATION_FIX[key]) text = TRANSLATION_FIX[key];
    else if (key === RESTART_KEY) text = `${value} v.${VERSION}`;
    fileContent += `${original}\t${questionMark}\t${num}\t${text}\r\n`;
  });

  if (filename !== null) files.set(filename, utf16le(fileContent));
  return { files, problems, warnings };
}

// the page accepts a dropped file anywhere except the header
function initDragAndDrop() {
  const input = $("FileInput");
  let depth = 0;
  const hasFiles = (event) => event.dataTransfer && Array.from(event.dataTransfer.types).includes("Files");
  const inHeader = (event) => event.target instanceof Element && event.target.closest("header");
  const reset = () => { depth = 0; document.body.classList.remove("dragging", "drag-over"); };

  document.addEventListener("dragenter", (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    depth++;
    document.body.classList.add("dragging");
  });
  document.addEventListener("dragleave", (event) => {
    if (!hasFiles(event)) return;
    depth = Math.max(0, depth - 1);
    if (!depth) reset();
  });
  document.addEventListener("dragover", (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    const accepted = !inHeader(event);
    event.dataTransfer.dropEffect = accepted ? "copy" : "none";
    document.body.classList.toggle("drag-over", accepted);
  });
  document.addEventListener("drop", (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    const accepted = !inHeader(event);
    reset();
    if (!accepted || !event.dataTransfer.files.length) return;
    const transfer = new DataTransfer();
    transfer.items.add(event.dataTransfer.files[0]);
    input.files = transfer.files;
    input.dispatchEvent(new Event("change"));
  });
}

initLocales();
initConsent();
initDragAndDrop();
setAutoBackground(getPref('dspConverterAutoBg') === 'yes');
setUiLanguage(UI_LANGUAGE);
$("ui-language").addEventListener("change", (event) => setUiLanguage(event.target.value));
$("locale-selection").addEventListener("change", (event) => updateLocale(event.target));
$("download-button").addEventListener("click", downloadTranslation);
$("bg-button").addEventListener("click", changeBackgroundImage);
$("auto-bg").addEventListener("change", (event) => setAutoBackground(event.target.checked));
$("FileInput").addEventListener("change", () => {
  clearMessages();
  renderFileName();
  checkFile();
});
$("file-button").addEventListener("click", () => $("FileInput").click());
document.addEventListener("i18n", () => { renderLastUpdate(); renderFileName(); });
