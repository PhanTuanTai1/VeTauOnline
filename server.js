var express = require("express");
var config = require("./config/connectionString");
var controller = require("./controller/indexController");
var bodyParser = require("body-parser");
var port = process.env.PORT || 3000;
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
app.locals.moment = require('moment');


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

app.get("/scheduleDetail",function(req,res){
    controller.scheduleDetail(req,res);
})
app.get("/admin",function(req,res){
    res.render('admin');
})

var server = app.listen(port,function(){
    console.log("Run on port " + port);
});