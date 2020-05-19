import Swal from "https://cdn.pika.dev/sweetalert2@^9.7.1";
import * as files from "./files.js";

const backend = (() => {
  function jsonp(url) {
    return new Promise(function(resolve, reject) {
      let script;
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

export async function init() {
  let params = new URLSearchParams(location.search);
  let importId = params.get("import");
  if (importId) {
    let loadToast = Swal.fire({
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
    loadToast.closeToast();

    await files.importFile(
      new File(
        [text.slice(newlineIndex + 1)],
        text.slice(0, newlineIndex == -1 ? 0 : newlineIndex) || "Untitled"
      )
    );

    Swal.fire({
      title: "File Loaded!",
      showCancelButton: false,
      showConfirmButton: false,
      toast: true,
      position: "top-right",
      icon: "success",
      timer: 5000
    });
  }
}

export async function share(file) {
  let loadToast = Swal.fire({
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
  if (navigator.share) {
    Swal.fire({
      toast: true,
      showCancelButton: false,
      position: "top-right",
      text: "Upload complete!",
      confirmButtonText: "Send link",
      onBeforeOpen: e =>
        e.querySelector(".swal2-confirm").addEventListener("click", () => {
          navigator.share({
            text: "View " + file.name + " on noted",
            title: file.name,
            url: shareLink.href
          });
        })
    });
  } else {
    Swal.fire({
      title: "Share",
      text: "Your share link is " + shareLink.href,
      showCancelButton: false
    });
  }
}
