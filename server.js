var express = require("express");
var config = require("./config/connectionString");
var controller = require("./controller/indexController");
var managerCtrler = require("./controller/managerController");
var loginController = require("./controller/loginController");
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
app.use(express.static('./node_modules'));
app.use(express.static('UI'));
app.use(urlencodedParser);
app.use(jsonParser);
app.set('view engine', "ejs");
app.locals.moment = require('moment');
app.use(cookieParser())
app.set('trust proxy', 1)
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        maxAge: 600000
    }
}))

app.get("/", function (req, res) {
    res.render('index2');
})

app.get("/passenger", function (req, res) {

    console.log(req.headers.cookie);

    controller.passenger(req, res);
})

app.get("/searchSchedule", function (req, res) {
    controller.search(req, res);
})

app.get("/getAllStation", function (req, res) {
    controller.index(req, res);
})

app.get("/getAllSeatType", function (req, res) {
    controller.getAllSeatType(req, res);
})

app.get("/getFirstCost", function (req, res) {
    controller.getFirstCost(req, res);
});

app.get("/getAllTrain", function (req, res) {
    controller.train(req, res);
})

app.get("/scheduleDetail", function (req, res) {
    controller.scheduleDetail(req, res);
})

app.get("/getListCarriage", function (req, res) {
    controller.getAllCarriage(req, res);
})

app.get("/getListSeat", function (req, res) {
    controller.getAllSeat(req, res);
})

app.get("/getAllTypeObject", function (req, res) {
    controller.getAllTypeObject(req, res);
})

app.get("/getListSeatSold", function (req, res) {
    controller.getListSeatSold(req, res);
})

app.post("/createInfomation", function (req, res) {
    console.log("Type of: " + typeof (req.headers.cookie))
    if (typeof (req.headers.cookie == "undefined")) {
        console.log(req.headers.cookie);
        console.log("req.session.id: " + req.session.id);
        res.cookie('session_id', req.session.id)
    }
    controller.createSession(req, res);
})

app.get('/CheckLogin', function (req, res) {
    loginController.CheckLogin(req, res);
})
app.get('/login', function (req, res) {
    loginController.Login(req, res);
})
app.get('/payment', function (req, res) {
    controller.payment(req, res);
})

app.get('/manageBooking', function (req, res) {
    res.render('managebooking');
})
app.get('/getSeatTypeBySeatID', function (req, res) {
    controller.getSeatTypeBySeatID(req, res);
})

app.get('/paymentSuccess', function (req, res) {
    //console.log(req);
    controller.InsertData(req, res);
})

app.get('/RedirectToNganLuong', function (req, res) {
    controller.RedirectToNganLuong(req, res);
})

//get List
app.get("/getAllCus", function (req, res) {
    managerCtrler.getAllCustomer(req, res);
})
app.get("/getAllSta", function (req, res) {
    managerCtrler.getAllStation(req, res);
})
app.get("/getAllTrain", function (req, res) {
    managerCtrler.getAllTrain(req, res);
})
app.get("/getAllSeat", function (req, res) {
    managerCtrler.getAllSeat(req, res);
})
app.get("/getAllTypeOfSeat", function (req, res) {
    managerCtrler.getAllTypeOfSeat(req, res)
})
app.get("/getAllCarriage", function (req, res) {
    managerCtrler.getAllCarriage(req, res);
})

//render
app.get("/admin/dashboard", function (req, res) {
    res.render('admin');
})
app.get("/admin/customer", function (req, res) {
    res.render('customerAdmin');
})
app.get("/admin/station", function (req, res) {
    res.render('stationAdmin');
})
app.get("/admin/train", function (req, res) {
    res.render('trainAdmin');
})
app.get("/admin/seat", function (req, res) {
    res.render('seatAdmin');
})
app.get("/admin/seattype", function (req, res) {
    res.render('seatTypeAdmin');
})
app.get("/admin/carriage", function (req, res) {
    res.render('carriageadmin')
})
app.get("/admin/schedule", function (req, res) {
    res.render('scheduleadmin')
})

//action customer
app.delete("/admin/customer", function (req, res) {
    managerCtrler.delCustomerByID(req, res)
});
app.post("/admin/customer", function (req, res) {
    managerCtrler.createCustomer(req, res);
})

//action train
app.get("/getTrain", function (req, res) {
    managerCtrler.getTrainByID(req, res);
})
app.post("/admin/train", function (req, res) {
    managerCtrler.createTrain(req, res);
})
app.delete("/admin/train", function (req, res) {
    managerCtrler.delTrain(req, res)
});
app.put("/admin/train", function (req, res) {
    managerCtrler.updateTrain(req, res);
})

//action carriage
app.post("/admin/carriage", function (req, res) {
    managerCtrler.createCarriage(req, res);
})
app.delete("/admin/carriage", function (req, res) {
    managerCtrler.delCarriage(req, res);
})

//test print
app.get("/testprint", function (req, res) {
    res.render('ticketadmin');
})
app.get("/test", function (req, res) {
    managerCtrler.printTicketByRepresentativeId(req, res);
})

app.post("/admin/schedule", function (req, res) {
    managerCtrler.createSchedule(req, res);
})


var server = app.listen(port, function () {
    console.log("Run on port " + port);
});