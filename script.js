var files = [];

var fileList = [];

//example

if (localStorage.getItem("fileList") === null) {
    console.log('new user')
    var exampleFileList = JSON.stringify(['example'])
    localStorage.setItem('fileList',exampleFileList)
    localStorage.setItem('example','welcome to noted, this is an example file.')
}

window.onload = function(){
    console.log('haha funny joke') //debugging at its finiest
    loadFileList();
    loadFiles()
}

function loadFileList(){
    fileList = JSON.parse(localStorage.getItem('fileList'))


    for(let item of fileList){
        console.log(item)
        var lclstrg = localStorage.getItem(item)
        var objectified = {name:item, content:lclstrg};
        files.push(objectified)
        //fileList.push(objectified.name)
        console.log(files)
    }
}

function loadFiles(){
    clearFiles()
/*     var files = [
        {
          name: "shopping list",
          content: "buy stuff"
        },
        {
            name: "other",
            content: "other stuff"
        },
        {
            name: "friends",
            content: "example"
        },
      ]; */

    

    //get array somehow idk


    for(let item of files){
        console.log(item)
        var sidebar = document.getElementById('sidebar')
        var fileDiv = document.createElement("div");
        fileDiv.addEventListener('click', function(){
            loadFile(item)
        })
        fileDiv.className = "file"
        fileDiv.id = "file_"+item.name
        var a = document.createElement("a");
        fileDiv.appendChild(a); 
        var textnode = document.createTextNode(item.name);         // Create a text node
        a.appendChild(textnode); 
        sidebar.appendChild(fileDiv)
    }
    createTools()
}

function loadFile(item){//note the not s in loadFile
    loadFiles()
    var fileContent = document.getElementById('contents')
    var fileName = document.getElementById('title')
    fileName.innerText = item.name
    fileContent.setAttribute('contenteditable', true);
    //fileContent.innerText = item.content
    fileContent.innerText = localStorage.getItem(item.name)
    document.getElementById('file_'+item.name).classList.add('selected')
}


function save(){
    var fileContent = document.getElementById('contents')
    var fileName = document.getElementById('title')
    localStorage.setItem(fileName.innerText, fileContent.innerText)
}

function createFile(fileName){
    if(fileName == 'fileList' || fileName == "" || fileList.includes(fileName) || fileName == "notedllama"){//todo also remember to add check for used filename 
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'File name error (You should never see this screen)',
            footer: '<a class="llama" href="https://i.etsystatic.com/14058045/r/il/d17ec2/1488837902/il_570xN.1488837902_c9os.jpg" target="_blank">picture of llama to cheer you up</a>'
          })
    } else{
        var newFileName = fileName
        localStorage.setItem(newFileName, 'no text yet')
        var oldFileList = JSON.parse(localStorage.getItem('fileList'))
        var joined = [newFileName, ...oldFileList]
        localStorage.setItem('fileList', JSON.stringify(joined))
        //fileList = JSON.parse(localStorage.getItem('fileList'))
        files.push({name:newFileName, content:'no text yet'})
        fileList.push(newFileName)
        console.log(files)
        loadFiles() 
        loadFile({name:newFileName, content:'no text yet'})
    }
}

function clearFiles(){//this one clears the sidebar of files
   document.getElementById('sidebar').innerHTML = `        <div class="noselect">
   <h1 class="logo"><i class="material-icons">description</i> noted</h1>
</div><hr>`
}

function createTools(){
    var sidebar = document.getElementById('sidebar') 
    var toolbox = document.createElement('div')
    toolbox.className = "toolbox"
    var createButton = document.createElement('button')
    createButton.innerText = "new"
    createButton.addEventListener('click', function(){
        askFileName()
    })
    createButton.className = "addbutton"
    toolbox.appendChild(createButton)
    sidebar.appendChild(toolbox)
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
          }     
    }).then((result) => {
        if (result.value) {
            createFile(result.value)
        }
    });
}

function removeFile(name){
    localStorage.removeItem(name)
    var whats = JSON.parse(localStorage.getItem('fileList'))
    var index = whats.indexOf(name)
    whats.splice(index, 1)
    localStorage.setItem('fileList', JSON.stringify(whats))
}