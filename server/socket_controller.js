var Game = require('./game');

var users = [];
var k = 1;

var Ctrl = {
    newConnection: function(socket) {
        console.log('new socket');

        socket.on('current player joined', function(user) {
            Ctrl.currentUserJoined(socket, user);
        });
        socket.on('player moved', function(offsets) {
            Ctrl.playerMoved(socket, offsets);
        });
        socket.on('disconnect', function() {
            Ctrl.disconnect(socket);
        });
        socket.on('get players', function() {
            Ctrl.getPlayers(socket);
        });
    },
    currentUserJoined: function(socket, user) {
        user.socket_id = socket.id;
        user.coords = {
            x: 100,
            y: 100
        };
        user.radius = Game.defaultRadius;
        console.log(user);
        users.push(user);
        socket.broadcast.emit('player joined', user);
    },
    playerMoved: function(socket, offsets) {
        var curUser = null;
        for (var el in users) {
            if (!users.hasOwnProperty(el)) continue;
            if (users[el].socket_id === socket.id) {
                curUser = users[el];
            }
        }
        curUser.coords = Game.getPlayerCoords(offsets, curUser);
        socket.broadcast.emit('player moved', curUser);
        socket.emit('current player moved', curUser);
    },
    getPlayers: function(socket) {
        var curPlayerIndex, players = [];
        for (var el in users) {
            if (!users.hasOwnProperty(el)) continue;
            if (users[el].socket_id === socket.id) {
                curPlayerIndex = el;
                continue;
            }
            players.push(users[el]);
        }
        socket.emit('players received', players);
    },
    disconnect: function(socket) {
        for (var el in users) {
            if (!users.hasOwnProperty(el)) continue;
            if (users[el].socket_id === socket.id) {
                var disconnectedUser = users[el];
                users.splice(el, 1);
                socket.broadcast.emit('player left', disconnectedUser);
            }
        }
    }
};

module.exports = Ctrl;