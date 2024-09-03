// Toggle Dark Mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

// Simulate a service call
function serviceCall(action) {
    const statusDisplay = document.getElementById('statusDisplay');
    switch(action) {
        case 'start':
            statusDisplay.textContent = 'System Started';
            break;
        case 'home':
            statusDisplay.textContent = 'Returning Home';
            break;
        case 'resume':
            statusDisplay.textContent = 'Resumed Operation';
            break;
        case 'pause':
            statusDisplay.textContent = 'System Paused';
            break;
        default:
            statusDisplay.textContent = 'Ready';
    }
}

// Export Data
function exportData() {
    alert('Data exported successfully!');
}

// Share Results
function shareResults() {
    alert('Results shared successfully!');
}

// Submit Feedback
function submitFeedback() {
    const feedback = document.getElementById('feedbackText').value;
    alert('Feedback submitted: ' + feedback);
}



// Function to populate the dropdown with ROS topics
function populateDropdown() {
    ros.getTopics(function(topics) {
        var dropdown = document.getElementById('ros-topic-dropdown');
        topics.topics.forEach(function(topic) {
            var option = document.createElement('option');
            option.value = topic;
            option.textContent = topic;
            dropdown.appendChild(option);
        });

        // Add an event listener to the dropdown to fetch the message type when a topic is selected
        dropdown.addEventListener('change', function() {
            var selectedTopic = dropdown.value;
            if (selectedTopic) {
                getMessageType(selectedTopic);
            } else {
                document.getElementById('message-type').textContent = '';
            }
        });
    });
}

// Function to get and display the message type of a selected ROS topic
function getMessageType(topicName) {
    // Use ROSLIB.Service to call the rosapi service to get the topic type
    var topicTypeClient = new ROSLIB.Service({
        ros: ros,
        name: '/rosapi/topic_type',
        serviceType: 'rosapi/TopicType'
    });

    var request = new ROSLIB.ServiceRequest({
        topic: topicName
    });

    topicTypeClient.callService(request, function(result) {
        var messageTypeDisplay = document.getElementById('message-type');
        messageTypeDisplay.textContent = 'Message Type: ' + result.type;
    }, function(error) {
        console.log('Error retrieving topic type: ', error);
    });
}

// Function to subscribe to the topic and retrieve message data
function subscribeToTopic(topicName, messageType) {
    var topic = new ROSLIB.Topic({
        ros: ros,
        name: topicName,
        messageType: messageType
    });

    topic.subscribe(function(message) {
        // Extract numeric data from the message (this depends on the message structure)
        var numericData = extractNumericData(message);

        // Display the numeric data
        var numericDisplay = document.getElementById('numeric-display');
        numericDisplay.textContent = 'Numeric Data: ' + numericData;

        // Update the chart with the new data
        updateChart(numericData);
    });
}

// Example function to extract numeric data from a message

function extractNumericData(message) {
    // For std_msgs/Float32, simply return the 'data' field
    return message.data;
}


// Function to update the chart with new data
// function updateChart(newData) {
//     myChart.data.datasets[0].data.push(newData);
//     myChart.update();
// }

// Initialize the chart (using Chart.js)
// var ctx = document.getElementById('myChart').getContext('2d');
// var myChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//         labels: [],  // X-axis labels (will be updated dynamically)
//         datasets: [{
//             label: 'Numeric Data',
//             data: [],  // This will be updated dynamically
//             borderColor: 'rgba(75, 192, 192, 1)',
//             borderWidth: 2,
//             fill: false
//         }]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         }
//     }
// });
