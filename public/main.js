var series1 = new TimeSeries();
var series2 = new TimeSeries();

const socket = io()
var chart2;

data = []

socket.on('ecg', (value) => {
    var now = Date.now();
    series2.append(now, value)
    
})
socket.on('touch', (touch) => {
    console.log(touch)
    if(touch.chest == true){
        $('#chest').removeClass()
        $('#chest').addClass('body-danger')
    }
    else {
        $('#chest').removeClass()
        $('#chest').addClass('body-ok')
    }
    if(touch.arm == true){
        $('#left-arm').removeClass()
        $('#left-arm').addClass('body-danger')
    }
    else {
        $('#left-arm').removeClass()
        $('#left-arm').addClass('body-ok')
    }
    if(touch.abdomen == true){
        $('#abdomen').removeClass()
        $('#abdomen').addClass('body-danger')
    }
    else {
        $('#abdomen').removeClass()
        $('#abdomen').addClass('body-ok')
    }
    if(touch.lkidney == true){
        $('#left-kidney').removeClass()
        $('#left-kidney').addClass('body-danger')
    }
    else {
        $('#left-kidney').removeClass()
        $('#left-kidney').addClass('body-ok')
    }
    if(touch.rkidney == true){
        $('#right-kidney').removeClass()
        $('#right-kidney').addClass('body-danger')
    }
    else {
        $('#right-kidney').removeClass()
        $('#right-kidney').addClass('body-ok')
    }
})

socket.on('temp', (temp) => {
    $('#temp').text(temp)
})

socket.on('bpm', (bpm) => {
    $('#bpm').text(bpm)
})


socket.on('spo2', (spo2) => {
    $('#spo2').text(spo2)
})
socket.on('battery', (battery) => {
    $('#battery').text(battery)
})

socket.on('danger', (danger) => {
    if(danger.connection == true){
        $('#wifi').text('NO')
    }
    else $('#wifi').text('OK')
})



function createTimeline() {
    chart2 = new SmoothieChart({ responsive: true });
    chart2.addTimeSeries(series2, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 1});
    chart2.streamTo(document.getElementById("chart-responsive"), 500);

}


