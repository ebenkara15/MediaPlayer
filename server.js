var express = require('express');
var serveStatic = require('serve-static');
var favicon = require('serve-favicon')

var app = express();

app.use(favicon(__dirname+'/client/icon/icon_main.ico'))
app.use(serveStatic('client', {'index':['interface.html']}));
app.use('/data', express.static('data'));

app.get('/music_lib', function(req, res) {
    res.sendFile(__dirname+'/data/music_lib.json');
});

app.listen(8080);