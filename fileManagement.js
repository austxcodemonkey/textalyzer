var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var linesIndex = { timestamps: [], fileNames: [], fileOffsets: [], lengths: []};

function openFile () {
    console.log("openFile");
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
      // Start display at beginning after loading new file
      displayLines(linesIndex.timestamps[0]);
      populateTimeList();
    });
}

function getIndexForTimestamp(timestamp) {
  for (var i = 0; i < linesIndex.timestamps.length; i++) {
    if (linesIndex.timestamps[i] <= timestamp) {
      return i;
    }
  }
  return -1;
}

function linesToDisplay() {
  return 200;
}

function displayLines(timestamp) {
  // scan index to position indicated
  var index = getIndexForTimestamp(timestamp);
  // read lines at index from indicated file
  if (index != -1) {
    console.log("Found lines to display at index " + index);
  }

  var totalLinesRead = 0;
  var buffer = new Buffer(100000);
  var offset = 0;

  while(buffer.toString().split("\n").length < linesToDisplay())
  {
    var fd = fs.openSync(linesIndex.fileNames[index], "r");
    offset += fs.readSync(fd, buffer, offset, linesIndex.fileOffsets[index], linesIndex.lengths[index]);

    index++;
  }

  var withBreaks = buffer.toString().split("\n").join("<br />");

  document.querySelector('#textGoesHere').innerHTML = withBreaks;

  console.log(buffer.toString());

  // while (we still need to read more lines)
  // get text for entry
  // count lines in text
  // total lines read += lines in this entry
  // index++
  // elihw

}

// https://stackoverflow.com/questions/2998784/how-to-output-integers-with-leading-zeros-in-javascript
function pad(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length-size);
}

function populateTimeList()
{
  var options = '';

  for(var i = 0; i < linesIndex.timestamps.length; i++){
    var thisOption = new Date(linesIndex.timestamps[i]);
    var optionString = pad(thisOption.getHours(), 2) + ":" + pad(thisOption.getMinutes(), 2) +
      ":" + pad(thisOption.getSeconds(), 2) + "." + pad(thisOption.getMilliseconds(), 3);
    options += '<option value="' + linesIndex.timestamps[i] +'">' + optionString + "</option>";
  }    
  
  timestampComboBox.innerHTML = options;
}

var timestampComboBox = document.getElementById('timestampCombo');
document.querySelector('#fileOpenButton').addEventListener('click', openFile);
