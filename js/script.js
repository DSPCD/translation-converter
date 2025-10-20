const VERSION = "0.10.33.27005";

const LASTUPDATE = "Updated 20 October 2025";

document.getElementById('game-version').innerHTML = `v. ${VERSION}`;
document.getElementById('last-update').innerHTML = `${LASTUPDATE}`;

const CROWDIN_URL = "https://crowdin.com/backend/download/project/dyson-sphere-program/";

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

const body = document.body;

function getRandomImage() {
  const randomIndex = Math.floor(Math.random() * bgImages.length);
  return bgImages[randomIndex];
}

function checkWebpSupport() {
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

function changeBackgroundImage() {
  let basePath = window.location.origin + window.location.pathname;
  const selectedImage = getRandomImage();
  const extension = checkWebpSupport() ? 'webp' : 'jpg';
  const imageUrl = `${selectedImage.img}.${extension}`;
  body.style.backgroundImage = `url('${basePath}assets/bg/${imageUrl}')`;
  let bgCreditBlock = document.getElementById('bg-credit-block');
  let bgCredit = document.getElementById('bgcredit');
  if(selectedImage.credit){
    bgCreditBlock.classList.remove('hidden');
    bgCredit.textContent = selectedImage.credit;
  } else{
    bgCreditBlock.classList.add('hidden');
    bgCredit.textContent = "";
  }
  
}
changeBackgroundImage();

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

const SOURCEVARIABLES = {
  "base_配送线路数量提示1_3": "{0} available route(s) / {1} route(s) out of range"
}

let SELECTED_LOCALE = !localStorage.dspConverterLang ? 'en' : localStorage.dspConverterLang;

let SOURCE;
async function fetchData() {
  try {
    const response = await fetch('./js/DysonSphereProgram_The_Dark_Fog.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    SOURCE = await response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}
fetchData();

let ERRORSTRINGS = {}

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
  localStorage.dspConverterLang = SELECTED_LOCALE;
}

async function downloadTranslation() {
  clearErrors();
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
  const formattedLocale = SELECTED_LOCALE.replace("_", "-");
  convertTranslations()
    .then(function (translationFiles) {
      if(translationFiles){
        translationFiles.forEach(function (value, key) {
          translationsFolder.file(key.concat(".txt"), value);
        });
        // generate and download zip
        translationZip
          .generateAsync({ type: "blob" })
          .then(function (content) {
            saveAs(content, `dsp-translation-${formattedLocale}.zip`);
          })
          .catch(function (error) {
            errorHandler(error);
          });
      }
    })
    .catch(function (error) {
      errorHandler(error);
    });;
}

// -- NOT WORKING YET
// async function downloadCrowdinZip() {
//   let translationUrl = CROWDIN_URL.concat(SELECTED_LOCALE.replace("_", "-")).concat(".zip");
//   try {
//     const response = await fetch(translationUrl, {
//       mode: "no-cors",
//       headers: {
//         "Content-Type": "application/zip"
//       }
//     });
//     const crowdinZip = await response.blob();
//     return crowdinZip;
//   } catch (error) {
//     console.error(`Download error: ${error.message}`);
//   }
// }

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
      let jsonData;
      try {
        jsonData = JSON.parse(jsonString);
      } catch (error) {
        reject(new Error("JSON parsing: ".concat(error)));
        return;
      }
      resolve(createFilesFromJson(jsonData));
    };

    reader.onerror = function () {
      reject(new Error("File reading failed"));
    };

    reader.readAsText(file);
  });
}

function Copy(element){
  let text_to_copy = element.value;
  element.select();
  if (!navigator.clipboard){
    // use old commandExec() way
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
  } else{
    navigator.clipboard.writeText(text_to_copy).then(
      function(){
        console.log("text copied!"); // success 
      })
    .catch(
      function() {
      console.log("error copying text"); // error
    });
  }
}

function createFilesFromJson(data) {
  let error = false;
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

  let errorStrings = document.getElementById('error-strings');
  let stringsWithError = "";
  
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

    if(SOURCE[key]){
      let sourceVariables = SOURCE[key].match(/\{(\d+|\[\d+\])\}/g);
      if(sourceVariables){
        let containsVariable = sourceVariables.every(variable => value.includes(variable));
        if(!containsVariable){
          error = true;
          stringsWithError = `<div class="string-with-error">
          <div class="key">
            <span class="text">Key:</span>
            <input type="text" readonly class="text" onclick="Copy(this)" value=${key}>
          </div>
          <div class="source">
            <span class="text">Source:</span>
            <span class="translation-text">${SOURCE[key]}</span>
          </div>
          <div class="translation">
            <span class="text">Translation:</span>
            <span class="translation-text">${value}</span>
          </div>`;

          sourceVariables.forEach((variable, index) => {
            if (!value.includes(variable)) {
              //missingPlaceholders.push(variable);
              stringsWithError += `<div class="missing">
              <span class="text">Missing variables:</span>
              <span class="variable-missing">${variable}</span>
              </div>`
            }
          });
          stringsWithError += `</div>`;
          
          errorStrings.innerHTML += stringsWithError;
          
        }
      }
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

  if(error){
    stringsWithError = `<div class="translation-error">⚠ TRANSLATION WITH ERROR, NEEDS A FIX OR IT WILL NOT WORK ⚠</div>`;
    errorStrings.insertAdjacentHTML('afterbegin', stringsWithError)
  }

  closeResetFile(filename);
  if(!error){
    return translationFiles;
  }
  
}

function errorHandler(error) {
  console.log(error);
  updateErrors(error);
}

function clearErrors() {
  updateErrors("");
}

function updateErrors(error) {
  const errorDisplay = document.getElementById("ErrorDisplay");
  errorDisplay.textContent = error;
}


document.querySelectorAll('.tabsnav ul li').forEach((tab, index) => {
  tab.addEventListener('click', () => {
    const tabsContainer = tab.closest('.tabbedContent');
    const tabsNav = tabsContainer.querySelectorAll('.tabsnav ul li');
    const tabsContent = tabsContainer.querySelectorAll('.tabscontent .tab');
    tabsNav.forEach((navItem) => navItem.classList.remove('active'));
    tab.classList.add('active');
    tabsContent.forEach((contentItem) => contentItem.classList.remove('active'));
    tabsContent[index].classList.add('active');
  });
});
