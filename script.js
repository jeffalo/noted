// globals
let files = [];
let fileList = [];
let currentFile = 0;
const filesDiv = document.querySelector(".files");
const splashtext = document.getElementById("splashtext");
const toolbar = {
  add: document.querySelector(".addbutton"),
  clearAll: document.querySelector(".delete-allbutton"),
  upload: document.querySelector(".uploadbutton")
};
const fileContent = document.getElementById("contents");
const fileName = document.getElementById("title");

// element setup
toolbar.add.addEventListener("click", function() {
  newFile();
});
toolbar.clearAll.addEventListener("click", function() {
  clearAll();
});
toolbar.upload.addEventListener("click", function() {
  uploadFile();
});

// sync with localstorage
function sync() {
  localStorage.clear();
  let names = [];
  for (let file of files) {
    localStorage.setItem(file.name, file.content);
    names.push(file.name);
  }
  localStorage.setItem("fileList", JSON.stringify(names));
  renderFileList();
}

// initial load
(() => {
  let fileList = JSON.parse(localStorage.getItem("fileList")) || [];
  for (let item of fileList) {
    console.log(item);
    var objectified = {
      name: item,
      content: localStorage.getItem(item)
    };
    files.push(objectified);
  }
  renderFileList();
  showSplashScreen();
})();

//files
function renderFileList() {
  filesDiv.innerHTML = "";
  for (let i in files) {
    let item = files[i];
    var fileDiv = document.createElement("div");
    fileDiv.addEventListener("click", function() {
      loadFile(i);
    });
    fileDiv.className = "file";
    fileDiv.title = item.name;
    fileDiv.id = "file_" + item.name;
    var a = document.createElement("a");
    a.className = "asdf-container";
    fileDiv.appendChild(a);
    var textnode = document.createTextNode(item.name);
    a.appendChild(textnode);
    var deleteBtn = document.createElement("button");
    deleteBtn.className = "Btn";
    deleteBtn.innerHTML = '<i class="material-icons fix-button">delete</i>';
    deleteBtn.title = "Delete this note";
    deleteBtn.addEventListener("click", function() {
      askRemoveFile(i);
    });
    fileDiv.appendChild(deleteBtn);

    var editBtn = document.createElement("button");
    editBtn.className = "Btn";
    editBtn.innerHTML = '<i class="material-icons fix-button">edit</i>';
    editBtn.title = "Rename note";
    editBtn.addEventListener("click", function() {
      askRenameFile(i);
    });
    fileDiv.appendChild(editBtn);

    var moreBtn = document.createElement("button");
    moreBtn.className = "Btn";
    moreBtn.innerHTML = '<i class="material-icons fix-button">more_horiz</i>';
    moreBtn.title = "More Options";
    moreBtn.addEventListener("click", function() {
      menu(moreBtn, {
        Share: _ => share(files[currentFile]),
        Download: _ =>
          saveTextAsFile(files[currentFile].content, files[currentFile].name)
      });
    });
    fileDiv.appendChild(moreBtn);

    filesDiv.appendChild(fileDiv);
  }
}

function loadFile(i) {
  let oldFile = currentFile;
  currentFile = i;
  let item = files[i];
  splashtext.classList.add("hidden");
  fileContent.classList.remove("hidden");
  fileName.innerText = item.name;
  fileContent.value = item.content;
  var fileDiv = document.getElementById("file_" + item.name);
  if (fileDiv == null) {
    console.log("🕳 fileDiv doesn't exist");
  } else {
    document
      .getElementById("file_" + files[oldFile].name)
      .classList.remove("selected");
    fileDiv.classList.add("selected");
  }
  autoExpand(fileContent);
}

function save() {
  var fileContent = document.getElementById("contents");
  var fileName = document.getElementById("title");
  files[currentFile] = { name: fileName.innerText, content: fileContent.value };
  sync();
}

function createFile(fileName, fileContent) {
  if (
    fileName == "fileList" ||
    fileName == "" ||
    fileList.includes(fileName) ||
    fileName == "notedllama"
  ) {
    //todo also remember to add check for used filename
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "File name error (You should never see this screen)",
      footer:
        '<a class="llama" href="https://i.etsystatic.com/14058045/r/il/d17ec2/1488837902/' +
        'il_570xN.1488837902_c9os.jpg" target="_blank">picture of llama to cheer you up</' +
        "a>"
    });
  } else {
    files.push({ name: fileName, content: fileContent });
    sync();
  }
}

async function nameInput(oldname) {
  return Swal.fire({
    title: "File name",
    text: `What do you want to ${oldname ? "re" : ""}name this awesome file?`,
    input: "text",
    showCancelButton: true,
    inputValidator: value => {
      if (!value) {
        return "You need to name it something!";
      }
      if (value == "fileList") {
        return "Sorry, that name is reserved";
      }
      if (fileList.includes(value)) {
        return "Sorry, that name is taken. (Deja vu?)";
      }
      if (value == "test") {
        return (
          '<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" class="llama">Sorry, that ' +
          "name is reserved</a>"
        );
      }
    }
  });
}

async function newFile() {
  let result = await nameInput();
  if (result.value) {
    createFile(result.value, "Nothing... Yet.");
  }
}

async function askRemoveFile(i) {
  let result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete " + escapeHtml(name) + "!"
  });
  if (result.value) {
    removeFile(i);
    Swal.fire({
      title: escapeHtml(name) + " was deleted",
      showCancelButton: false,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      position: "top-right",
      icon: "success"
    });
  }
}

function removeFile(i) {
  files.splice(i, 1);
  sync();
  showSplashScreen();
}

