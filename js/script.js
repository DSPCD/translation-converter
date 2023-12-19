const locales = {
  "en": "English",
  "af": "Afrikaans",
  "ar": "Arabic",
  "ca": "Catalan",
  "cs": "Czech",
  "da": "Danish",
  "de": "German",
  "el": "Greek",
  "en": "English",
  "es_ES": "Spanish",
  "fi": "Finnish",
  "fr": "French",
  "he": "Hebrew",
  "hu": "Hungarian",
  "it": "Italian",
  "ja": "Japanese",
  "ko": "Korean",
  "nl": "Dutch",
  "no": "Norwegian",
  "pl": "Polish",
  "pt_BR": "Portuguese, Brazilian",
  "pt_PT": "Portuguese",
  "ro": "Romanian",
  "ru": "Russian",
  "sq": "Albanian",
  "sr": "Serbian (Cyrillic)",
  "sv_SE": "Swedish",
  "tr": "Turkish",
  "uk": "Ukrainian",
  "vi": "Vietnamese",
  "zh_CN": "Chinese Simplified",
  "zh_TW": "Chinese Traditional"
}

let languageNumber = {
  "af": 1078,
  "ar": 14337,
  "ca": 1027,
  "cs": 1029,
  "da": 1030,
  "de": 1031,
  "el": 1032,
  "en": 2057,
  "es_ES": 1034,
  "fi": 1035,
  "fr": 1036,
  "he": 1037,
  "hu": 1038,
  "it": 1040,
  "ja": 1041,
  "ko": 1042,
  "nl": 1043,
  "no": 1044,
  "pl": 1045,
  "pt_BR": 1046,
  "pt_PT": 2070,
  "ru": 1049,
  "sl": 1060,
  "sv_SE": 1053,
  "tr": 1055,
  "zh_CN": 2052,
  "zh_TW": 1028
}

let translationFix = {
  "base_ImageLogo0_5": "UI/Textures/dsp-logo-en",
  "base_ImageLogo1_5": "UI/Textures/dsp-logo-flat-en",
  "base_ImageLogo2_0": "UI/Textures/dsp-logo-flat-en",
  "base_AudioResPostfix_5": "-en",
  "base_ResPostfix_5": "-en",
  "base_CutsceneBGM0_0": "Musics/df-cutscene-en",
}


const selectElement = document.getElementById("locale-selection");

// Loop through the locales object and create an option element for each entry
for (const key in locales) {
  if (locales.hasOwnProperty(key)) {
    const optionElement = document.createElement("option");
    optionElement.value = key;
    optionElement.textContent = locales[key];
    selectElement.appendChild(optionElement);
  }
}

let LOCALE = 'en';
let LOCALEFOLDER = 2057;

function ConvertTranslations(){
  let input = document.getElementById('FileInput');
  let File = input.files[0];
  if (File) {
    let fileName = input.files[0].name;
    handleFileSelect(input)
  }
}

