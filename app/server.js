var express = require('express');
var path = require('path');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;

var app = express();

app.use(express.json());

const client = new MongoClient('mongodb://admin:password@localhost:27017');
const dbName = 'user-account';

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/get-profile', function (req, res) {
 
  var response = res;
  MongoClient.connect('mongodb://admin:password@mongodb', function (err, client) {
 
    if (err) throw err;

    var db = client.db(dbName);
    var query = { userid: 1 };

    db.collection('users').findOne(query, function (err, result) {
      console.log(err, '22');
      if (err) throw err;
      console.log(result, "result");
      client.close();
      response.send(result);
    });
  });
});

app.post('/update-profile', function (req, res) {
  var userObj = req.body;
 
  var response = res;

  console.log('connecting the db....');

  MongoClient.connect('mongodb://admin:password@mongodb', function (err, client) {
    if (err) throw err;
    
    var db = client.db(dbName);
    userObj['userid'] = 1;
    
    var query = {userid: 1};
    var newValue = {$set: userObj};
    
    console.log("successfully connnect to the user-account db");
    
    db.collection('users').updateOne(query, newValue, {upsert: true}, function(err, res){
      if (err) throw err;

      console.log('successfully update one');
      client.close();

      response.send(userObj);

    })
  });

});

app.listen(3000, () => {
  console.log('listening 3000');
});
