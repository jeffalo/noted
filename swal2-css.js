export default (async () => {
  let s = document.createElement("style");
  s.innerText = await (await fetch(
    "https://unpkg.com/sweetalert2@9.11.0/dist/sweetalert2.min.css"
  )).text();
  document.head.appendChild(s);
})();
