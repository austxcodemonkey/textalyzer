var fs = require('fs');

function openFile () {

    dialog.showOpenDialog({ filters: [
        { name: 'Log Files, Text Files', extensions: ['log', 'txt'] }
    ]},function (fileNames) {
        if (fileNames === undefined) return;

        var fileName = fileNames[0];
      
        fs.readFile(fileName, 'utf-8', function (err, data) {      
          console.log("Selected filename " + fileName);
        });
    }); 
  }

document.querySelector('#fileOpenButton').addEventListener('click', openFile)