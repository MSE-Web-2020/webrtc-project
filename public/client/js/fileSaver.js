var recorderFile, mediaRecorder
////////////////////// HWL ////////////////////////////
var videoIdArray=new Array();
var otherVideoId = document.getElementById("otherVideoIdNum");
var videoOther;
var n=0;
////////////////////END HWL //////////////////////////////
$('#record').click(function(){
    if($(this).text() == 'start'){
        $("#save")[0].disabled=true;
        let buffer = []
        mediaRecorder = new MediaRecorder($('#me')[0].srcObject);
        mediaRecorder.ondataavailable = e=>buffer.push(e.data)
        mediaRecorder.onstop = e=>{
            recorderFile = new Blob(buffer, {'type':'video/mp4'})
            buffer = []
            alert("录制成功!")
        }
        mediaRecorder.start();
        $('#me').css('border',"3px solid yellow");
        $(this).text('stop')
    }else{
        mediaRecorder.stop()
        $("#save")[0].disabled=false;
        $('#me').css('border',"1px solid green")
        $(this).text('start')
    }
})
//////////////////////// HWL //////////////////////////
$('#record-other').click(function(){
    if($(this).text() == 'start-other'){
        $("#save")[0].disabled=true;
        let buffer = []
        var otherVideoIdNum = parseInt(otherVideoId.value);
        alert("当前录制窗口:"+otherVideoIdNum);
        if(otherVideoIdNum < videoIdArray.length){
            videoOther = document.getElementById(videoIdArray[otherVideoIdNum]);
            mediaRecorder = new MediaRecorder(videoOther.srcObject);
            mediaRecorder.ondataavailable = e=>buffer.push(e.data)
            mediaRecorder.onstop = e=>{
                recorderFile = new Blob(buffer, {'type':'video/mp4'})
                buffer = []
                alert("录制成功!")
            }
            mediaRecorder.start();
            videoOther.style.border="3px solid yellow";
            $(this).text('stop-other')
        }else{
            alert("无对应窗口信息！");
            $("#record-other")[0].disabled = false;
        }
    }else{
        mediaRecorder.stop()
        $("#save")[0].disabled=false;
        videoOther.style.border="1px solid green";
        $(this).text('start-other')
    }
})
/////////////////// END HWL ///////////////////////////////////
$('#save').click(()=>{
    confirm('确定要保存当前录制内容吗？')
    &&$('<a>').attr({
        'href':window.URL.createObjectURL(recorderFile),
        'download':`MSE-${(new Date).toISOString().replace(/:|\./g,'-')}.mp4`,
    }).appendTo('body').bind('click',function(){this.click()}).click().remove()
})
