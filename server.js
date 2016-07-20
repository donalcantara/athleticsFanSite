var express = require("express");
var app = express();
var mongoose = require('mongoose');
var express = require('express');
var path = require("path");
// Require body-parser (to receive post data from clients)
var bodyParser = require("body-parser");
// Integrate body-parser with our App
app.use(bodyParser.urlencoded());
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, "./static")));

var listen = app.listen(8000, function() {
    console.log("listening on port 8000");
})


var users = {"Don": true};
var history = [];

// console.log(server);
var io = require('socket.io').listen(listen);

io.sockets.on('connection', function (socket) {
  console.log("Sockets On!");
  socket.emit(socket.id + ' has connected!');

  // event for creating a new user
  socket.on('creating:user', function(data){
    console.log(data);
    if(data.username == null || data.username == ''){
      socket.emit('failed:user', {error: 'username exists'})
    }else{
      users[data.username] = data.username;
      socket.emit('success:user', {message: 'username accepted!', history: history})
    }
  })

  // event for handling a new message
  socket.on('new:chat', function(data){
    history.push(data.text);
    socket.broadcast.emit('get:chat', {message: data.text})
    socket.broadcast.emit(socket.id + ' has disconnected!')
  })

  // listener for handling a disconnect
  socket.on('disconnect', function(){
    console.log(socket.id + ' has disconnected!')
  })
})
