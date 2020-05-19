/* global globalThis */
import Swal from "https://cdn.pika.dev/sweetalert2@^9.7.1";
import * as store from "/store.js";
import * as ui from "/ui.js";
import * as utils from "/utils.js";

export async function createFile(fileName, fileContent) {
  if (
    fileName == "fileList" ||
    fileName == "" ||
    globalThis.fileList.has(fileName) ||
    fileName == "notedllama"
  ) {
    //todo also remember to add check for used filename
    await Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "File name error (You should never see this screen)",
      footer:
        '<a class="llama" href="https://i.etsystatic.com/14058045/r/il/d17ec2/1488837902/' +
        'il_570xN.1488837902_c9os.jpg" target="_blank">picture of llama to cheer you up</' +
        "a>"
    });
  } else {
    globalThis.files.push({ name: fileName, content: fileContent });
    store.sync();
  }
}

export function removeFile(i) {
  globalThis.files.splice(i, 1);
  store.sync();
  ui.showSplashScreen();
}

export function renameFile(i, newName) {
  globalThis.files[i].name = newName;
  store.sync();
  ui.loadFile(i)
}

export async function importFile(file) {
  const reader = new FileReader();
  reader.onload = async e => {
    console.log(reader.result);
    var randomstring = utils.makeid(10);
    if (globalThis.fileList.has(file.name)) {
      await createFile(file.name + " - " + randomstring, reader.result);
    } else {
      await createFile(file.name, reader.result);
    }
  };
  reader.readAsText(file);
}