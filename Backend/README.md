## Server  
#### Software 
Voor de server gebruiken we Nodejs, Express en MongoDB. 
Express is een framework waarmee je webapplicaties kan maken bovenop nodejs. Het vergemakkelijkt het process om een server te doen draaien. 

Mongodb is een database die data opslaat als flexibele json documenten. Dit wil zeggen dat het een zeer
flexiebel systeem is. 

#### Automatisatie
Als je niet steeds na elke aanpassing je server wil herstarten dan kan je best gebruik maken van nodemon
```
npm install nodemon --save-dev
```
Vervolgens voeg onderstaand stukje code toe aan de package.json. Dit gaat het commando om de server te starten vereenvoudigen. 
```json
{
  "scripts": {
    "dev": "nodemon server.js"
  }
}
```
Start de server met ```npm run dev```

#### Pubnub
Pubnub zorgt voor realtime datatransfer. Dit doet die doormiddel van een subscribe / publish systeem. Installeer pubnub via npm.
```
npm install pubnub
```
Vervolgens moet de library worden geïnporteerd in het project. dit doen we met ```var PubNub = require('pubnub')``` 
Daarnaast moeten we onze keys invullen. Deze gaan ervoor zorgen dat je een specifiek channel kan maken en gebruiken. De key's verkrijg je door je aan te melden op de pubnub site.
```
const pubnub = new PubNub({
    publishKey : 'pub-c-e8c3fb0e-1f41-4b92-a3e5-30cb96805ed7',
    subscribeKey : 'sub-c-e9f3f922-b32d-11e7-a852-92b7c98bd364'
});
```
#### Express
De volgende <a href="https://expressjs.com/en/starter/installing.html">link</a> toont je hoe je express installeerd. Als de installatie is voltooid voeg je de volgende lijnen toe aan je server.js file. 
```
const express = require('express'); 
const app = express(); 
```
#### Mongodb
Volg eerst het installatie proces van de site alvorens een database aan te maken. 
Installeer <a href="https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/"> op mac </a>, <a href="https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/"> op windows </a> en <a href="https://docs.mongodb.com/manual/administration/install-on-linux/"> op linux </a>.

Importeer de mongodb met de volgende regel code ```const MongoClient = require('mongodb').MongoClient```



#### Server
Wanneer we de server draaien gaan we luisteren naar een specifieke poort. 
```
    app.listen(3000, function(){ 
            console.log('listening on http://localhost:3000/');
        });
    });
```
**Database aanmaken:** Om een database aan te maken moeten we connecteren met de mongo client. Als de connectie faalt zal er de error worden gelogd in de console. We willen dat de database connectie actief is wanneer we onze server draaien. 
```
    app.listen(3000, function(){ 
        console.log('listening on http://localhost:3000/');
        MongoClient.connect('mongodb://localhost:27017/' + db_name, (err, database) => {
            if (err) return console.log(err);
            db = database;
        })
    });
```
**Database vullen:** Aan een lege database hebben we niets daarom gaan we hem opvullen. Om het eenvoudig te houden en luisteren we naar een specifieke url. In dit geval /populate_the_database. 
```
app.get('/populate_the_database', (req, res) => {});
```
Vervolgens maken we enkele objectjes om onze database te vullen. Bijvoorbeeld: 
```
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
        }
    ];
```
Nu we onze objectjes hebben willen we ze toevoegen aan de database. Met een kleine foreach loop lopen we doorheen het object. Iets opslaan doen we met het volgende stukje code. 
```
    shoes.forEach(function(shoe) {
        db.collection('shoes').save(shoe, (err, result) => {
            if(err) return console.log(err);
            console.log('Saved shoes to database');
         });
    }, this);
```
Mochten er fouten zijn gemaakt kan je op een heel eenvoudige manier de collecties droppen. 
```
    app.get('/delete/:collection', (req, res) => {
        var collection = req.params.collection;
        db.collection(collection).drop(function(err, delOK) {
            if (err) console.loge(err);
            if (delOK) console.log("Deleted: " + collection);
        });
    });
```
**Pubishing data:** Voor we kunnen subscriben moeten we data ophalen uit onze database. We luisteren naar een url die wordt opgevraagd. In dit geval /promotions/:channel. ":channel" is een variabele.
deze kunnen we ophalen met ```req.params.channel;```. We halen de data op met de volgende lijn code. 
```
    db.collection(channel).find({}).toArray((err, result) => {
            if (err) console.log(err);
            message = result;
    });
```

Zodra de data is gevonden willen we naar het gevraagde channel publishen. Pubnub komt standaard met een pubish functie hier kan je vele opties aan mee geven. Wij beperken het tot message en channel. 
```
    pubnub.publish(
        {
            message: {
                such: message
            },
            channel: channel
        }
    );
```