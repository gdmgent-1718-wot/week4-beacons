const express = require('express'); // import express
const app = express(); 
const MongoClient = require('mongodb').MongoClient // import mongodb
const PubNub = require('pubnub'); // import mongodb
const pubnub = new PubNub({
    publishKey : 'pub-c-e8c3fb0e-1f41-4b92-a3e5-30cb96805ed7',
    subscribeKey : 'sub-c-e9f3f922-b32d-11e7-a852-92b7c98bd364'
});
var db; var db_name = 'promotions';

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

app.get('/promotions/:channel', (req, res) => {
    var channel = req.params.channel;
    var message = [];
    db.collection(channel).find({}).toArray((err, result) => {
        if (err) console.log(err);
        console.log(result); 
        message = result;
        publish(channel, message);
    });
});

app.get('/populate_the_database', (req, res) => {
    /**
     * Promotion structure:
     * 
        {
            "brand": "string",
            "precentage": "integer",
            "product": "string", 
            "ends": "date"
        }
     */
    var shoes = [{
            "brand": "Nike",
            "precentage": "10",
            "product": "Sneakers revolution 3", 
            "ends": "20.11.2017"
        }, {
            "brand": "Mustang",
            "precentage": "30",
            "product": "Cotton sneakers", 
            "ends": "10.11.2017"
        }, 
    ];
    shoes.forEach(function(shoe) {
        db.collection('shoes').save(shoe, (err, result)=> {
            if(err) return console.log(err);
             console.log('Saved shoes to database');
         });
    }, this);

});

app.get('/delete/:collection', (req, res) => {
    var collection = req.params.collection;
    db.collection(collection).drop(function(err, delOK) {
        if (err) throw err;
        if (delOK) console.log("Deleted: " + collection);
      });
})
function publish(chl, promotions){

    var publishConfig = {
        channel : chl,
        message : promotions // ALL FOUND PROMOTIONS FOR ONE CHANNEL
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
        // RETURN THE RESÙTLS TO THE CHANNEL AKA SEND TO IONIC APP
        message: function(message) {
            console.log("MESSAGE", message["message"]);
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
