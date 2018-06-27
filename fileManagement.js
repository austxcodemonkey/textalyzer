var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var linesIndex = { timestamps: [], fileNames: [], fileOffsets: [], lengths: []};

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
    var lastPos = 0;
    var date = null;
    var length = 0;

    console.log("Scanning file " + fileName);
    
    rl.on('line', function(line) {
      var regex = /\[[a-z]+ ([0-9\/ \.:]+ [A-Z]*)/;
      var result = line.match(regex);
      if (!(result === null)) {
        // process line here
        date = new Date(result[1]);
        console.log("Found timestamp: " + result[1] + ", time is " + date.getTime());
        linesIndex.timestamps.push(date.getTime());
        linesIndex.fileNames.push(fileName);
        linesIndex.fileOffsets.push(position);
        if (linesIndex.fileOffsets.length > 1){
          linesIndex.lengths.push(length);
        }
        length = 0;
      }

      console.log("Position is " + position);
      position += line.length + 1;
      length += line.length + 1;
    });
    
    rl.on('close', function() {
      console.log("Closed file");
      linesIndex.lengths.push(length);
    });

    console.log("FOO");
}

function getIndexForPosition(position) {

}

function displayLines(timestamp) {
  // scan index to position indicated
  var index = getIndexForTimestamp(timestamp);
  // read lines at index from indicated file

}

document.querySelector('#fileOpenButton').addEventListener('click', openFile);
