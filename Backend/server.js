const express = require('express'); // import express
const app = express(); 
const MongoClient = require('mongodb').MongoClient // import mongodb
const PubNub = require('pubnub'); // import mongodb
const pubnub = new PubNub({
    publishKey : 'pub-c-e8c3fb0e-1f41-4b92-a3e5-30cb96805ed7',
    subscribeKey : 'sub-c-e9f3f922-b32d-11e7-a852-92b7c98bd364'
});
var db; var db_name = 'promotions';
var promo = []; 

var  channels = ['toys', 'shoes']; 
// Create a server where browsers can connect to. 
app.listen(3000, function(){ 
    // Setup the database
    MongoClient.connect('mongodb://localhost:27013/' + db_name, (err, database) => {
        if (err) return console.log(err);
        db = database;
    })
    console.log('listening on http://localhost:3000/');
   
    pubnub.addListener({
        message: function(m) {
            var channelName = m.channel; // The channel for which the message belongs
            console.log(channelName, m.message);
            channels.forEach(c => {
                if(c == channelName){
                    test(channelName);
                }
            });     
        }
    });
    pubnub.subscribe({
        channels: channels,
    });
});

function test (channel){
    console.log(channel);
    db.collection(channel).find({}).toArray((err, result) => {
        if (err) console.log(err);
        message = result;
        pubnub.publish(
            {
                message: {
                    message: message,
                },
                channel: channel,
                storeInHistory: true, 
            }
        ); 
        pubnub.unsubscribe({
            channels: [channel]
        })
        console.log(message, channel);
    });
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/promotions/:channel', (req, res) => {
    var channel = req.params.channel;
    pubnub.publish(
        {
            message: {
                message: ('test'),
            },
            channel: channel,
        }
    ); 
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
            "precentage": "15",
            "product": "Sneakers revolution 2", 
            "ends": "10.11.2017"
        }, {
            "brand": "Hush puppies",
            "precentage": "30",
            "product": "sneakers", 
            "ends": "10.12.2017"
        }, 
    ];
    shoes.forEach(function(shoe) {
        db.collection('shoes').save(shoe, (err, result)=> {
            if(err) return console.log(err);
             console.log('Saved shoes to database');
         });
    }, this);

    var toys = [{
        "brand": "Jupiler League",
        "precentage": "40",
        "product": "ball", 
        "ends": "20.1.2018"
    }, {
        "brand": "Monk",
        "precentage": "30",
        "product": "doll", 
        "ends": "10.11.2017"
    },
    {
        "brand": "Master ship",
        "precentage": "40",
        "product": "lego", 
        "ends": "12.11.2017"
    }];
    toys.forEach(function(toy) {
        db.collection('toys').save(toy, (err, result)=> {
            if(err) return console.log(err);
            console.log('Saved toys to database');
        });
    }, this);

});

app.get('/delete/:collection', (req, res) => {
    var collection = req.params.collection;
    db.collection(collection).drop(function(err, delOK) {
        if (err) console.loge(err);
        if (delOK) console.log("Deleted: " + collection);
      });
});
