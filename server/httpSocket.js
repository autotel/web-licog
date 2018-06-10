'use strict';
var onHandlers=require('onhandlers');
var httpPort=80;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var sockets = require('socket.io')(http);
var SocketClientMan = require('./SocketClientMan.js');


module.exports=function(nodeServer){ return new (function(){
  onHandlers.call(this);
  var serverMan=this;
  var self=this;
  var socketClients=new SocketClientMan(this);

  this.start=function(file){
    console.log("starting server");
    app.get('/', function(req, res){
      app.use("/",express.static('./client'));
      app.use("/shared",express.static('./shared'));
      res.sendFile(file);
    });
    http.listen(httpPort, function(){
      console.log('listening on :'+httpPort);
    });
    sockets.on('connection', function(socket){
      var client=socketClients.add(socket);
      self.handle('+ client',client)
    });
  }
  this.broadcast=function(a,b){
    console.log("BROADCAST");
    sockets.emit(a,b)
  };
  return this;
})()};
