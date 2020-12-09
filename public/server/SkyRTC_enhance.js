module.exports.listen = function(SkyRTC, rtc, errCb){
    //增强推送
    rtc.prototype.enhance = (data, socket)=>{
        //向socket用户发送信息
        socket.send(JSON.stringify({"eventName": "send_to_client", data:'这是一条来自服务器的信息！'}), errCb)
    }

    SkyRTC.rtc = new rtc()
    var errorCb = errCb(SkyRTC.rtc)

    //增强监听(向个人发送信息)
    SkyRTC.rtc.on('send_to_server', (data, socket)=>SkyRTC.rtc.enhance(data, socket))
    //所有房间广播
    SkyRTC.rtc.on('all_room', data=>{
        SkyRTC.rtc.broadcast(JSON.stringify({eventName: 'all_room', data: data}), errorCb)
        //向特定房间广播
        // SkyRTC.rtc.broadcastInRoom('room',JSON.stringify({eventName: '', data: data}),errorCb)
    }) 




    //服务器端监听（基础）
    SkyRTC.on('connection', function(socket){this.rtc.init(socket)})
    SkyRTC.rtc.on('new_connect', socket=>console.log('创建新连接'))
    SkyRTC.rtc.on('remove_peer', socketId=>console.log(socketId + "用户离开"))
    SkyRTC.rtc.on('new_peer', (socket, room)=>console.log("新用户" + socket.id + "加入房间" + room))
    SkyRTC.rtc.on('socket_message', (socket, msg)=>console.log("接收到来自" + socket.id + "的新消息：" + msg))
    SkyRTC.rtc.on('ice_candidate', (socket, ice_candidate)=>console.log("接收到来自" + socket.id + "的ICE Candidate"))
    SkyRTC.rtc.on('offer', (socket, offer)=>console.log("接收到来自" + socket.id + "的Offer"))
    SkyRTC.rtc.on('answer', (socket, answer)=>console.log("接收到来自" + socket.id + "的Answer"))
    SkyRTC.rtc.on('error', err=>console.log("发生错误：" + err.message))
}


