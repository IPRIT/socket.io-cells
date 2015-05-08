var Game = {
    maxSpeed: 20,
    leftBorder: -1000,
    rightBorder: 1000,
    topBorder: -1000,
    bottomBorder: 1000,
    defaultRadius: 50,
    getPlayerCoords: function(mouseOffsets, player) {
        var curCoords = player.coords;

        var offsetX = mouseOffsets.offsetX * 0.1;
        if (Math.abs(offsetX) > this.maxSpeed) {
            offsetX = offsetX > 0 ? this.maxSpeed : -this.maxSpeed;
        }
        curCoords.x += offsetX;

        var offsetY = mouseOffsets.offsetY * 0.1;
        if (Math.abs(offsetY) > this.maxSpeed) {
            offsetY = offsetY > 0 ? this.maxSpeed : -this.maxSpeed;
        }
        curCoords.y += offsetY;

        curCoords = this.limitByMap(curCoords);

        return curCoords;
    },
    limitByMap: function(coords) {
        if (coords.x > this.rightBorder) {
            coords.x = this.rightBorder;
        }
        if (coords.x < this.leftBorder) {
            coords.x = this.leftBorder;
        }
        if (coords.y < this.topBorder) {
            coords.y = this.topBorder;
        }
        if (coords.y > this.bottomBorder) {
            coords.y = this.bottomBorder;
        }
        return coords;
    }
};


module.exports = Game;