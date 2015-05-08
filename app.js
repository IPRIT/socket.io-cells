var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var socketCtrl = require('./server/socket_controller');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.render('index');
});

io.on('connection', socketCtrl.newConnection);

http.listen(3000, function() {
    console.log('Listening on localhost:3000');
});