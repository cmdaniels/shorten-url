// Import dependencies
var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');

// Initialize Express App
var app = express();
var port = process.env.PORT || 8080;

// Local database
var database = [];

// Middleware
app.use(favicon(__dirname + '/favicon.ico'));

// Route handling
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/:shortCode', function(req, res) {
  res.redirect(database[req.params.shortCode].original_url);
});

app.get('/new/:url*', function(req, res) {
  var object = {
    'original_url': req.params.url + req.params[0],
    'short_url': 'https://aqueous-sierra-2642.herokuapp.com/' + database.length
  };
  database.push(object);
  res.json(object);
});

// Server initialization
app.listen(port);
console.log('Listening on port ' + port);
