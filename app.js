// Import dependencies
var express = require('express');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var path = require('path');

// Initialize Express App
var app = express();
var port = process.env.PORT || 8080;
var uri = process.env.MONGOLAB_URI ||
          process.env.MONGOHQ_URL ||
          process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME ||
          'mongodb://localhost/shorten-url';

// Connect to mongoose
mongoose.connect(uri);
console.log('Connected to MongoDB');
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

// Create model
var ShortenedUrl = mongoose.model('ShortenedUrl', {
  'original_url': String,
  'short_url': String,
  'short_code': Number
});

// Middleware
app.use(favicon(__dirname + '/favicon.ico'));

// Route handling
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/:shortCode', function(req, res) {
  ShortenedUrl.findOne({
    'short_code': parseInt(req.params.shortCode)
  }, function(err, doc) {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    res.redirect(doc.original_url);
  });
});

app.get('/new/:url*', function(req, res) {
  var url = req.params.url + req.params[0];
  if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
    var length;
    ShortenedUrl.find({}, function (err, docs) {
      length = docs.length;
      var object = {
        'original_url': url,
        'short_url': 'https://aqueous-sierra-2642.herokuapp.com/' + length,
        'short_code': length
      };
      ShortenedUrl.create(object, function(err) {
        if (err) {
          console.error(err);
          process.exit(-1);
        }
        res.json(object);
      });
    });
  } else {
    res.json({
      'error': 'Invalid URL'
    });
  }
});

// Server initialization
app.listen(port);
console.log('Listening on port ' + port);
