var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/kalimatai');
var db = mongoose.connection;