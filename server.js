var express = require("express");
var config = require("./config/connectionString");
var controller = require("./controller/indexController");
var managerCtrler = require("./controller/managerController");
var bodyParser = require("body-parser");
var session = require('express-session');
var cookieParser = require('cookie-parser')
var port = process.env.PORT || 3000;
var Cookies = require('cookies')
var keys = ['keyboard cat']
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
app.use(cookieParser())
app.set('trust proxy', 1)
app.use(session({  
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true ,
        maxAge: 600000}
  }))

app.get("/",function(req,res){
   res.render('index2');
})

app.get("/passenger", function(req,res){

    console.log(req.headers.cookie);
    
    controller.passenger(req,res);
})

app.get("/searchSchedule",function(req,res){
    controller.search(req,res);
})

app.get("/getAllStation",function(req,res){
    controller.index(req,res);
})

app.get("/getAllSeatType",function(req,res){
    controller.getAllSeatType(req,res);
})

app.get("/getFirstCost", function(req,res){
    controller.getFirstCost(req,res);
});

app.get("/getAllTrain",function(req,res){
    controller.train(req,res);
})

app.get("/scheduleDetail",function(req,res){
    controller.scheduleDetail(req,res);
})

app.get("/getListCarriage", function(req,res){
    controller.getAllCarriage(req,res);
})

app.get("/getListSeat", function(req,res){
    controller.getAllSeat(req,res);
})

app.get("/getAllTypeObject", function(req,res){
    controller.getAllTypeObject(req,res);
})

app.get("/getListSeatSold", function(req,res){
    controller.getListSeatSold(req,res);
})

app.post("/createInfomation", function(req,res){
    console.log("Type of: " + typeof(req.headers.cookie))
    if(typeof(req.headers.cookie == "undefined")) {
        console.log(req.headers.cookie);
        console.log("req.session.id: " +  req.session.id);
        res.cookie('session_id', req.session.id)
    } 
    controller.createSession(req,res);
})

app.get('/payment', function(req,res){
    controller.payment(req,res);
})

app.get('/getSeatTypeBySeatID', function(req,res){
    controller.getSeatTypeBySeatID(req,res);
})

app.get('/paymentSuccess',function(req,res){
    console.log(req);
})

app.get('/RedirectToNganLuong', function(req,res){
    controller.RedirectToNganLuong(req,res);
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