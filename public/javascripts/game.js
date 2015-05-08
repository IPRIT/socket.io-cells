var game = window.game || {};

(function(g) {
    g.handler = function(socket) {
        g._socket = socket;
        g._socket.on('player joined', g.playerJoined);
        g._socket.on('player moved', g.playerMoved);
        g._socket.on('current player moved', g.currentPlayerMoved);
        g._socket.on('players received', g.playersReceived);
        g._socket.on('player left', g.playerDisconnected);

        console.log('Game ready');
        return this;
    };

    g.run = function () {
        var currentPlayer = new Player();
        currentPlayer.insertCurrentPlayer();

        g.currentPlayer = currentPlayer;
        g._socket.emit('get players');
    };

    g.playerJoined = function(player) {
        console.log('new player joined', player);
        var newPlayer = new Player();
        newPlayer.insertPlayer(player);
        g.savePlayer(newPlayer);
    };

    g.playerMoved = function (user) {
        //console.log(user.username, user.coords);
        var curUser = g.getPlayer(user.socket_id);
        if (!curUser) {
            return;
        }
        curUser.setCoords(user.coords);
        curUser.updatePosition(g.currentPlayer.getCoords());

        //console.log('other player moved', user);
    };

    g.currentPlayerMoved = function(user) {
        //console.log('current user moved', user.username, user.coords);
        g.currentPlayer.setBackgroundOffset(user.coords.x, user.coords.y);
        g.currentPlayer.setRadius(user.radius);
        g.currentPlayer.setCoords(user.coords);
    };

    g.players = [];

    g.getPlayer = function(socket_id) {
        var el;
        for (el in g.players) {
            if (!g.players.hasOwnProperty(el)) continue;
            if (g.players[el].getSocketId() === socket_id) {
                return g.players[el];
            }
        }
        return false;
    };

    g.savePlayer = function(player) {
        g.players.push(player);
        return player;
    };

    g.playersReceived = function(players) {
        console.log('players received', players);
        if (!players.length) {
            return;
        }
        for (var el in players) {
            if (!players.hasOwnProperty(el)) continue;
            var player = new Player();
            player.insertPlayer(players[el]);
            player.updatePosition(g.currentPlayer.getCoords());
            g.savePlayer(player);
        }
    };

    g.playerDisconnected = function (player) {
        console.log('player disconnect', player);
        var el;
        for (el in g.players) {
            if (!g.players.hasOwnProperty(el)) continue;
            if (g.players[el].getSocketId() === player.socket_id) {
                g.players[el].remove();
                g.players.splice(el, 1);
            }
        }
    };
})(game);