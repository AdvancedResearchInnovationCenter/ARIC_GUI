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


//-----------------------------
// Connecting with ROS Server
//-----------------------------
// var ros = new ROSLIB.Ros({
// 	url : 'ws://' + window.location.host + ':9090'
// });
var ros = new ROSLIB.Ros({
	url : 'ws://localhost:9090'
});

ros.on('connection', function() {
	document.getElementById("status").innerHTML = "Connected";
});



ros.on('error', function(error) {
	document.getElementById("status").innerHTML = "Error";
});

ros.on('close', function() {
	document.getElementById("status").innerHTML = "Closed";
});


//--------------------------------
// Connecting to Dashboard Service
//--------------------------------
var dashboardClient = new ROSLIB.Service({
	ros : ros,
	name : '/dashboard',
	serviceType : 'yolov5/srv/Dashboard'
});

//----------------------------------------
// Subscribing to and Handling Job Status
//	Messages from Core
//----------------------------------------
// var progress_listener = new ROSLIB.Topic({
// 	ros : ros,
// 	name : '/core/progress',
// 	messageType : 'std_msgs/String'
// });

// progress_listener.subscribe(function(m) 
// {
// 	elem = document.getElementById("progressStatus");

// 	var obj = JSON.parse(m.data);

// 	var failed = obj.failed;
// 	var drilledOff = obj.drilledOff;
// 	var notStarted = obj.notStarted;
	
// 	var total = failed + drilledOff + notStarted;
// 	var stop1 = 100 * failed/total;
// 	var stop2 = 100 * (failed + drilledOff)/total;
// 	elem.style.backgroundImage = "linear-gradient(to right, #FF0000 0%, #FF0000 " + stop1 + "%, #00FF00 " + stop1 + "%, #00FF00 " + stop2 + "%, #AAAAAA " + stop2 + "%, #AAAAAA 100%)";
// 	elem.innerHTML = "Failed/DrilledOff/NotStarted : " + failed + "/" + drilledOff + "/" + notStarted;
// });


//----------------------------------------
// Subscribing to and Handling Battery
//	Messages from Core
//----------------------------------------
// var voltage_listener = new ROSLIB.Topic({
// 	ros : ros,
// 	name : '/core/battery',
// 	messageType : 'std_msgs/String'
// });

// voltage_listener.subscribe(function(m)
// {
// 	elem = document.getElementById("progressVoltage");
// 	var obj = JSON.parse(m.data);
// 	var text = obj.text;
// 	var hue = obj.hue;
// 	elem.innerHTML = text;
// 	elem.style.backgroundColor = "hsl(" + hue + ",100%,50%)";
// });

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

//--------------------------------------------------
// Handling Authorisation and Requesting calibration
//  via a Dashboard call
//--------------------------------------------------
// function togglePopup(){
// 	document.getElementById("popupBox").classList.toggle("active");
// 	//reset the content of the password box
// 	document.getElementById("passwordBox").value="";
// }

// function calibrationRequest(){
// 	var msg = "calibrate,"+document.getElementById("passwordBox").value;
// 	serviceCall(msg);
// 	togglePopup();
	
// }

// function init() {
// 	// Create the main viewer.
// 	var viewer = new MJPEGCANVAS.Viewer({
// 		divID : 'mjpeg',
// 		host : 'localhost',
// 		width : 848,
// 		height : 480,
// 		topic : '/camera/color/image_raw'
// 	});
// }
//----------------------------------
// Main Dashbord Service Calls
//----------------------------------
// function start()
// {
// 	var selectWorkorder = document.getElementById("workorder");
// 	var selectJob = document.getElementById("job");
	
// 	if (selectWorkorder.value == "NEW")
// 	{
// 		var request = new ROSLIB.ServiceRequest({goal : 'new'});
// 		dashboardClient.callService(request, function(result) {});
// 		selectWorkorder.innerHTML = "";
// 		setTimeout(function(){loadWorkOrders()}, 500);	
// 	}
// 	else
// 	{
// 		var request = new ROSLIB.ServiceRequest({goal : 'start,' + selectWorkorder.value + ',' + selectJob.value});
// 		dashboardClient.callService(request, function(result) {});
// 	} 
// }

// function getBoundAddress()
// {
// 	var myAddress = window.location.host;
// 	console.log(document.location.toString());
// 	var request = new ROSLIB.ServiceRequest({goal : 'getBoundAddress'});
// 	dashboardClient.callService(request, function(result) 
// 	{
// 		var arr = JSON.parse(result.result);
// 		("Website Version - 1 minute ago, haha!");
// 		if(arr.boundStatus == false)
// 		{
// 			alert('Computer says NO\n' + arr.boundAddress + ' already connected');
// 			window.location.href = "about:blank";
// 		}	
// 	});
// }

