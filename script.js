var files = [];

var fileList = [];

//example
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
        fileDiv.id = "file"
        var a = document.createElement("a");
        fileDiv.appendChild(a); 
        var textnode = document.createTextNode(item.name);         // Create a text node
        a.appendChild(textnode); 
        sidebar.appendChild(fileDiv)
    }
}

function loadFile(item){//note the not s in loadFile
    var fileContent = document.getElementById('contents')
    var fileName = document.getElementById('title')
    fileName.innerText = item.name
    fileContent.innerText = item.content
}


function save(){
    var fileContent = document.getElementById('contents')
    var fileName = document.getElementById('title')
    localStorage.setItem(fileName.innerText, fileContent.innerText)
}

function createFile(){
    var newFileName = prompt('name it now')
    localStorage.setItem(newFileName, 'no text yet')
    var oldFileList = JSON.parse(localStorage.getItem('fileList'))
    var joined = [newFileName, ...oldFileList]
    localStorage.setItem('fileList', JSON.stringify(joined))
    //fileList = JSON.parse(localStorage.getItem('fileList'))
    files.push({name:newFileName, content:'no text yet'})
    console.log(files)
    loadFiles() 
}

function clearFiles(){//this one clears the sidebar of files
   document.getElementById('sidebar').innerHTML = `        <div class="file">
   <h1><i class="material-icons">description</i> LOGO</h1>
</div>`
}