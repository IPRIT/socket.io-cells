var socket,
    userInfo;

$(document).ready(function() {
    socket = io();

    function signUpUser(callback) {
        var username = prompt('Укажите имя игрока'),
            user = {
                username: username.length ? username : 'Noname',
                objectId: createId()
            };
        ConfigStorage.set({
            user: user
        }, function() {
            ConfigStorage.get('user', function(user) {
                callback(user);
            })
        });
    }

    ConfigStorage.get('user', function(user) {
        if (!user) {
            signUpUser(function(user) {
                userInfo = user;
                $('#own_username').text(stripTags(userInfo.username));
            });
            return;
        }
        userInfo = user;
        $('#own_username').text(stripTags(userInfo.username));
    });

    socket.emit('current player joined', userInfo);
    game.handler(socket).run();
});

function createId() {
    return (Math.random() * 10000).toString(16);
}

function stripTags(str) {
    return str.replace('<', '&lt;').replace('>', '&gt;');
}



// ConfigStorage based on
/*!
 * https://github.com/zhukov/webogram
 * Copyright (C) 2014 Igor Zhukov <igor.beatle@gmail.com>
 * https://github.com/zhukov/webogram/blob/master/LICENSE
 */
(function (window) {
    var keyPrefix = '';
    var noPrefix = false;
    var cache = {};
    var useCs = false;
    var useLs = !useCs && !!window.localStorage;

    function storageSetPrefix (newPrefix) {
        keyPrefix = newPrefix;
    }

    function storageSetNoPrefix() {
        noPrefix = true;
    }

    function storageGetPrefix () {
        if (noPrefix) {
            noPrefix = false;
            return '';
        }
        return keyPrefix;
    }

    function storageGetValue() {
        var keys = Array.prototype.slice.call(arguments),
            callback = keys.pop(),
            result = [],
            single = keys.length == 1,
            value,
            allFound = true,
            prefix = storageGetPrefix(),
            i, key;

        for (i = 0; i < keys.length; i++) {
            key = keys[i] = prefix + keys[i];
            if (useLs) {
                try {
                    value = localStorage.getItem(key);
                } catch (e) {
                    useLs = false;
                }
                try {
                    value = (value === undefined || value === null) ? false : JSON.parse(value);
                } catch (e) {
                    value = false;
                }
                result.push(cache[key] = value);
            }
            else if (!useCs) {
                result.push(cache[key] = false);
            }
            else {
                allFound = false;
            }
        }

        if (allFound) {
            return callback(single ? result[0] : result);
        }
    }

    function storageSetValue(obj, callback) {
        var keyValues = {},
            prefix = storageGetPrefix(),
            key, value;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                value = obj[key];
                key = prefix + key;
                cache[key] = value;
                value = JSON.stringify(value);
                if (useLs) {
                    try {
                        localStorage.setItem(key, value);
                    } catch (e) {
                        useLs = false;
                    }
                } else {
                    keyValues[key] = value;
                }
            }
        }

        if (useLs || !useCs) {
            if (callback) {
                callback();
            }
        }
    }

    function storageRemoveValue () {
        var keys = Array.prototype.slice.call(arguments),
            prefix = storageGetPrefix(),
            i, key, callback;

        if (typeof keys[keys.length - 1] === 'function') {
            callback = keys.pop();
        }

        for (i = 0; i < keys.length; i++) {
            key = keys[i] = prefix + keys[i];
            delete cache[key];
            if (useLs) {
                try {
                    localStorage.removeItem(key);
                } catch (e) {
                    useLs = false;
                }
            }
        }
        if (callback) {
            callback();
        }
    }

    window.ConfigStorage = {
        prefix: storageSetPrefix,
        noPrefix: storageSetNoPrefix,
        get: storageGetValue,
        set: storageSetValue,
        remove: storageRemoveValue
    }

})(window);