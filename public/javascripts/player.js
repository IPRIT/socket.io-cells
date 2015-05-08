var Player = function Player() {
    var field = $('.play-field'),
        playerElement,
        curMouseOffsetX = 0,
        curMouseOffsetY = 0,
        curRadius = 50,
        mouseEventIntervalTime = 50,
        mouseEventInterval,
        socketId = null,
        _userInfo = null,
        coords = null;

    function insertCurrentPlayer(user) {
        _userInfo = userInfo;
        setSocketId(userInfo.socket_id);
        setCoords({
            x: 100,
            y: 100
        });

        playerElement = document.createElement('div');
        playerElement.className = 'current-player player';
        var nameLabel = document.createElement('div');
        nameLabel.className = 'player-username';
        nameLabel.innerHTML = _userInfo.username;
        playerElement.appendChild(nameLabel);
        field.append(playerElement);
        makeMouseHandler();
    }

    function insertPlayer(user) {
        _userInfo = user;
        setSocketId(_userInfo.socket_id);
        setCoords(user.coords);

        playerElement = document.createElement('div');
        playerElement.className = 'other-player player';
        var nameLabel = document.createElement('div');
        nameLabel.className = 'player-username';
        nameLabel.innerHTML = _userInfo.username;
        playerElement.appendChild(nameLabel);
        field.append(playerElement);
    }

    function setCoords(playerCoords) {
        coords = playerCoords;
    }

    function getCoords() {
        return coords;
    }

    function updatePosition(ownCoords) {
        var playerCoords = coords,
            ownPlayer = document.querySelector('.current-player'),
            centerX = ownPlayer.offsetLeft,
            centerY = ownPlayer.offsetTop;
        playerElement.style.left = (centerX + (playerCoords.x - ownCoords.x)) + 'px';
        playerElement.style.top = (centerY + (playerCoords.y - ownCoords.y)) + 'px';
    }

    function setSocketId(socket_id) {
        socketId = socket_id;
    }

    function getSocketId() {
        return socketId;
    }

    function setBackgroundOffset(offsetX, offsetY) {
        field[0].style.backgroundPosition = -offsetX + 'px ' + -offsetY + 'px';
    }

    function setRadius(radius) {
        curRadius = radius;
        playerElement.style.height = radius + 'px';
        playerElement.style.width = radius + 'px';
    }

    function makeMouseHandler() {
        mouseEventInterval = setInterval(function () {
            socket.emit('player moved', {
                offsetX: curMouseOffsetX,
                offsetY: curMouseOffsetY
            });
            //console.log('[Current user moved]', curMouseOffsetX, curMouseOffsetY);
        }, mouseEventIntervalTime);

        field[0].addEventListener('mousemove', function(e) {
            curMouseOffsetX = e.x - playerElement.offsetLeft - curRadius / 2;
            curMouseOffsetY = e.y - playerElement.offsetTop - curRadius / 2;
        })
    }

    function remove() {
        playerElement.remove();
    }

    this.insertCurrentPlayer = insertCurrentPlayer;
    this.setBackgroundOffset = setBackgroundOffset;
    this.setRadius = setRadius;
    this.setSocketId = setSocketId;
    this.getSocketId = getSocketId;
    this.insertPlayer = insertPlayer;
    this.setCoords = setCoords;
    this.getCoords = getCoords;
    this.updatePosition = updatePosition;
    this.remove = remove;
};