function showSplashScreen() {
  var fileContent = document.getElementById("contents");
  var fileName = document.getElementById("title");
  fileName.innerText = "noted text editor by jeffalo";
  fileContent.classList.add("hidden");
  splashtext.classList.remove("hidden");
}

function renameFile(i, newName) {
  files[i].name = newName;
  sync();
}

async function askRenameFile(i) {
  let result = await nameInput(files[i].name);
  if (result.value) {
    renameFile(i, result.value);
  }
}

function autoExpand(field) {
  // Reset field height
  field.style.height = "inherit";

  // Get the computed styles for the element
  var computed = window.getComputedStyle(field);

  // Calculate the height
  var height =
    parseInt(computed.getPropertyValue("border-top-width"), 10) +
    parseInt(computed.getPropertyValue("padding-top"), 10) +
    field.scrollHeight +
    parseInt(computed.getPropertyValue("padding-bottom"), 10) +
    parseInt(computed.getPropertyValue("border-bottom-width"), 10);

  field.style.height = height + "px";
}

document.addEventListener(
  "input",
  function(event) {
    if (event.target.tagName.toLowerCase() !== "textarea") return;
    autoExpand(event.target);
  },
  false
);

async function clearAll() {
  let result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete everything!"
  });
  if (result.value) {
    for (let i = files.length; i > -1; i--) {
      removeFile(i);
    }
    Swal.fire({
      title: "Notes cleared!",
      showCancelButton: false,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      position: "top-right",
      icon: "success"
    });
  }
}

function saveTextAsFile(textToWrite, fileNameToSaveAs) {
  var textFileAsBlob = new Blob([textToWrite], { type: "text/plain" });
  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL != null) {
    // Chrome allows the link to be clicked without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    // Firefox requires the link to be added to the DOM before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }

  downloadLink.click();
}

async function uploadFile() {
  const { value: file } = await Swal.fire({
    title: "Select text file",
    input: "file",
    inputAttributes: {
      accept: "text/*",
      "aria-label": "Upload a text file",
      id: "fileUploader"
    }
  });

  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      console.log(reader.result);
      var randomstring = makeid(10);
      if (fileList.includes(file.name)) {
        createFile(file.name + " - " + randomstring, reader.result);
      } else {
        createFile(file.name, reader.result);
      }
    };
    reader.readAsText(file);
  }
}

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const backend = (() => {
  function jsonp(url) {
    return new Promise(function(resolve, reject) {
      url = new URL(url);
      var callbackName = "_jsonp_" + new Date().valueOf().toString(36);
      let cleanup = function() {
        if (script) {
          script.remove();
        }
        window[callbackName] = _ => _;
      };
      window[callbackName] = function(data) {
        cleanup();
        resolve(data);
      };
      url.searchParams.set("callback", callbackName);
      script = document.createElement("script");
      script.src = url.href;
      document.head.appendChild(script);
    });
  }
  return {
    save: text => {
      return jsonp(
        "https://script.google.com/macros/s/AKfycbz1xZwaVsmLID617VGxyHTbUtstaTlw07NAn44Ja" +
          "7OrLyTpXIYG/exec?route=save&text=" +
          encodeURIComponent(text)
      );
    },
    get: id => {
      return jsonp(
        "https://script.google.com/macros/s/AKfycbz1xZwaVsmLID617VGxyHTbUtstaTlw07NAn44Ja" +
          "7OrLyTpXIYG/exec?route=get&id=" +
          encodeURIComponent(id)
      );
    }
  };
})();

(async () => {
  let params = new URLSearchParams(location.search);
  let importId = params.get("import");
  if (importId) {
    let loadToast = swal.fire({
      title: "Loading shared file...",
      showCancelButton: false,
      showConfirmButton: false,
      toast: true,
      position: "top-right",
      icon: "info"
    });
    history.pushState(null, document.title, "?");
    let { text } = await backend.get(importId);
    let newlineIndex = text.indexOf("\n");
    newlineIndex = newlineIndex == -1 ? 0 : newlineIndex;
    loadToast.closeToast();
    createFile(
      text.slice(0, newlineIndex) || "Untitled",
      text.slice(newlineIndex)
    );
    swal.fire({
      title: "File Loaded!",
      showCancelButton: false,
      showConfirmButton: false,
      toast: true,
      position: "top-right",
      icon: "success",
      timer: 5000
    });
  }
})();

async function share(file) {
  let loadToast = swal.fire({
    title: "Uploading file...",
    showCancelButton: false,
    showConfirmButton: false,
    toast: true,
    position: "top-right",
    icon: "info"
  });
  let { id } = await backend.save(file.name + "\n" + file.content);
  let shareLink = new URL(location.href);
  shareLink.searchParams.set("import", id);
  loadToast.closeToast();
  Swal.fire({
    title: "Share",
    text: "Your share link is " + shareLink.href,
    showCancelButton: false
  });
}

function menu(btn, buttons) {
  let menu = Swal.fire({
    html: "&nbsp;",
    onBeforeOpen: e => {
      for (let name in buttons) {
        let b = document.createElement("button");
        b.type = "button";
        b.className = "swal2-confirm swal2-styled";
        b.setAttribute(
          "style",
          "border-left-color: rgb(48, 133, 214); border-right-color: rgb(48, 133, 214);"
        );
        b.textContent = name;
        b.addEventListener("click", e=>{
          e.preventDefault();
          buttons[name]()
        });
        e.querySelector(".swal2-html-container").appendChild(b);
      }
    },
    showConfirmButton: false,
    showCancelButton: true,
    toast: true,
    grow: "column",
    position:"top-left",
    customClass: {
      popup: "menu-popup",
      content: "menu-content"
    }
  });
}
