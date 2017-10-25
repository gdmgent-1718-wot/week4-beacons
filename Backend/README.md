## Server  
#### Software 
Voor de server gebruiken we Nodejs, Express en MongoDB. 
Express is een framework waarmee je webapplicaties kan maken bovenop nodejs. Het vergemakkelijkt het     opzet process om een server te doen draaien. 

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
Pubnub zorgt voor realtime datatransfer. Dit doet die doormiddel van een subscribe / publish systeem. 