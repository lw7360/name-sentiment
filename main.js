var fs = require('fs');
var urban = require('urban');
var sentiment = require('sentiment');
var ProgressBar = require('progress');

var bar;

var x = 0;
var progress = 0;
var sentiments = [];
var loopArray = function(arr) {
    var udef = urban(arr[x]);
    
    udef.first(function(json) {
        x++;

        //sentiments.push(sentiment(json.definition));
        if (json) {
          sentiments.push(sentiment(json.definition).score);
        }
        else {
          sentiments.push(0);
        }

        if ((x/arr.length)*10 > progress) {
          progress++;
          bar.tick();
        }

        if(x < arr.length) {
          loopArray(arr);   
        }
        else {
          fs.writeFile('sentiments.txt', sentiments.join('\n'), function(err) {
            if (err) throw err; 
            console.log("Done, output is in sentiments.txt")
          });
        }
    }); 
}

if (process.argv.length < 3) {
  console.log('Usage: node main.js FILENAME');
  process.exit(1);
}

fs.readFile(process.argv[2], 'utf8', function(err, data) {
  if (err) throw err;

  var names = data.split('\n');
  bar = new ProgressBar(':bar', { total: 10 });
  loopArray(names);
});