// function loadWorkOrders()
// {
// 	var selectWorkorder = document.getElementById("workorder");
// 	var request = new ROSLIB.ServiceRequest({goal : 'getWorkOrders'});
// 	dashboardClient.callService(request, function(result) 
// 	{
// 		var arr = JSON.parse(result.result);			
// 		for (var i = 0, len = arr.length; i < len; ++i) 
// 		{
// 			var option = document.createElement("option");
// 			option.text = arr[i];
// 			selectWorkorder.add(option); 
// 		}
// 		var option = document.createElement("option");
// 		option.text = 'NEW';
// 		selectWorkorder.add(option); 
// 	});
	
// 	var selectJob = document.getElementById("job");
// 	var request = new ROSLIB.ServiceRequest({goal : 'getJobTypes'});
// 	dashboardClient.callService(request, function(result) 
// 	{
// 		var arr = JSON.parse(result.result);			
// 		for (var i = 0, len = arr.length; i < len; ++i) 
// 		{
// 			var option = document.createElement("option");
// 			option.text = arr[i];
// 			selectJob.add(option); 
// 		}
// 	});
// }


//-------------------------------
// Listening to core log Messages
//-------------------------------

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
	// var obj = JSON.parse(m.data);
	// switch(obj.type) {
	// 	case "normal":
	// 		elem.style = "color: #00FF00";
	// 	break;
	// 	case "warning":
	// 		elem.style = "color: #FF8C00";
	// 	break;
	// 	case "error":	
	// 		elem.style = "color: #FF0000";
	// 	break;
	// 	case "request":	
	// 		elem.style = "color: dodgerblue";
	// 	break;
	// } 
	elem1.innerHTML = m.data;
});

log_listener2.subscribe(function(m) 
{
	var elem2 = document.getElementById("log2")
	// var obj = JSON.parse(m.data);
	// switch(obj.type) {
	// 	case "normal":
	// 		elem.style = "color: #00FF00";
	// 	break;
	// 	case "warning":
	// 		elem.style = "color: #FF8C00";
	// 	break;
	// 	case "error":	
	// 		elem.style = "color: #FF0000";
	// 	break;
	// 	case "request":	
	// 		elem.style = "color: dodgerblue";
	// 	break;
	// } 
	elem2.innerHTML = m.data;
});

log_listener3.subscribe(function(m) 
{
	var elem3 = document.getElementById("log3")
	// var obj = JSON.parse(m.data);
	// switch(obj.type) {
	// 	case "normal":
	// 		elem.style = "color: #00FF00";
	// 	break;
	// 	case "warning":
	// 		elem.style = "color: #FF8C00";
	// 	break;
	// 	case "error":	
	// 		elem.style = "color: #FF0000";
	// 	break;
	// 	case "request":	
	// 		elem.style = "color: dodgerblue";
	// 	break;
	// } 
	elem3.innerHTML = m.data;
});

log_listener4.subscribe(function(m) 
{
	var elem4 = document.getElementById("log4")
	// var obj = JSON.parse(m.data);
	// switch(obj.type) {
	// 	case "normal":
	// 		elem.style = "color: #00FF00";
	// 	break;
	// 	case "warning":
	// 		elem.style = "color: #FF8C00";
	// 	break;
	// 	case "error":	
	// 		elem.style = "color: #FF0000";
	// 	break;
	// 	case "request":	
	// 		elem.style = "color: dodgerblue";
	// 	break;
	// } 
	elem4.innerHTML = m.data;
});
//---------------
// Visualisation
//---------------

// function makeArr(startValue, stopValue, cardinality) 
// {
// 	var arr = [];
// 	var step = (stopValue - startValue) / (cardinality - 1);
// 	for (var i = 0; i < cardinality; i++) 
// 	{
// 		arr.push(startValue + (step * i));
// 	}
// 	return arr;
// }

// function remap(x, y)
// {
// 	return {'xp': (cx - s*y).toFixed(2), 'yp': (cy - s *x).toFixed(2)};
// }
// function remap0(x, y)
// {
// 	return {'xp': (s * y).toFixed(2), 'yp': (s * x).toFixed(2)};
// }

// var base_listener = new ROSLIB.Topic({
// 	ros : ros,
// 	name : '/core/base',
// 	messageType : 'geometry_msgs/Twist'
// });

