/* Global Variables*/
var t = 0;
var hz = 25;

var as_0 = [0.4078, 0.2778];
var hl_1 = [0.190, 0.201];			
var hl_2 = [10.547, 0.058];
var cov_0  = [2.0, 2.0]; //DGF Update this value when robot position updates
var as_curr = [0.4078, 0.2778, 0.00];

var W = 100.0;
var H = 200.0;
var cx = W/2;
var cy = 0.85*H;
var s = 15.0; //15.0

var connectionInfo="";

var circ;
var text;
var poly;
var rect;
var elps;

var ret = 0;

var ros = new ROSLIB.Ros({
	url: 'ws://192.168.125.101:9090'  // Replace with your ROS bridge WebSocket URL
});
ros.on('connection', function() {
document.getElementById("statusDisplay").innerHTML = "Connected";
});

ros.on('error', function(error) {
document.getElementById("statusDisplay").innerHTML = "Error";
});

ros.on('close', function() {
document.getElementById("statusDisplay").innerHTML = "Closed";
});



var dashboardClient = new ROSLIB.Service({
	ros : ros,
	name : '/dashboard',
	serviceType : 'yolov5/srv/Dashboard'
});

//---------------------------------------
// Utility for Sending Dashboard Service
//  Requests
//---------------------------------------
function serviceCall(msg)
{
	var request = new ROSLIB.ServiceRequest({goal : msg});
	dashboardClient.callService(request, function(result) {});
}

var imageTopic = new ROSLIB.Topic({
    ros : ros,
    name : '/Visualize',
    messageType : 'sensor_msgs/Image'
});

var log_listener1 = new ROSLIB.Topic({
	ros : ros,
	name : '/BSP/logger',
	messageType : 'std_msgs/String'
});

var log_listener2 = new ROSLIB.Topic({
	ros : ros,
	name : '/Engine_module/logger',
	messageType : 'std_msgs/String'
});

var log_listener3 = new ROSLIB.Topic({
	ros : ros,
	name : '/Engine_submodule/logger',
	messageType : 'std_msgs/String'
});

var log_listener4 = new ROSLIB.Topic({
	ros : ros,
	name : '/Box_status/logger',
	messageType : 'std_msgs/String'
});

log_listener1.subscribe(function(m) 
{
	var elem1 = document.getElementById("log1")
	elem1.innerHTML = m.data;
});

log_listener2.subscribe(function(m) 
{
	var elem2 = document.getElementById("log2")
	elem2.innerHTML = m.data;
});

log_listener3.subscribe(function(m) 
{
	var elem3 = document.getElementById("log3")
	elem3.innerHTML = m.data;
});

log_listener4.subscribe(function(m) 
{
	var elem4 = document.getElementById("log4")
	elem4.innerHTML = m.data;
});
