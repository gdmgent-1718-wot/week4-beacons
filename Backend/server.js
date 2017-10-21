const express = require('express'); // import express
const app = express(); 
const MongoClient = require('mongodb').MongoClient // import mongodb
var db; 
path = __dirname + '/views/';


// Get request
app.get('/', (req, res) => {
    res.sendFile(path + 'index.html'); // Show the index.html page listed in the views folder. 
})
app.post('/data', (req, res) => {
    // Establish pubnub connection. 
});
// Setup the database
MongoClient.connect('myDatabase', (err, database) => {
    if (err) return console.log(err);
    db = database;
    // Create a server where browsers can connect to. 
    app.listen(3000, function(){ 
        console.log('listening on localhost:3000');
    });
})

