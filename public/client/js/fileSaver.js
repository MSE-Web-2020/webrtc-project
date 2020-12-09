var recorderFile, mediaRecorder
$('#record').click(function(){
    if($(this).text() == 'start'){
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
        $('#me').css('border',"1px solid green")
        $(this).text('start')
    }
})

$('#save').click(()=>{
    confirm('确定要保存当前录制内容吗？')
    &&$('<a>').attr({
        'href':window.URL.createObjectURL(recorderFile),
        'download':`MSE-${(new Date).toISOString().replace(/:|\./g,'-')}.mp4`,
    }).appendTo('body').bind('click',function(){this.click()}).click().remove()
})
