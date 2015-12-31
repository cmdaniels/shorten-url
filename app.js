// Import dependencies
var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');

// Initialize Express App
var app = express();
var port = process.env.PORT || 8080;

// Middleware
app.use(favicon(__dirname + '/favicon.ico'));

// Route handling
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/:shortCode', function(req, res) {
  res.end();
});

app.get('/new/:url*', function(req, res) {
  res.json({});
});

// Server initialization
app.listen(port);
console.log('Listening on port ' + port);
