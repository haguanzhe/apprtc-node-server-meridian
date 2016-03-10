var express = require('express');
var crypto = require('crypto');
var app = express();

var hmac = function (key, content) {
    var method = crypto.createHmac('sha1', key);
    method.setEncoding('base64');
    method.write(content);
    method.end();
    return method.read();
};

app.get('/turn', function (req, res) {
    var query = req.query;

    if (!query['username']) {
        return res.send({'error': 'AppError', 'message': 'Must provide username.'});
    } else {
        var key = query['key'] ? query['key'] : '4080218913';
        console.log('username: ' +  query['username'] + ', key: ' + key);
        var time_to_live = 600;
        var timestamp = Math.floor(Date.now() / 1000) + time_to_live;
        var turn_username = timestamp + ':' + query['username'];
        var password = hmac(key, turn_username);

        res.send({
            username: turn_username,
            password: password,
            ttl: time_to_live,
            uris: [
                "turn:218.241.151.250:3478?transport=udp",
                "turn:218.241.151.250:3478?transport=tcp",
                "turn:218.241.151.250:3479?transport=udp",
                "turn:218.241.151.250:3479?transport=tcp"
            ]
        });
    }
});

app.listen('9000', function () {
    console.log('Server started');
});
