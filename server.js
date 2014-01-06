#!/usr/bin/env node
var http = require('http'),
    path = require('path'),
    express = require('express.io'),
    hbs = require('express-hbs'),
    ot = require('ot'),
    app = express(),
    server = app.http(),
    port = 3000;

app.configure(function () {
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express['static'](path.join(__dirname, 'public')));

    app.engine('hbs', hbs.express3());
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, 'views'));
});
app.http().io();
app.listen(port, function(){
    console.log("Express server listening on port %d", port);
});

/*jshint multistr: true */
var doc = "#Header\n\
\n\
##Subheader a bit smaller\n\
\n\
1. one\n\
2. two\n\
2. three\n\
10. four\n\
\n\
* list\n\
* of\n\
* items\n\
\n\
|Participant|Score|\n\
|------|---------:|\n\
|Sigurd|100|\n\
|Jørgen|100|\n\
\n\
\n\
http://strekmann.no\n\
\n\
<post@strekmann.no>\n";

var ot_server = new ot.EditorSocketIOServer(doc, [], 'trall', function (socket, cb) {
    cb(!!socket.mayEdit);
});
app.io.route('ready', function (req) {
    req.io.socket.mayEdit = true;
    ot_server.addClient(req.io.socket);
});

app.get('/', function (req, res) {
    res.render('index');
});
