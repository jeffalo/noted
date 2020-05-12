let files = [];

let fileList = [];

const filesDiv = document.querySelector('.files')

if (localStorage.getItem("fileList") === null) {
    console.log('🌱 New User')
    localStorage.setItem('fileList','["Welcome"]')
    localStorage.setItem('Welcome','Welcome to noted, this is an example file.')
}

window.onload = function(){
    loadFileList();
    loadFiles()
    showSplashScreen()
}

function loadFileList(){
    fileList = JSON.parse(localStorage.getItem('fileList'))
    for(let item of fileList){
        console.log(item)
        var objectified = {name:item, content:localStorage.getItem(item)};
        files.push(objectified)
        console.log(files)
    }
}

function loadFiles(){
    clearFiles()
    for(let item of files){
        var fileDiv = document.createElement("div");
        fileDiv.addEventListener('click', function(){
            loadFile(item)
        })
        fileDiv.className = "file"
	    fileDiv.title = item.name
        fileDiv.id = "file_"+item.name
        var a = document.createElement("a");
        a.className = 'asdf-container'
        fileDiv.appendChild(a); 
        var textnode = document.createTextNode(item.name);
        a.appendChild(textnode); 
        var deleteBtn = document.createElement("button")
        deleteBtn.className = "Btn"
        deleteBtn.innerHTML = '<i class="material-icons fix-button">delete</i>'
        deleteBtn.title = 'Delete this note'
        deleteBtn.addEventListener('click', function(){
            askRemoveFile(item.name)
        })
        fileDiv.appendChild(deleteBtn)

        var editBtn = document.createElement("button")
        editBtn.className = "Btn"
        editBtn.innerHTML = '<i class="material-icons fix-button">edit</i>'
        editBtn.title = 'Rename note'
        editBtn.addEventListener('click', function(){
            askRenameFile(item.name)
        })
        fileDiv.appendChild(editBtn)

        var saveBtn = document.createElement("button")
        saveBtn.className = "Btn"
        saveBtn.innerHTML = '<i class="material-icons fix-button">save</i>'
        saveBtn.title = 'Save note as text file'
        saveBtn.addEventListener('click', function(){
            saveTextAsFile(item.content,item.name)
        })
        fileDiv.appendChild(saveBtn)


        filesDiv.appendChild(fileDiv)
    }
}

function loadFile(item){
    loadFiles()
    var splashtext = document.getElementById('splashtext')
    splashtext.classList.add('hidden')
    var fileContent = document.getElementById('contents')
    var fileName = document.getElementById('title')
    fileContent.classList.remove('hidden')
    fileName.innerText = item.name
    fileContent.value = localStorage.getItem(item.name)
    var selectionDiv = document.getElementById('file_'+item.name)
    if(selectionDiv == null){
       console.log("🕳 selectionDiv doesn't exist")
       showSplashScreen()
    } else{
        document.getElementById('file_'+item.name).classList.add('selected')
    }
    autoExpand(fileContent);
}


function save(){
    var fileContent = document.getElementById('contents')
    var fileName = document.getElementById('title')
    localStorage.setItem(fileName.innerText, fileContent.value)
}

function createFile(fileName, fileContent){
    if(fileName == 'fileList' || fileName == "" || fileList.includes(fileName) || fileName == "notedllama"){//todo also remember to add check for used filename 
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'File name error (You should never see this screen)',
            footer: '<a class="llama" href="https://i.etsystatic.com/14058045/r/il/d17ec2/1488837902/il_570xN.1488837902_c9os.jpg" target="_blank">picture of llama to cheer you up</a>'
          })
    } else{
        var newFileName = fileName
        localStorage.setItem(newFileName, fileContent)
        var oldFileList = JSON.parse(localStorage.getItem('fileList'))
        var joined = [newFileName, ...oldFileList]
        localStorage.setItem('fileList', JSON.stringify(joined))
        //fileList = JSON.parse(localStorage.getItem('fileList'))
        files.push({name:newFileName, content:fileContent})
        fileList.push(newFileName)
        console.log(files)
        loadFiles() 
        loadFile({name:newFileName, content:fileContent})
    }
}

function clearFiles(){//this one clears the sidebar of files
   filesDiv.innerHTML=""
}

async function askFileName(){
    Swal.fire({
        title: "File name",
        text: "What do you want to name this awesome file?",
        input: 'text',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
              return 'You need to name it something!'
            }
            if(value == 'fileList'){
                return 'Sorry, that name is reserved'
            }
            if(fileList.includes(value)){
                return 'Sorry, that name is taken. (Deja vu?)'
            }
            if(value == 'test'){
                return '<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" class="llama">Sorry, that name is reserved</a>'
            }
          }     
    }).then((result) => {
        if (result.value) {
            createFile(result.value, 'Nothing... yet')
        }
    });
}

async function askRemoveFile(name){
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete ' + escapeHtml(name) + '!'
      }).then((result) => {
        if (result.value) {
            localStorage.removeItem(name)
            var whats = JSON.parse(localStorage.getItem('fileList'))
            var index = whats.indexOf(name)
            whats.splice(index, 1)
            localStorage.setItem('fileList', JSON.stringify(whats))
        
            var index2 = fileList.indexOf(name)
            fileList.splice(index2, 1)
        
            var removeIndex = files.map(function(item) { return item.name; })
                               .indexOf(name);
        
            ~removeIndex && files.splice(removeIndex, 1);
            //clearFiles()
            //loadFileList()
            loadFiles()
            showSplashScreen()
            swal.fire({
                title: escapeHtml(name) +' was deleted',
                showCancelButton: false,
                showConfirmButton: false,
                timer: 1500,
                toast: true,
                position: "top-right",
                icon: "success",
              })          
        }
      })
}

