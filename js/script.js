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
  "es-ES": "Spanish",
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
  "pt-BR": "Portuguese, Brazilian",
  "pt-PT": "Portuguese",
  "ro": "Romanian",
  "ru": "Russian",
  "sq": "Albanian",
  "sr": "Serbian (Cyrillic)",
  "sv-SE": "Swedish",
  "tr": "Turkish",
  "uk": "Ukrainian",
  "vi": "Vietnamese",
  "zh-CN": "Chinese Simplified",
  "zh-TW": "Chinese Traditional"
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
let LOCALEFOLDER = "1035"

function ConvertTranslations(){
  let input = document.getElementById('FileInput');
  let File = input.files[0];
  if (File) {
    let fileName = input.files[0].name;
    handleFileSelect(input)
  }
}

function updateLocale(select){
  console.log(select)
  LOCALE = select.value;
  console.log(LOCALE)
  output();
}

function updateLocaleFolder(input){
  console.log(input.value)
  if(input.value !== "2052" && input.value !== "1033" && input.value.length > 3){
    LOCALEFOLDER = input.value;
    console.log(LOCALEFOLDER)
    output();
  }
  
}

function output(){
  let outputDiv = document.getElementById('output');
  let latin = 0;

  if(LOCALE === "jp" || LOCALE === "ko"){
    latin = 1;
  }

  let content = `<div class="block">
  <div class="message">Place the downloaded files (base.txt, dictionary.txt and prototype.txt) inside your custom language folder (Create one if it doesn't exists) in \\steamapps\\common\\Dyson Sphere Program\\Locale, and update your Header.txt with the code below.</div>

  <div class="message">Copy the highlighted code below and paste in the file: Header.txt in the Locale folder under \\steamapps\\common\\Dyson Sphere Program\\Locale</div>
  <div class="code">
  [Localization Project]
  Version=1.1
  2052,简体中文,zhCN,zh,1033,1
  1033,English,enUS,en,2052,0
  1035,Portuguese,ptBR,pt-BR,1033,0

  base=0
  combat=0
  prototype=-1
  dictionary=3
  [outsource]=-6
  [user]=-9
  ${LOCALEFOLDER},${locales[LOCALE]},${LOCALE.replace(/-/g,"")},${LOCALE},${LOCALEFOLDER},${latin}
  base=0
  combat=0
  prototype=-1
  dictionary=3
  [outsource]=-6
  [user]=-9
  </div>
  </div>`
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
`

  const utf16leContent = new TextEncoder("utf-16le").encode(fileContent);
  const blob = new Blob([utf16leContent], { type: "text/plain;charset=utf-16le" });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = 'Header.txt';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

}

function handleFileSelect(input) {
  console.log(input.files)
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
    console.log()
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

      fileContent += `${original}\t\t${num}\t${value}\r`;
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

      fileContent +=`${original}\t\t${questionMark}\t${num}\t${value}\r`;
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