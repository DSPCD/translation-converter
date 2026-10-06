// Tabs + the list of ready-made translations.
// The zips are assets of the GitHub releases (one release per game version); GitHub counts each asset download
// (download_count), which a static site can't do by itself. Asset name: DSP_<locale>_<game version>.zip
// e.g. DSP_pt_BR_0.10.35.29104.zip
const DOWNLOADS_API = "https://api.github.com/repos/DSPCD/translation-converter/releases?per_page=100"; // newest first

function showTab(name) {
  document.querySelectorAll(".tab").forEach((tab) => {
    const on = tab.dataset.tab === name;
    tab.setAttribute("aria-selected", on);
    tab.tabIndex = on ? 0 : -1;
    $(`panel-${tab.dataset.tab}`).hidden = !on;
  });
  if (name === "downloads") loadDownloads();
}

function formatSize(bytes) {
  return bytes < 1048576 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1048576).toFixed(1)} MB`;
}

let assets = null;
let loading = null;

function loadDownloads() {
  if (!assets && !loading) {
    $("downloads-status").textContent = "…";
    loading = fetch(DOWNLOADS_API)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((releases) => { assets = releases.flatMap((r) => r.assets).filter((a) => a.name.endsWith(".zip")); })
      .catch((error) => { console.error(error); assets = []; }) // ponytail: no retry, reload the page
      .then(renderDownloads);
  }
  if (assets) renderDownloads();
}

function renderDownloads() {
  if (!assets) return;
  const tag = DISPLAY_TAGS[UI_LANGUAGE] || UI_LANGUAGE.replace("_", "-");
  const date = new Intl.DateTimeFormat([tag, "en"], { dateStyle: "medium" });
  const rows = assets.map((asset) => {
    const code = (asset.name.match(/^DSP_(.+?)_v?\d/) || [])[1];
    const cell = (text, className) => {
      const td = document.createElement("td");
      td.textContent = text;
      if (className) td.className = className;
      return td;
    };
    const link = document.createElement("a");
    link.className = "dsp-button";
    link.href = asset.browser_download_url;
    link.textContent = t("download");
    const action = document.createElement("td");
    action.append(link);
    const row = document.createElement("tr");
    row.append(
      cell(asset.name, "file"),
      cell(NATIVE_NAMES[code] || code || "?"),
      cell(formatSize(asset.size), "num"),
      cell(date.format(new Date(asset.updated_at))),
      cell(asset.download_count.toLocaleString(tag), "num"),
      action,
    );
    return row;
  });
  $("downloads-body").replaceChildren(...rows);
  $("downloads-status").textContent = rows.length ? "" : t("dl_empty");
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => { location.hash = tab.dataset.tab === "convert" ? "" : tab.dataset.tab; });
});
window.addEventListener("hashchange", () => showTab(location.hash === "#downloads" ? "downloads" : "convert"));
document.addEventListener("i18n", renderDownloads);
showTab(location.hash === "#downloads" ? "downloads" : "convert");
