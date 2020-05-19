/* global globalThis */
import * as ui from "./ui.js";

export function sync() {
  localStorage.clear();
  let names = [];
  for (let file of globalThis.files) {
    localStorage.setItem(file.name, file.content);
    names.push(file.name);
  }
  localStorage.setItem("fileList", JSON.stringify(names));
  ui.renderFileList();
}

export function init() {
  globalThis.files = [];
  globalThis.fileList = new Set(
    JSON.parse(localStorage.getItem("fileList")) || []
  );
  for (let item of globalThis.fileList) {
    console.log(item);
    var objectified = {
      name: item,
      content: localStorage.getItem(item)
    };
    globalThis.files.push(objectified);
  }
  ui.renderFileList();
  ui.showSplashScreen();
}