function removeFile(name){
    localStorage.removeItem(name)
    var whats = JSON.parse(localStorage.getItem('fileList'))
    var index = whats.indexOf(name)
    whats.splice(index, 1)
    localStorage.setItem('fileList', JSON.stringify(whats))

    var index2 = fileList.indexOf(name)
    fileList.splice(index2, 1)

    var removeIndex = files.map(function(item) { return item.name; })
                        .indexOf(name);

    ~removeIndex && files.splice(removeIndex, 1);
    //clearFiles()
    //loadFileList()
    loadFiles()
    showSplashScreen()
}

function showSplashScreen(){
    loadFiles()
    var fileContent = document.getElementById('contents')
    var fileName = document.getElementById('title')
    fileName.innerText = 'noted text editor by jeffalo'
    fileContent.classList.add('hidden')
    var splashtext = document.getElementById('splashtext')
    splashtext.classList.remove('hidden')
    splashtext.innerHTML = 'select a document or create one with the panel on the left. <br><br> suggestions, feedback or issues? check out the <a class="llama" target="_blank" href="https://github.com/JeffaloBob/noted">GitHub repo.</a>'
    //fileContent.setAttribute('contenteditable', false);
}

function renameFile(oldName, newName){ //wish me good luck 😅
    var oldcontent = localStorage.getItem(oldName)
    //localStorage.removeItem(oldName)
    
    //now the actual thing is renamed, so now we have to chnage in in the dicitonary
    var oldList = JSON.parse(localStorage.getItem('fileList'))

    //var index = oldList.indexOf(oldName)
    //oldList[index] = newName
    //localStorage.setItem('fileList', JSON.stringify(oldList))

    //var index2 = fileList.indexOf(oldName)
    //fileList[index2] = newName

    
    localStorage.setItem(newName, oldcontent)
    files.push({name:newName, content:oldcontent})
    oldList.push(newName)
    localStorage.setItem('fileList', JSON.stringify(oldList))
    removeFile(oldName)
    loadFiles()
    fileList.push(newName)
    loadFile({name:newName, content:oldcontent})
}

async function askRenameFile(oldName){
    Swal.fire({
        title: "New file name",
        text: "What do you want to rename this awesome file to?",
        input: 'text',
        inputValue: oldName,
        showCancelButton: true,
        inputValidator: (value) => {
            if(value == oldName){
                return 'You have to actually... you know... change the name?'
            }
            if (!value) {
              return 'You need to name it something!'
            }
            if(value == 'fileList'){
                return 'Sorry, that name is reserved'
            }
            if(fileList.includes(value)){
                return 'Sorry, that name is taken. (Deja vu?)'
            }
          }     
    }).then((result) => {
        if (result.value) {
            renameFile(oldName, result.value)
        }
    });
}








var autoExpand = function (field) {

	// Reset field height
	field.style.height = 'inherit';

	// Get the computed styles for the element
	var computed = window.getComputedStyle(field);

	// Calculate the height
	var height = parseInt(computed.getPropertyValue('border-top-width'), 10)
	             + parseInt(computed.getPropertyValue('padding-top'), 10)
	             + field.scrollHeight
	             + parseInt(computed.getPropertyValue('padding-bottom'), 10)
	             + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

	field.style.height = height + 'px';

};

document.addEventListener('input', function (event) {
	if (event.target.tagName.toLowerCase() !== 'textarea') return;
	autoExpand(event.target);
}, false);

async function clearAll(){
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete everything!'
      }).then((result) => {
        if (result.value) {
            var fileListClear = JSON.parse(localStorage.getItem('fileList'))
            for(let file of fileListClear){
                removeFile(file)
            }
            loadFiles()
            showSplashScreen()
            swal.fire({
                title: 'Notes cleared',
                showCancelButton: false,
                showConfirmButton: false,
                timer: 1500,
                toast: true,
                position: "top-right",
                icon: "success",
              })          
        }
      })

}

function saveTextAsFile(textToWrite, fileNameToSaveAs)
{
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'}); 
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

async function uploadFile(){
    const { value: file } = await Swal.fire({
        title: 'Select text file',
        input: 'file',
        inputAttributes: {
          'accept': 'text/*',
          'aria-label': 'Upload a text file',
          'id':'fileUploader'
        }
      })
      
      if (file) {
        const reader = new FileReader()
        console.log(fileUploader.value)
        reader.onload = (e) => {
          console.log(reader.result)
          var randomstring =  makeid(10)
          if(fileList.includes(file.name)){
            createFile(file.name + " - " +randomstring, reader.result)
          } else{
            createFile(file.name, reader.result)
          }
        }
        reader.readAsText(file)
        
      }
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
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
            url = new URL(url)
            var callbackName = "_jsonp_" + (new Date().valueOf()).toString(36)
            let cleanup = function() {
                if (script) {
                    script.remove()
                }
                window[callbackName] = _ => _;
            };
            window[callbackName] = function(data) {
                cleanup();
                resolve(data);
            };
            url.searchParams.set("callback", callbackName)
            script = document.createElement('script');
            script.src = url.href;
            document.head.appendChild(script);
        });
    };
    return {
        save: text => {
            return jsonp("https://script.google.com/macros/s/AKfycbz1xZwaVsmLID617VGxyHTbUtstaTlw07NAn44Ja7OrLyTpXIYG/exec?route=save&text=" + encodeURIComponent(text))
        },
        get: id => {
            return jsonp("https://script.google.com/macros/s/AKfycbz1xZwaVsmLID617VGxyHTbUtstaTlw07NAn44Ja7OrLyTpXIYG/exec?route=get&id=" + encodeURIComponent(id))
        }
    }
})();
