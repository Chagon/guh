require('leapjs/template/entry.js');

var fs = require('fs');
var rawStdout = new fs.SyncWriteStream(1, { autoClose: false });

var name = process.argv[2];
// If the numbers should be formatted neatly
DO_FORMATING = false;
var width = 80 - (name.length*4);
var k=0;
var controller = new Leap.Controller();

controller.on('frame', function(frame) {
	//rawStdout.write('\033[0;32m');
    if (frame.hands.length===1) {
        var roll = frame.hands[0].roll();
        var pitch = frame.hands[0].pitch();
        var yaw = frame.hands[0].yaw();
		var position = -1;
		
		position = frame.hands[0].palmPosition[0];
		position += 145;
		position = Math.floor(position*width/300);
	
		
		
        if (DO_FORMATING) {
            array = toDegreeArray(roll, pitch, yaw).map(function(element) {
                return formatThreeDigitSigned(element);
            });

            firstHand = array;
        }
        else
            firstHand = toDegreeArray(roll, pitch, yaw);
        //console.log(frame.hands[0].palmPosition[1]);
		firstHand[firstHand.length] = Math.floor(frame.hands[0].palmPosition[1]);
		
		var colour = '';
		//var space = (Math.abs(Math.floor(firstHand[3])))%(width);
		var space = position%width;
		for(var i=0; i<space; i++) {
			colour += ' ';
		}
		
		if (name!=null) {
		colour += '\033[0;3' + (1+(Math.abs(Math.floor(firstHand[0])))%6) + 'm' + name;
		colour += '\033[0;3' + (1+(Math.abs(Math.floor(firstHand[1])))%6) + 'm' + name;
		colour += '\033[0;3' + (1+(Math.abs(Math.floor(firstHand[2])))%6) + 'm' + name;
		colour += '\033[0;3' + (1+(Math.abs(Math.floor(firstHand[3])))%6) + 'm' + name;
		}
		else {
		colour += '\033[0;3' + (1+(Math.abs(Math.floor(firstHand[0])))%6) + 'm' + firstHand[0] + ' ';
		colour += '\033[0;3' + (1+(Math.abs(Math.floor(firstHand[1])))%6) + 'm' + firstHand[1] + ' ';
		colour += '\033[0;3' + (1+(Math.abs(Math.floor(firstHand[2])))%6) + 'm' + firstHand[2] + ' ';
		colour += '\033[0;3' + (1+(Math.abs(Math.floor(firstHand[3])))%6) + 'm' + firstHand[3] + ' ';
		}
		
		
		rawStdout.write(colour);
		rawStdout.write('\033[0m');
		console.log();
		
		
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
