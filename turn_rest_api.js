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

app.get('/turn', function (req, resp) {

    var query = req.query;
    var key = query['key'] ? query['key'] : '4080218913';

    if (!query['username']) {
        return resp.send({'error': 'AppError', 'message': 'Must provide username.'});
    } else {
        var time_to_live = 600;
        var timestamp = Math.floor(Date.now() / 1000) + time_to_live;
        //var timestamp = Math.round(new Date().getTime() / 1000) + time_to_live;
        var turn_username = timestamp + ':' + query['username'];
        //var turn_username = query['username'] + ':' + timestamp;
        var password = hmac(key, turn_username);

        console.log('username: ' + turn_username);

        resp.send({
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
    console.log('server started');
});
