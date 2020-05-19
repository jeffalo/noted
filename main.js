/* global globalThis */
import Swal from "https://cdn.pika.dev/sweetalert2@^9.7.1";
import * as ui from "./ui.js"
import * as store from "/store.js";
import * as backend from "/backend.js";

(async()=>{
await ui.init()
await store.init()
await backend.init()
})();