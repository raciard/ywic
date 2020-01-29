var series1 = new TimeSeries();
var series2 = new TimeSeries();
// Randomly add a data point every 500ms
setInterval(function() {
var now = Date.now();
var val = Math.random() * 10000;
series1.append(now, val);
series2.append(now, val);
}, 500);
function createTimeline() {
var chart2 = new SmoothieChart({ responsive: true });
chart2.addTimeSeries(series2, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4});
chart2.streamTo(document.getElementById("chart-responsive"), 500);
}