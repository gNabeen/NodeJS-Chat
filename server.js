var express =require('express'),
http = require('http');
var app= express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('server running ...'+process.env.PORT);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);

	socket.on('disconnect',function(data){
		if(socket.username)
		{
			users.splice(users.indexOf(socket.username),1);
			io.sockets.emit('new message',{msg: socket.username + ' left the squad !', user: ''});
			console.log(socket.username);
			updateUsernames(); 
			connections.splice(connections.indexOf(socket.username),1);
			console.log('Disconnected: %s sockets conected', connections.length);
		}
	});
 //send message
 socket.on('send message', function(data){
 	console.log(data)
 	io.sockets.emit('new message',{msg: data, user: socket.username});
 });
 socket.on('leave',function(data){
 	users.splice(users.indexOf(data),1);
 	io.sockets.emit('new message',{msg: data + ' used a escape potion !', user: '+leave'});
 	updateUsernames();
 	connections.splice(connections.indexOf(data),1);
 	socket.disconnect();
 });
 //new User

 socket.on('new user', function(data,callback){
 	callback(true);
 	socket.username = data;
 	users.push(socket.username);
 	io.sockets.emit('new message',{msg: socket.username + ' joined the squad !', user: ''});
 	updateUsernames();
 });

 function updateUsernames(){
 	io.sockets.emit('get users', users);
 }
});﻿