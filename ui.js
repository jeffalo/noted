/* global globalThis */
import Swal from "https://cdn.pika.dev/sweetalert2@^9.7.1";
import * as ele from "/elements.js";
import * as files from "/files.js";
import * as store from "/store.js";
import * as utils from "/utils.js";
import * as backend from "/backend.js";

let menuFile = 0;

export function init() {
  ele.header.addEventListener("click", async function() {
    showSplashScreen();
  });
  document.addEventListener(
    "input",
    function(event) {
      if (event.target.tagName.toLowerCase() !== "textarea") return;
      autoExpand(event.target);
    },
    false
  );
  globalThis.currentFile = 0;
  ele.fileContent.addEventListener("input", function() {
    var fileContent = document.getElementById("contents");
    var fileName = document.getElementById("title");
    globalThis.files[globalThis.currentFile] = {
      name: fileName.innerText,
      content: fileContent.value
    };
    store.sync();
  });
  ele.toolbar.add.addEventListener("click", async function() {
    let result = await nameInput();
    if (result.value) {
      await files.createFile(result.value, "Nothing... Yet.");
    }
  });
  ele.toolbar.clearAll.addEventListener("click", async function() {
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
      for (let i = globalThis.files.length; i > -1; i--) {
        files.removeFile(i);
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
  });
  ele.toolbar.upload.addEventListener("click", async function() {
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
      files.importFile(file);
    }
  });
  ele.renameBtn.addEventListener("click", async e => {
    let result = await nameInput(globalThis.files[menuFile].name);
    if (result.value) {
      files.renameFile(menuFile, result.value);
    }
  });

  ele.deleteBtn.addEventListener("click", e => {
    if (ele.shiftKey) {
      files.removeFile(menuFile);
    } else {
      askRemoveFile(menuFile);
    }
  });

  ele.downloadBtn.addEventListener("click", e => {
    utils.saveTextAsFile(
      globalThis.files[menuFile].content,
      globalThis.files[menuFile].name
    );
  });

  ele.shareBtn.addEventListener("click", e => {
    backend.share(globalThis.files[menuFile]);
  });

  window.addEventListener("click", e => {
    ele.contextDiv.style.display = "none";
  });
}

async function askRemoveFile(i) {
  let name = globalThis.files[i].name;
  let result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete " + utils.escapeHtml(name) + "!"
  });
  if (result.value) {
    files.removeFile(i);
    Swal.fire({
      title: utils.escapeHtml(name) + " was deleted",
      showCancelButton: false,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      position: "top-right",
      icon: "success"
    });
  }
}

export function renderFileList() {
  ele.filesDiv.innerHTML = "";
  for (let i in globalThis.files) {
    let item = globalThis.files[i];
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

    var moreBtn = document.createElement("button");
    moreBtn.className = "Btn";
    moreBtn.innerHTML = '<i class="material-icons fix-button">more_horiz</i>';
    moreBtn.title = "More Options";
    moreBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      createContextMenu(e.pageX, e.pageY, i);
    });
    fileDiv.appendChild(moreBtn);

    fileDiv.addEventListener("contextmenu", e => {
      e.preventDefault();
      createContextMenu(e.pageX, e.pageY, i);
    });

    ele.filesDiv.appendChild(fileDiv);
  }
}

export function showSplashScreen() {
  var fileContent = document.getElementById("contents");
  var fileName = document.getElementById("title");
  fileName.innerText = "noted text editor by jeffalo";
  fileContent.classList.add("hidden");
  ele.splashtext.classList.remove("hidden");
}

function createContextMenu(x, y, i) {
  ele.contextDiv.style.top = y + "px";
  ele.contextDiv.style.left = x + "px";
  ele.contextDiv.style.display = "block";

  ele.menuTitle.innerText = globalThis.files[i].name;
  menuFile = i;
}

export function loadFile(i) {
  let oldFile = globalThis.currentFile;
  globalThis.currentFile = i;
  let item = globalThis.files[i];
  ele.splashtext.classList.add("hidden");
  ele.fileContent.classList.remove("hidden");
  ele.fileName.innerText = item.name;
  ele.fileContent.value = item.content;
  var fileDiv = document.getElementById("file_" + item.name);
  if (fileDiv == null) {
    console.log("🕳 fileDiv doesn't exist");
  } else {
    try {
      document
        .getElementById("file_" + globalThis.files[oldFile * 1].name)
        .classList.remove("selected");
    } catch (e) {
      // No worries, the old div is gone, so we don't have to deal with it.
    }
    fileDiv.classList.add("selected");
  }
  autoExpand(ele.fileContent);
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
      if (globalThis.fileList.has(value)) {
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
