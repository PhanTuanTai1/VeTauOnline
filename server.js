var express = require("express");
var config = require("./config/connectionString");
var controller = require("./controller/indexController");
var managerCtrler = require("./controller/managerController");
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
//get List
app.get("/getAllCus",function(req,res){
    managerCtrler.getAllCustomer(req,res);
})
app.get("/getAllSta",function(req,res){
    managerCtrler.getAllStation(req,res);
})
app.get("/getAllTrain",function(req,res){
    managerCtrler.getAllTrain(req,res);
})


//render
app.get("/admin",function(req,res){
    res.render('admin');
})
app.get("/CustomerManager",function(req,res){
    res.render('customerAdmin');
})
app.get("/StationManager",function(req,res){
    res.render('stationAdmin')
})
app.get("/TrainManager",function(req,res){
    res.render('trainAdmin')
})

//action customer
app.delete("/CustomerManager", function(req,res){
    managerCtrler.delCustomerByID(req,res)
});
app.post("/CustomerManager",function(req,res){
    managerCtrler.createCustomer(req,res);
})

//action train
app.get("/getTrain",function(req,res){
    managerCtrler.getTrainByID(req,res);
})
app.post("/TrainManager",function(req,res){
    managerCtrler.createTrain(req,res);
})
app.delete("/TrainManager", function(req,res){
    managerCtrler.delTrain(req,res)
});
app.put("/TrainManager",function(req,res){
    managerCtrler.updateTrain(req,res);
})


var server = app.listen(port,function(){
    console.log("Run on port " + port);
});