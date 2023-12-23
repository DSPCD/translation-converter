const VERSION = "0.10.28.21011";

const CROWDIN_URL = "https://crowdin.com/backend/download/project/dyson-sphere-program/";

class Locale {
  constructor(name, folder, latin) {
    this.name = name;
    this.folder = folder;
    this.latin = latin;
  }
}

const LOCALES = new Map();

LOCALES.set("af", new Locale("Afrikaans", 1078, 0));
LOCALES.set("ar", new Locale("Arabic", 14337, 0));
LOCALES.set("ca", new Locale("Catalan", 1027, 0));
LOCALES.set("cs", new Locale("Czech", 1029, 0));
LOCALES.set("da", new Locale("Danish", 1030, 0));
LOCALES.set("de", new Locale("German", 1031, 0));
LOCALES.set("el", new Locale("Greek", 1032, 0));
LOCALES.set("en", new Locale("English", 2057, 0));
LOCALES.set("es_ES", new Locale("Spanish", 1034, 0));
LOCALES.set("fi", new Locale("Finnish", 1035, 0));
LOCALES.set("fr", new Locale("French", 1036, 0));
LOCALES.set("he", new Locale("Hebrew", 1037, 0));
LOCALES.set("hu", new Locale("Hungarian", 1038, 0));
LOCALES.set("it", new Locale("Italian", 1040, 0));
LOCALES.set("ja", new Locale("Japanese", 1041, 1));
LOCALES.set("ko", new Locale("Korean", 1042, 1));
LOCALES.set("nl", new Locale("Dutch", 1043, 0));
LOCALES.set("no", new Locale("Norwegian", 1044, 0));
LOCALES.set("pl", new Locale("Polish", 1045, 0));
LOCALES.set("pt_BR", new Locale("Portuguese Brazilian", 1046, 0));
LOCALES.set("pt_PT", new Locale("Portuguese", 2070, 0));
LOCALES.set("ro", new Locale("Romanian", 1048, 0));
LOCALES.set("ru", new Locale("Russian", 1049, 0));
LOCALES.set("sq", new Locale("Albanian", 1052, 0));
LOCALES.set("sr", new Locale("Serbian (Cyrillic)", 3098, 0));
LOCALES.set("sv_SE", new Locale("Swedish", 1053, 0));
LOCALES.set("tr", new Locale("Turkish", 1055, 0));
LOCALES.set("uk", new Locale("Ukrainian", 1058, 0));
LOCALES.set("vi", new Locale("Vietnamese", 1066, 0));
LOCALES.set("zh_CN", new Locale("Chinese Simplified", 2052, 0));
LOCALES.set("zh_TW", new Locale("Chinese Traditional", 1028, 0));

const TRANSLATION_FIX = {
  "base_ImageLogo0_5": "UI/Textures/dsp-logo-en",
  "base_ImageLogo1_5": "UI/Textures/dsp-logo-flat-en",
  "base_ImageLogo2_0": "UI/Textures/dsp-logo-flat-en",
  "base_AudioResPostfix_5": "-en",
  "base_ResPostfix_5": "-en",
  "base_CutsceneBGM0_0": "Musics/df-cutscene-en",
}

let SELECTED_LOCALE = 'en';

// populate the drop-down list
function initLocales() {
  let selectElement = document.getElementById("locale-selection");
  LOCALES.forEach(function (value, key) {
    const optionElement = document.createElement("option");
    optionElement.value = key;
    optionElement.textContent = value.name;
    if (key == SELECTED_LOCALE) {
      optionElement.selected = true;
    }
    selectElement.appendChild(optionElement);
  });
}

function updateLocale(select) {
  SELECTED_LOCALE = select.value;
}

async function downloadTranslation() {
  // initialize zip
  let translationZip = new JSZip();

  // get json file directly from crowdin project -- NOT WORKING YET
  //let crowdinZip = await downloadCrowdinZip();

  // generate header.txt file and add to the zip
  translationZip.file("Header.txt", generateHeader());

  // create language folder in zip for translation txt files
  let translationsFolder = translationZip.folder(LOCALES.get(SELECTED_LOCALE).folder);
  // convert json to a map containing a blob for each file
  // then add each file in the language folder
  convertTranslations().then(function (translationFiles) {
    translationFiles.forEach(function (value, key) {
      translationsFolder.file(key.concat(".txt"), value);
    });
    // generate and download zip
    translationZip
      .generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, "translation.zip");
      });
  });
}

async function downloadCrowdinZip() {
  let translationUrl = CROWDIN_URL.concat(SELECTED_LOCALE.replace("_", "-")).concat(".zip");
  try {
    const response = await fetch(translationUrl, {
      mode: "no-cors",
      headers: {
        "Content-Type": "application/zip"
      }
    });
    const crowdinZip = await response.blob();
    return crowdinZip;
  } catch (error) {
    console.error(`Download error: ${error.message}`);
  }
}

function generateHeader() {
  let localeProps = LOCALES.get(SELECTED_LOCALE);

  let headerHeader = `[Localization Project]
Version=1.1
2052,简体中文,zhCN,zh,1033,1
1033,English,enUS,en,2052,0`

  let headerFooter = `
base=0
combat=0
prototype=-1
dictionary=3
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

async function convertTranslations() {
  return new Promise((resolve, reject) => {
    const input = document.getElementById("FileInput");
    const file = input.files[0];
    const reader = new FileReader();

    if (!file) {
      reject(new Error("No file selected"));
      return;
    }

    if (!file.name.toLowerCase().endsWith('.json')) {
      reject(new Error("Wrong file type (expected json)"));
      return;
    }

    reader.onload = function () {
      const jsonString = reader.result;
      const jsonData = JSON.parse(jsonString);
      resolve(createFilesFromJson(jsonData));
    };

    reader.onerror = function () {
      reject(new Error("Error reading file"));
    };

    reader.readAsText(file);
  });
}

function createFilesFromJson(data) {
  let filename = null;
  let fileContent = "";
  let translationFiles = new Map();

  function closeResetFile(newFilename) {
    const utf16leContent = new TextEncoder("utf-16le").encode(fileContent);
    const blob = new Blob([utf16leContent], { type: "text/plain;charset=utf-16le" });
    translationFiles.set(filename, blob);
    filename = newFilename;
    fileContent = "";
  }

  const keysArray = Object.keys(data);

  Object.keys(data).forEach(function (key) {
    let file, original, questionMark, num;

    let value = data[key].replace(/\n/g, "\\n").replace(/\r/g, "\\r");

    let props = key.split("_");

    if (props.length === 3) {
      [file, original, num] = props;
      questionMark = "";
    }
    else if (props.length === 4) {
      [file, original, questionMark, num] = props;
    }

    if (filename === null) {
      filename = file;
    }
    else if (file !== filename) {
      closeResetFile(file);
    }

    if (TRANSLATION_FIX[key]) {
      fileContent += `${original}\t${questionMark}\t${num}\t${TRANSLATION_FIX[key]}\n`;
    } else {
      if (key === "base_需要重启完全生效_3") {
        fileContent += `${original}\t${questionMark}\t${num}\t${value} v.${VERSION}\r`;
      } else {
        fileContent += `${original}\t${questionMark}\t${num}\t${value}\r`;
      }
    }
  })

  closeResetFile(filename);

  return translationFiles;
}