function copy(element){
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

function updateLocale(select){
  LOCALE = select.value;
  if(languageNumber[LOCALE]){
    LOCALEFOLDER = languageNumber[LOCALE];
    let localeNumber = document.getElementById('locale-folder');
    localeNumber.value = LOCALEFOLDER;
  } else {
    console.error("Error... Invalid language numeric code!")
  }
  output();
}

function output(){
  let outputDiv = document.getElementById('output');
  let latin = 0;

  if(LOCALE === "jp" || LOCALE === "ko"){
    latin = 1;
  }

  let content = `<div class="block">
  <div class="info">Copy the code below and paste in the file: Header.txt in the Locale folder under \\steamapps\\common\\Dyson Sphere Program\\Locale</div>
<textarea class="code" onclick=copy(this) readonly>
[Localization Project]
Version=1.1
2052,简体中文,zhCN,zh,1033,1
1033,English,enUS,en,2052,0
${LOCALEFOLDER},${locales[LOCALE]},${LOCALE.replace(/_/g,"")},${LOCALE},1033,${latin}

base=0
combat=0
prototype=-1
dictionary=3
[outsource]=-6
[user]=-9
</textarea>
  </div>`
  outputDiv.innerHTML = "";
  outputDiv.innerHTML = content;
  
}

function generateHeader(){
  let latin = 0;

  if(LOCALE === "jp" || LOCALE === "ko"){
    latin = 1;
  }

  let fileContent = `[Localization Project]
Version=1.1
2052,简体中文,zhCN,zh,1033,1
1033,English,enUS,en,2052,0
${LOCALEFOLDER},${locales[LOCALE]},${LOCALE.replace(/-/g,"")},${LOCALE},${LOCALEFOLDER},${latin}

base=0
combat=0
prototype=-1
dictionary=3
[outsource]=-6
[user]=-9
`;

  const utf16leContent = new TextEncoder("utf-16le").encode(fileContent);
  const blob = new Blob([utf16leContent], { type: "text/plain;charset=utf-16le" });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = 'Header.txt';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  output()
}

function handleFileSelect(input) {
  let File = input.files[0];
  let fileName = input.files[0].name;
  if (File) {
    const reader = new FileReader();
    reader.onload = function (e) {
      if (fileName.toLowerCase().endsWith('.json')) {
        try {
          const jsonString = e.target.result;
          const jsonData = JSON.parse(jsonString);
          createFilesFromJson(jsonData)
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      } else if (fileName.toLowerCase().endsWith('.xliff')) {
        let x2js = new X2JS();
        let json = x2js.xml_str2json(e.target.result);
        // createTranslation(json.xliff.file.body["trans-unit"])
      }
    };
    reader.readAsText(File);
  }
}
//createTranslationFiles()

function createFilesFromXliff(data){
  data.forEach(function(item){
    //console.log()
  })
}

function createFilesFromJson(data){
  let filename = null;
  let fileContent = "";
  let closeFile = false;

  function closeResetFile(fileContent,name){
    const utf16leContent = new TextEncoder("utf-16le").encode(fileContent);
    const blob = new Blob([utf16leContent], { type: "text/plain;charset=utf-16le" });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = name + '.txt';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  const keysArray = Object.keys(data);

  Object.keys(data).forEach(function(key,index){
    let value = data[key];
    let props = key.split("_")

    if(props.length === 3){
      let [file, original, num] = props;
      if(filename === null){
        filename = file
      }
      if(file !== filename){
        closeResetFile(fileContent,filename)
        filename = file;
        fileContent = "";
      }

      if(translationFix[key]){
        fileContent += `${original}\t\t${num}\t${translationFix[key]}\r`;
      } else {
        fileContent += `${original}\t\t${num}\t${value}\r`;
      }

      
    }

    if(props.length === 4){
      let [file, original, questionMark, num] = props;
      if(filename === null){
        filename = file
      }
      if(file !== filename){
        closeResetFile(fileContent,filename)
        filename = file;
      }

      if(translationFix[key]){
        fileContent +=`${original}\t${questionMark}\t${num}\t${translationFix[key]}\r`;
      } else {
        fileContent +=`${original}\t${questionMark}\t${num}\t${value}\r`;
      }
      
    }

    if (index === keysArray.length - 1) {
      closeResetFile(fileContent,filename)
    }

  })
}


$('.tabsnav ul li').click(function(){
  let currentTabIndex = $(this).index();
  let tabsContainer = $(this).closest('.tabbedContent');
  let tabsNav = $(tabsContainer).children('.tabsnav').children('ul').children('li');
  let tabsContent = $(tabsContainer).children('.tabscontent').children('.tab'); 
  $(tabsNav).removeClass('active');
  $(this).addClass('active');
  $(tabsContent).removeClass('active');
  $(tabsContent).eq(currentTabIndex).addClass('active');
});