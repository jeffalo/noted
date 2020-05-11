var files = [];

var fileList = [];

//example

if (localStorage.getItem("fileList") === null) {
    console.log('new user')
    var exampleFileList = JSON.stringify(['example'])
    localStorage.setItem('fileList',exampleFileList)
    localStorage.setItem('example','this is an example file. it may not look like much but it is the sole reason this notes webapp isnt broken for you right now.')
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
    var newFileName = fileName
    localStorage.setItem(newFileName, 'no text yet')
    var oldFileList = JSON.parse(localStorage.getItem('fileList'))
    var joined = [newFileName, ...oldFileList]
    localStorage.setItem('fileList', JSON.stringify(joined))
    //fileList = JSON.parse(localStorage.getItem('fileList'))
    files.push({name:newFileName, content:'no text yet'})
    console.log(files)
    loadFiles() 
    loadFile({name:newFileName, content:'no text yet'})
}

function clearFiles(){//this one clears the sidebar of files
   document.getElementById('sidebar').innerHTML = `        <div class="file">
   <h1><i class="material-icons">description</i> LOGO</h1>
</div>`
}

function createTools(){
    var sidebar = document.getElementById('sidebar') 
    var toolbox = document.createElement('div')
    toolbox.className = "toolbox"
    var createButton = document.createElement('button')
    createButton.innerText = "new"
    createButton.addEventListener('click', function(){
        createFile(prompt('file name'))
    })
    toolbox.appendChild(createButton)
    sidebar.appendChild(toolbox)
}