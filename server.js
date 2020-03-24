var http = require('http');
var express = require('express');

// Configuration

var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* DB Conections*/
var mongoose = require("mongoose");
mongoose.connect('mongodb://ThiIsAPassword:TheRealPassword@cluster0-shard-00-00-euadh.mongodb.net:27017,cluster0-shard-00-01-euadh.mongodb.net:27017,cluster0-shard-00-02-euadh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');
var db =  mongoose.connection;

/*************************************** */

//Web server functionality

app.get("/",function(req,res){
    console.log("Request on root page");
    res.send("Hola mundo");
});

app.get("/about",function(req,res){
    res.send("Que tranza perro!!");
});



/*************************************** */

//API functionality
var ItemDB; //Model for DB

app.get("/API/Catalog",function(req,res){

    ItemDB.find({},function(error,data){
        if(error){
            console.log("Error reading items");
            res.status(500);
            res.send(error);
        }
        else{
            res.status(200);
            res.json(data); 
            console.log(data);
        }
    })
});

app.get("/API/Catalog/:name",function(req,res){

    var name = req.params.name;

    ItemDB.find({user: name},function(error, data){
        if(error){
            console.log("Error reading items");
            res.status(500);
            res.send(error);
        }
        else{
            res.status(200);
            res.json(data); 
            console.log(data);
        }
    });

    res.send(name);
    console.log(name);
});

app.get('/api/Catalog/priceLowerThan/:price', function(req, res){
    var val = req.params.price;
    ItemDB.find({ price: {$gte: val} }, function(error, data){
        if(error){
            console.log("Error reading items");
            res.status(500);
            res.send(error);
        }

        // no error
        res.status(200);
        res.json(data);
    })
 });




app.post("/API/items", function(req,res){
    console.log("Admin want to save the item");
    var itemForMongo = ItemDB(req.body);

    console.log(itemForMongo);

    itemForMongo.save(function(error, savedItem){
        if(error){
            console.log("Error to save the object",error);
            res.status(500);
            res.send(error);
        }
        else{
            console.log("Item Saved");
            res.status(201); // 201: Created
            res.json(savedItem);
        }

    });

});


/* Start the server and DB check Connection*/

db.on("open",function(){
    console.log("Te la rifas!! se conecto a la DB");

    var itemSchema = mongoose.Schema({
        code: String,
        title: String,
        price: Number,
        description: String,
        category: String,
        image: String,
        user: String
    });

    ItemDB = mongoose.model("itemsEC",itemSchema);
});

db.on("error",function(details){
    console.log("Error en DB!! Algo anda mal!!");
    console.log("Details: " + details);
});

app.listen(8080, function(){
    console.log("Server running at localhost:8080");
});
