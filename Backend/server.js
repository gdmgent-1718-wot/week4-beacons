const express = require('express');
const app = express();
var PubNub = require('pubnub');
var mongo = require('mongodb');
path = __dirname + "/views/";
function publish(){
    pubnub = new PubNub({
        publishKey : 'pub-c-e8c3fb0e-1f41-4b92-a3e5-30cb96805ed7',
        subscribeKey : 'sub-c-e9f3f922-b32d-11e7-a852-92b7c98bd364'
    })
       

    function publishSampleMessage() {
        console.log("Since we're publishing on subscribe connectEvent, we're sure we'll receive the following publish.");
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
        
   
            console.log("New bericht", message['message']);
        },
        presence: function(presenceEvent) {
            // handle presence
        }
    })   
    console.log("Subscribing..");
    pubnub.subscribe({
        channels: ['beaconworld'] 
    });   
}

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/myStore";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var newArrivals = [{ brand: "nike", color: "red", size: "s, m"}, { brand: "nike", color: "blue", size: "s, m"}]
    db.createCollection("tshirts", function(err, res){
        if (err) throw err;
        db.collection("tshirts").insertMany(newArrivals, function(err, res){
            if (err) throw err;
            db.close();
        });
    });
    db.collection("tshirts").find({}).toArray(function(err, result){
        if(err)throw err;
        console.log(result);
        db.close();
    })
  });
  
app.get('/', function (req, res){
    res.sendFile(path + "index.html");
})

app.listen(3000, function(){
	console.log('listening on 3000');
})