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

app.post("/searchSchedule",function(req,res){
    //console.log(req.body);
    controller.searchSchedule(req,res);
})

app.get("/getAllStation",function(req,res){
    controller.index(req,res);
})

var server = app.listen(3000,function(){
    console.log("Run");
});