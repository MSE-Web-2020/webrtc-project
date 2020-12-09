const express = require('express')
const app = express()
const fs = require('fs')
const path = require("path")
const ws = require('ws').Server
const skyrtc = require('./public/server/SkyRTC.js')
const server = require('https').createServer({
    key:fs.readFileSync(path.join(__dirname,'public','cert','ssl.key')),
    cert:fs.readFileSync(path.join(__dirname,'public','cert','ssl.crt'))
},app)

/////////////////////////YZK//////////////////////////
const rtc = skyrtc.rtc
rtc.prototype.enhance = (data, socket)=>{
    //向socket用户发送信息
    socket.send(JSON.stringify({"eventName": "send_to_client", data:data}), skyrtc.err)
}
///////////////////////END YZK////////////////////////

server.listen(443, '0.0.0.0')
app.use(express.static(path.join(__dirname,'public','client')))
app.get('/', (req, res)=>res.sendfile(path.join(__dirname, 'index.html')))
app.get('/login', (req, res)=>res.sendfile(path.join(__dirname, 'public','client','login.html')))

var SkyRTC = new ws({server: server})
SkyRTC.rtc = new rtc()
var errorCb = skyrtc.err(SkyRTC.rtc)
SkyRTC.on('connection', function(socket){this.rtc.init(socket)})
SkyRTC.rtc.on('new_connect', socket=>console.log('创建新连接'))
SkyRTC.rtc.on('remove_peer', socketId=>console.log(socketId + "用户离开"))
SkyRTC.rtc.on('new_peer', (socket, room)=>console.log("新用户" + socket.id + "加入房间" + room))
SkyRTC.rtc.on('socket_message', (socket, msg)=>console.log("接收到来自" + socket.id + "的新消息：" + msg))
SkyRTC.rtc.on('ice_candidate', (socket, ice_candidate)=>console.log("接收到来自" + socket.id + "的ICE Candidate"))
SkyRTC.rtc.on('offer', (socket, offer)=>console.log("接收到来自" + socket.id + "的Offer"))
SkyRTC.rtc.on('answer', (socket, answer)=>console.log("接收到来自" + socket.id + "的Answer"))
SkyRTC.rtc.on('error', err=>console.log("发生错误：" + err.message))

/////////////////////////YZK//////////////////////////
SkyRTC.rtc.on('send_to_server', (data, socket)=>{
    console.log(data)
    //调用rtc.enhance模块，向个人发信息
    SkyRTC.rtc.enhance(data, socket)
    //所有房间广播
    SkyRTC.rtc.broadcast(JSON.stringify({"eventName": "enhance_message","data":data}),errorCb)
    //向特定房间广播
    // SkyRTC.rtc.broadcastInRoom('room',JSON.stringify({"eventName": "enhance_message","data":data}),errorCb)
})
///////////////////////END YZK////////////////////////