'use strict';
var server = require('./server');
var ds = server.dataSources.db;
var lbTables = ['fileUpload'];
ds.automigrate(lbTables, function(er) {
  if (er) throw er;
  console.log('tables [' + lbTables + '] created in ', ds.adapter.name);
  ds.disconnect();
});
