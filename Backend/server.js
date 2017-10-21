const express = require('express'); // import express
const app = express(); 
const MongoClient = require('mongodb').MongoClient // import mongodb
const PubNub = require('pubnub'); // import mongodb
const pubnub = new PubNub({
    publishKey : 'pub-c-e8c3fb0e-1f41-4b92-a3e5-30cb96805ed7',
    subscribeKey : 'sub-c-e9f3f922-b32d-11e7-a852-92b7c98bd364'
});
var db; var db_name = 'promotions';
path = __dirname + '/views/';
// Setup the database
MongoClient.connect('mongodb://localhost:27017/' + db_name, (err, database) => {
    if (err) return console.log(err);
    db = database;
    console.log(db['s']['databaseName']);
    // Create a server where browsers can connect to. 
    app.listen(3000, function(){ 
        console.log('listening on localhost:3000');
    });
})

// Get request
app.get('/', (req, res) => {
    var collections = ['shoes', 'toys', 'cosmetics', 'undies'];
    db.collection('shoes').find().toArray(function(err, results) {
        console.log(results);
        res.sendFile(path + 'index.html'); // Show the index.html page listed in the views folder. 
    });
   
})
app.get('/:channel', (req, res) => {
    publish(req.params.channel);
});

app.get('/populate_the_database', (req, res) => {
    var collections = ['shoes', 'toys', 'cosmetics', 'undies'];
    var promotions = {'nike': "-30%"};
    collections.forEach(function(item) {
        db.collection(item).save(promotions, (err, result)=> {
            if(err) return console.log(err);
      
            console.log('Saved '+ item + ' to database');
        });
    }, this);
});

function publish(chl){
    console.log("publish");

    var publishConfig = {
        channel : chl,
        message : "My winning power"
    }
    pubnub.addListener({
        status: function(statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                console.log("status");
                pubnub.publish(publishConfig, function(status, response) {
                    console.log(status, response);
                })
            }
        },
        message: function(message) {
            db.collection(chl).find().toArray(function(err, results) {
                console.log(results);
            });
        },
        presence: function(presenceEvent) {
            console.log("PRESENCE", presenceEvent);
        }
    })
    
    subscibe(chl);
}

function subscibe(chl){
    console.log("Subscribing...");
    pubnub.subscribe({
        channels: [chl] 
    });
}
