'use strict'
//this is created when a client connects to the socket, and keeps track of the user and it's events and so on.


var onHandlers=require('onhandlers');
var clientsList={}
var enlist=function(what){
  var n=0;
  console.log('AA');
  while(clientsList[n]!==undefined){
    n++;
    console.log("NL",n);
  }
  clientsList[n]=what;
  return n;
}
var delist=function(n){
  delete clientsList[n];
}

module.exports=function(socketManager){

  var SocketClient=function(socket){
    var self=this;
    var n=enlist(this);
    this.trackedData={clientId:n}
    console.log("SCKCL",self.trackedData);
    // console.log(socketManager);
    console.log('a client connected',n);
    socketManager.broadcast('+c',self.trackedData);//tell other clients about new client
    socket.emit('hi',n);//send id for self-identification
    for(var a in clientsList){
      if(clientsList[a]!==undefined){
        socket.emit('+c',self.trackedData);
      }
    }
    // console.log(socketManager);
    onHandlers.call(this);
    var thisClient=this;
    socket.on('disconnect',function(e){
      console.log("client disconnected",n);
      socketManager.broadcast('-c',{clientId:n});//tell other clients about client disconnected
      delist(n);
    });
    socket.on('b',function(msg){
      //b messages get mirrored, only a clientId is attached
      msg.clientId=n;
      console.log("Broadcast",msg);
      socketManager.broadcast('b',msg);
    });

    socket.on('~c',function(msg){
      //b messages get mirrored, only a clientId is attached
      msg.clientId=n;
      console.log("Broadcast ~c",msg);
      socketManager.broadcast('~c',msg);
      for(var a in msg){
        self.trackedData[a]=msg[a];
      }
    });

    this.emit=function(b){
      socket.emit('message',b)
    }
  }

  onHandlers.call(this);
  this.add=function(socket){
    var nsc=new SocketClient(socket);

    return
  }
  return this;
};
