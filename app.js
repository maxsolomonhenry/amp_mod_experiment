// --- LOADING MODULES
var express = require('express');
var path = require('path');
var fs = require('fs');

// --- INSTANTIATE THE APP
var app = express();

// Set static folder.
app.use(express.static(__dirname));

// const PORT = process.env.PORT || 80;
var server = app.listen(80, '0.0.0.0', () => console.log(`Server started on port: 80`));
var socket = require('socket.io');
var io = socket(server);


//io.on('connection', newConnection);
io.on('connection', newConnection);

var datapath = 'data/';
var subjectCount = 0;

var tmp = process.argv[2];

if (typeof tmp !== 'undefined'){
    subjectCount = parseInt(process.argv[2]);
}

console.log(`Starting at subject number ${subjectCount}...`);

function newConnection(socket){
    console.log('new connection: ' + socket.id);

    socket.on('requestSubjectNo', (data, callback) => {

        console.log(`Request for new subject number. They say ${data}. I say ${subjectCount}.`);
        callback(subjectCount++);

    });

    socket.on('csv', (data, callback) => {
    	fs.writeFile(datapath + data.filename, data.expData, err => {
            if (err) {
                return console.log(err);
            }
            console.log("Succesfully saved " + data.filename);
        });
		console.log(data);

        callback({string1: 'This is a confirmation.'})
    });

}
