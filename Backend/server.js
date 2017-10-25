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
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// Setup the database
MongoClient.connect('mongodb://localhost:27017/' + db_name, (err, database) => {
    if (err) return console.log(err);
    db = database;
    console.log(db['s']['databaseName']);
    // Create a server where browsers can connect to. 
    app.listen(3000, function(){ 
        console.log('listening on http://localhost:3000/');
    });
})

app.get('/', (req, res) => {
    res.render('index', { title: 'Hey', message: 'Hello there!' });
 });
 
app.get('/promotions/:channel', (req, res) => {
    var channel = req.params.channel;
    var message = [];  
    db.collection(channel).find({}).toArray((err, result) => {
        if (err) console.log(err);
        message = result;
        publish(channel, message);
        res.render("product", { title: 'promo', message: promo, channel: channel });
    }); 
});
app.get('/toy', (req, res) => {
    db.collection("toys").find({}).toArray(function(err, result) {
      if (err) console.log(err);
      console.log(result);
      db.close();
    });
})
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
        "ends": "20.01.2018"
    }, {
        "brand": "Monk",
        "precentage": "30",
        "product": "doll", 
        "ends": "1.11.2017"
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
function publish(chl, promotions){
    
    var publishConfig = {
        channel : chl,
        message : promotions // ALL FOUND PROMOTIONS FOR ONE CHANNEL
    }
    pubnub.addListener({
        status: function(statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                pubnub.publish(publishConfig, function(status, response) {
                    console.log(status, response);
                })
            }
        },
        // RETURN THE RESÙTLS TO THE CHANNEL 
        message: function(message) {
            console.log(message['message']);
            promo = message['message'];
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
