require('leapjs/template/entry.js');

var fs = require('fs');
var rawStdout = new fs.SyncWriteStream(1, { autoClose: false });


// If the numbers should be formatted neatly
DO_FORMATING = false;

var controller = new Leap.Controller();

controller.on('frame', function(frame) {
	//rawStdout.write('\033[0;32m');
    if (frame.hands[0] !== undefined) {
        var roll = frame.hands[0].roll();
        var pitch = frame.hands[0].pitch();
        var yaw = frame.hands[0].yaw();

        if (DO_FORMATING) {
            array = toDegreeArray(roll, pitch, yaw).map(function(element) {
                return formatThreeDigitSigned(element);
            });

            firstHand = array;
        }
        else {
			firstHand = toDegreeArray(roll, pitch, yaw);
		}
       

	    //console.log(frame.hands[0].palmPosition[1]);
		firstHand[firstHand.length] = Math.floor(frame.hands[0].palmPosition[1]);
		console.log("");
		var colourful = firstHand.map(function(element) {
			return '\033[0;3' + (1+(Math.abs(Math.floor(radToDeg(element))))%6) + 'm' + element + ' ';
		});
	
		rawStdout.write(colourful);
		console.log("\n\n");
		//rawStdout.write('\033[0m');

		
    }
});

function toDegreeArray(roll, pitch, yaw) {
    return [ radToDeg(roll), radToDeg(pitch), radToDeg(yaw) ];
}

function radToDeg(rad) {
    return Math.floor(rad * 180  / Math.PI);
}

function formatThreeDigitSigned(number) {
    var returnString = '' + number;
    var length = number.toString().length;

    if (number >= 0 )
        returnString = ' ' + returnString;
    else
        length--;

    while (length < 3) {
        returnString = ' ' + returnString;
        length++;
    }

    return returnString;
}

controller.on('streamingStarted', function() {
    console.log('cats');
});

controller.connect();
