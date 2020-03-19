var express = require("express");
var config = require("./config/connectionString");
var controller = require("./controller/indexController");
var bodyParser = require("body-parser");

// create application/json parser
var jsonParser = bodyParser.json();
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

app.use(express.static('UI'));
app.use(express.static('node_modules'));
app.use(urlencodedParser);
app.use(jsonParser);
app.set('view engine',"ejs");


app.get("/",function(req,res){
   res.render('index2');
})

app.get("/searchSchedule",function(req,res){
    controller.search(req,res);
})

app.get("/getAllStation",function(req,res){
    controller.index(req,res);
})

app.get("/getAllTrain",function(req,res){
    controller.train(req,res);
})

var server = app.listen(3000,function(){
    console.log("Run");
});