// base_listener.subscribe(function(m) 
// {
// 	var elem = document.getElementById('astrid')
// 	var w = elem.getAttribute('width');
// 	var h = elem.getAttribute('height');
// 	var x = m.linear.x;
// 	var y = m.linear.y;
// 	var z = m.angular.z;
// 	as_curr[2] = -z;
// 	ret = remap(x, y);
// 	tx = w/2;
// 	ty = h/2;
// 	as_curr[0] = ret['xp']-tx;
// 	as_curr[1] = ret['yp']-ty;
// 	var msg = "translate(" + (ret['xp']-tx) + "," + (ret['yp']-ty) + ") rotate("+ -z + " " + tx + " " + ty + ")";
	
// 	elem.setAttributeNS(null, 'transform', msg);
// });


// var covariance_listener = new ROSLIB.Topic({
// 	ros : ros,
// 	name : '/core/covariance',
// 	messageType : 'geometry_msgs/Twist'
// });

// covariance_listener.subscribe(function(m) 
// {
// 	var elem = document.getElementById('covariance')
// 	var x = m.linear.x;
// 	var y = m.linear.y;
// 	ret = remap0(x, y);
// 	var astrid_elem = document.getElementById('astrid')
// 	var w = elem.getAttribute('width');
// 	var h = elem.getAttribute('height');
// 	tx =w/2;
// 	ty = h/2;
	
// 	var msg = "translate(" + (as_curr[0]) + "," + (as_curr[1]) + ") rotate("+ (as_curr[2]) + " " + tx + " " + ty + ")";

// 	elem.setAttributeNS(null,'rx', ret['xp']);
// 	elem.setAttributeNS(null,'ry', ret['yp']);
	
// 	elem.setAttributeNS(null, 'transform', msg);
// });


// function draw()
// {
// 	var xmlns = "http://www.w3.org/2000/svg";
// 	var svgContainer = document.getElementById('svgContainer');
        

//         // Covariance Ellipse

//         elps = document.createElementNS(xmlns,'ellipse');
// 	ret = remap0(as_0[0], as_0[1]);
// 	s_cov = remap0(cov_0[0],cov_0[1]);
//         elps.setAttributeNS(null, 'id', 'covariance');
//         elps.setAttributeNS(null, 'cx', ret['xp']);
//         elps.setAttributeNS(null, 'cy', ret['yp']);
//         elps.setAttributeNS(null, 'rx', s_cov['xp']);
//         elps.setAttributeNS(null, 'ry', s_cov['yp']);
// 	elps.setAttributeNS(null, 'fill', 'url(#covGrad)');
// 	svgContainer.appendChild(elps);

// 	// Spar  
	
// 	var pts = "";
	
// 	ret = remap(hl_1[0], hl_1[1]);
// 	pts += ret['xp'] + ',' + ret['yp'] + ' '
	
// 	ret = remap(hl_2[0], hl_2[1]);
// 	pts += ret['xp'] + ',' + ret['yp'] + ' '
	
// 	ret = remap(hl_2[0], -hl_2[1]);
// 	pts += ret['xp'] + ',' + ret['yp'] + ' '
	
// 	ret = remap(hl_1[0], -hl_1[1]);
// 	pts += ret['xp'] + ',' + ret['yp']
	
// 	poly = document.createElementNS(xmlns, 'polygon');
// 	poly.setAttributeNS(null, 'points', pts);
// 	poly.setAttributeNS(null, 'fill', 'url(#fixtureGrad)');

// 	svgContainer.appendChild(poly);
	
// 	// Astrid
	
// 	ret = remap0(as_0[0], as_0[1]);
	
// 	rect = document.createElementNS(xmlns, 'rect');
// 	rect.setAttributeNS(null, 'id', 'astrid');
// 	rect.setAttributeNS(null, 'fill', 'url(#astridGrad)');
// 	rect.setAttributeNS(null, 'width', 2*ret['xp']);
// 	rect.setAttributeNS(null, 'height', 2*ret['yp']);
// 	rect.setAttributeNS(null, 'rx', 1);
// 	svgContainer.appendChild(rect);
// }

// //---------------------
// // After Document Load
// //---------------------
// // getBoundAddress();
// // loadWorkOrders();
// draw();

// //add event listener for password box
// document.getElementById("passwordBox").addEventListener("keyup",function(event){
// 	if (event.key=="Enter")
// 	{
// 		calibrationRequest();
// 	}
// })



// let ele = document.getElementById('svgContainer');

