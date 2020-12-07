const video_size = 500, landmarks = false, group_id = 'test'
const video = $('#video')[0], canvas = $('#overlay')[0]
const faceoptions = new faceapi.TinyFaceDetectorOptions({inputSize:224, scoreThreshold:0.1})
const access_token = '24.cc49ba595030f0a677fd9d1dd8153386.2592000.1609907365.282335-23103930'
var snap, timer, username, stream, onff

//初始样式
$('#video').attr({'width':video_size,'height':video_size})
$('#overlay').attr({'width':video_size,'height':video_size}).css('margin-left',-video_size)
//按键绑定
$('#onff').click(()=>{
	if(onff){
		run()
		onff = null
	}else{
		stream.getTracks()[0].stop()
		onff = true
	}
})
$('#login').click(()=>{
	if(username){
		if($('#roomname').val()) alert('即将登录')
		else{
			if(confirm('尚未填写房间号，即将进入公共房间，是否进入？')) alert('即将登录')
			else console.log('退出')
		}
	}
	else alert('尚未验证')
})
$('#register').click(()=>{
	if(!$('#username').val()) alert('尚未填写用户名')
	else{
		getsnap()
		adduser()
	}
})
$('#delete').click(()=>confirm('确认删除用户？')&&$.ajax({
	url:`https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/delete?access_token=${access_token}`,
	type:'post', dateType:'json',
	data:JSON.stringify({user_id:$('#username').val(),group_id:group_id}),
	success:data=>{
		if(data.error_code!=0) alert(data.error_msg)
		else alert(`用户 ${$('#username').val()} 删除成功`)
		$('#username').val('')
	},
	error:data=>console.log("error")
}))
$('#video').click(()=>{
	$('#username').val('')
	snap = null
})
//function
verify=()=>$.ajax({
	url:`https://aip.baidubce.com/rest/2.0/face/v3/search?access_token=${access_token}`,
	type:'post', dateType:'json',
	data:JSON.stringify({image:snap,image_type:'BASE64',group_id_list:group_id}),
	success:data=>{
		if(data.result){
			let user = data.result.user_list[0]
			if(user.score>60){
				username = user.user_id
				$('#username').val(username)
				alert(`用户 ${username} 验证成功`)
				return true
			}else return false
		}else{
			alert('No user matched!')
			return false
		}
	},
	error:data=>console.log("error")
})

adduser=()=>{
$.ajax({
	url:`https://aip.baidubce.com/rest/2.0/face/v3/search?access_token=${access_token}`,
	type:'post', dateType:'json',
	data:JSON.stringify({image:snap,image_type:'BASE64',group_id_list:group_id}),
	success:data=>{
		if(data.result&&data.result.user_list[0].score>90){
			let name = data.result.user_list[0].user_id
			alert(`您已注册！用户名为:${name}`)
			username = name
			$('#username').val(name)
			return false
		}else{

$.ajax({
	url:`https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/add?access_token=${access_token}`,
	type:'post', dateType:'json',
	data:JSON.stringify({image:snap,image_type:'BASE64',group_id:group_id,user_id:$('#username').val()||'user'}),
	success:data=>{
		if(data.error_code!=0) alert(data.error_msg)
		else{
			username = $('#username').val()
			alert('注册成功')
			// console.log(data.result.face_token)
		}
	},
	error:data=>console.log("error")
})

		}
	},
	error:data=>console.log("error")
})
}

getsnap=()=>{
	$('<canvas>').appendTo('body').attr({id:'snapshot',width:video_size,height:video_size})[0].getContext('2d').drawImage(video, 0, 0, video_size/2, video_size/2)
	snap = $('#snapshot')[0].toDataURL().replace(/^data:image\/\w+;base64,/, "")
	$('#snapshot')[0].remove()
	return true
}

async function onPlay(v){
	let option = {}, box
	let video = v.find('video')[0]
	let canvas = v.find('canvas')[0]
	let result = landmarks
		?await faceapi.detectSingleFace(video, faceoptions).withFaceLandmarks(true)
		:await faceapi.detectSingleFace(video, faceoptions)
	if (result) {
		timer=timer||Date.now()
		let dims = faceapi.matchDimensions(canvas, video, true)
		let resize = faceapi.resizeResults(result, dims)
		if(resize.score){
			box = resize.box
			option.label = resize.score.toFixed(2)
		}else{
			box = resize.detection.box
			option.label = resize.detection.score.toFixed(2)
		}
		if(!snap&&option.label>0.5&&(Date.now()-timer)>3000){
			getsnap()
			verify()
		}
		option.boxColor = option.label>0.5?'rgba(0,255,0,0.8)':'rgba(255,0,0,0.8)'
		new faceapi.draw.DrawBox(box, option).draw(canvas)
		landmarks&&faceapi.draw.drawFaceLandmarks(canvas, resize)
	}else{
		timer=null
		canvas.height=canvas.height
	}
	$('#video').show()
	setTimeout(()=>onPlay(v))
}

async function run(){
	await faceapi.nets.tinyFaceDetector.load('/js')
	landmarks&&await faceapi.loadFaceLandmarkTinyModel('/js')
	navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:video_size,height:video_size}})
		.then(s=>(video.srcObject=stream=s))
		.catch(e=>console.log(e))
}
//加载
window.onload=()=>{
	video.onloadedmetadata=function(){onPlay($(this).parent())}
	run()
}