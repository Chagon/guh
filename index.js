var Server = require('Server');
var HandReader = require('HandReader');

var handReader = new HandReader();
handReader.on('report', function(position) {
    var server = new Server();
    server.reportPosition(position);
});
