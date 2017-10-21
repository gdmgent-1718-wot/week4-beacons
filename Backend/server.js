const express = require('express'); // import express
const app = express(); 
const MongoClient = require('mongodb').MongoClient // import mongodb
const PubNub = require('pubnub'); // import mongodb
var db; 
path = __dirname + '/views/';
var pubnubmessage = {'message': 'My message'};

// Setup the database
MongoClient.connect('mongodb://localhost:27017/beackon', (err, database) => {
    if (err) return console.log(err);
    db = database;
    // Create a server where browsers can connect to. 
    app.listen(3000, function(){ 
        console.log('listening on localhost:3000');
    });
})

// Get request
app.get('/', (req, res) => {
    db.collection('beaconworld').find().toArray(function(err, results) {
        console.log(results);
        res.sendFile(path + 'index.html'); // Show the index.html page listed in the views folder. 
    });
   
})
app.get('/data', (req, res) => {
    publish();
});

function publish (){
    var message;
    pubnub = new PubNub({
        publishKey : 'pub-c-e8c3fb0e-1f41-4b92-a3e5-30cb96805ed7',
        subscribeKey : 'sub-c-e9f3f922-b32d-11e7-a852-92b7c98bd364'
    })
       
    function publishSampleMessage() {
        var publishConfig = {
            channel : "beaconworld",
            message : "My winning power"
        }
        pubnub.publish(publishConfig, function(status, response) {
            console.log(status, response);
        })
    }
       
    pubnub.addListener({
        status: function(statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                publishSampleMessage();
            }
        },
        message: function(message) {
            db.collection(message['channel']).save(message, (err, result) => {
                if (err) return console.log(err);
                console.log(message);
                console.log('Saved to database');
            })
        },
        presence: function(presenceEvent) {
        }
    })      
    console.log("Subscribing...");
    pubnub.subscribe({
        channels: ['beaconworld'] 
    });
}
