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
const dir = path.join(__dirname,'public','client')
require('./public/server/SkyRTC_enhance.js')
    .listen(new ws({server: server}), skyrtc.rtc, skyrtc.err)
// 增强功能在SkyRTC_enhance.js中编辑

server.listen(443, '0.0.0.0')
app.use(express.static(dir))
app.get('/', (req, res)=>res.sendfile(path.join(dir,'index.html')))
app.get('/login', (req, res)=>res.sendfile(path.join(dir,'login.html')))