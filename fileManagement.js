var fs = require('fs');
var readline = require('readline');
var stream = require('stream');

function openFile () {

    dialog.showOpenDialog({ filters: [
        { name: 'Log Files, Text Files', extensions: ['log', 'txt'] }
    ]},function (fileNames) {
        if (fileNames === undefined) return;

        var fileName = fileNames[0];

        indexFile(fileName);
    }); 
  }

function indexFile(fileName) {
    var instream = fs.createReadStream(fileName);
    var outstream = new stream;
    var rl = readline.createInterface(instream, outstream);
    
    rl.on('line', function(line) {
      // process line here
      console.log("Found line: " + line);
    });
    
    rl.on('close', function() {
      console.log("Closed file");
    });
}

document.querySelector('#fileOpenButton').addEventListener('click', openFile)