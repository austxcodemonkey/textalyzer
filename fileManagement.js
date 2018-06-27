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
    var position = 0;

    console.log("Scanning file " + fileName);
    
    rl.on('line', function(line) {
      var regex = /\[[a-z]+ ([0-9\/ \.:]+ [A-Z]*)/;
      var result = line.match(regex);
      if (!(result === null)) {
        // process line here
        console.log("Found timestamp: " + result[1]);
      }
      console.log("Position is " + position);
      position += line.length + 1;
    });
    
    rl.on('close', function() {
      console.log("Closed file");
    });
}

document.querySelector('#fileOpenButton').addEventListener('click', openFile)