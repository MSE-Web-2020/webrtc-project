const express = require('express');
const app = express();
const fs = require('fs');
const path = require("path");
const ws = require('ws').Server;
const server = require('https').createServer({
    key:fs.readFileSync(path.join(__dirname,'public','cert','ssl.key')),
    cert:fs.readFileSync(path.join(__dirname,'public','cert','ssl.crt'))
},app);
const SkyRTC = require('./public/server/SkyRTC.js').listen(ws, server);

server.listen(443, '0.0.0.0');
app.use(express.static(path.join(__dirname,'public','client')));
app.get('/', (req, res)=>res.sendfile(path.join(__dirname, 'index.html')));
app.get('/login', (req, res)=>res.sendfile(path.join(__dirname, 'public','client','login.html')));
SkyRTC.rtc.on('new_connect', socket=>console.log('创建新连接'));
SkyRTC.rtc.on('remove_peer', socketId=>console.log(socketId + "用户离开"));
SkyRTC.rtc.on('new_peer', (socket, room)=>console.log("新用户" + socket.id + "加入房间" + room));
SkyRTC.rtc.on('socket_message', (socket, msg)=>console.log("接收到来自" + socket.id + "的新消息：" + msg));
SkyRTC.rtc.on('ice_candidate', (socket, ice_candidate)=>console.log("接收到来自" + socket.id + "的ICE Candidate"));
SkyRTC.rtc.on('offer', (socket, offer)=>console.log("接收到来自" + socket.id + "的Offer"));
SkyRTC.rtc.on('answer', (socket, answer)=>console.log("接收到来自" + socket.id + "的Answer"));
SkyRTC.rtc.on('error', err=>console.log("发生错误：" + err.message));