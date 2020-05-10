const express = require('express');

const server = express();

server.listen(8080);

server.use(function(req, res, next) {
    console.log(1);
    req.on('data', function(data) {
        console.log('data');
        req.body += 3;
    });

    req.on('end', function() {
        console.log('end');
        next();
        console.log('end2');
    });
});

server.use('/', function(req, res) {
    console.log('2');
    console.log(req.body);
    res.write('123')
    res.end();
});
