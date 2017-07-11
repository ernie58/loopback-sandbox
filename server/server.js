'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var utils = require('util');

var app = module.exports = loopback();

app.start = function() {
  var db = app.dataSources.db;
  if (db.connected) {
    db.automigrate(seed);
  } else {
    db.once('connected', function () {
      db.automigrate(seed);
    });
  }

  function seed(){
    app.models.Person.create({
      'name': 'Doe',
      'firstName': 'John',
      'gender': 'M',
      'username': 'john-doe',
      'email': 'john-doe@mailinator.com',
      'password': 'ilikerandompasswords'
    });

    app.models.Task.create({
      'name': 'task',
      'description': "some todos"
    });
  }
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
