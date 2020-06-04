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

// app.get('/CheckLogin' , function(req,res){
//     loginController.CheckLogin(req,res);
// })
app.get('/login', function (req, res) {
    res.render("login");
})

app.post('/verifyLogin', function (req, res) {
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
app.get("/getAllSchedule", function (req, res) {
    managerCtrler.getAllSchedule(req, res)
})

//render
app.get("/admin/dashboard", function (req, res) {
    // loginController.CheckLogin().then(check => {
    //     if (check) {
    //         loginController.GetUserFromSession(req, res);
    res.render('admin');
    //     }
    //     else {
    //         res.render('login');
    //     }
    // })
})
app.get("/admin/customer", function (req, res) {
    loginController.CheckLogin().then(check => {
        if (check) {
            res.render('customeradmin');
        }
        else {
            res.render('login');
        }
    })
})
app.get("/admin/station", function (req, res) {
    loginController.CheckLogin().then(check => {
        if (check) {
            res.render('stationadmin');
        }
        else {
            res.render('login');
        }
    })
})
app.get("/admin/train", function (req, res) {
    loginController.CheckLogin().then(check => {
        if (check) {
            res.render('trainadmin');
        }
        else {
            res.render('login');
        }
    })
})
app.get("/admin/seat", function (req, res) {
    loginController.CheckLogin().then(check => {
        if (check) {
            res.render('seatadmin');
        }
        else {
            res.render('login');
        }
    })
})
app.get("/admin/seattype", function (req, res) {
    loginController.CheckLogin().then(check => {
        if (check) {
            res.render('seattypeadmin');
        }
        else {
            res.render('login');
        }
    })
})
app.get("/admin/carriage", function (req, res) {
    loginController.CheckLogin().then(check => {
        if (check) {
            res.render('carriageadmin');
        }
        else {
            res.render('login');
        }
    })
})
app.get("/admin/schedule", function (req, res) {
    // loginController.CheckLogin().then(check => {
    //     if (check) {
    res.render('scheduleadmin');
    //     }
    //     else {
    //         res.render('login');
    //     }
    // })
})

//action customer
app.delete("/admin/customer", function (req, res) {
    managerCtrler.delCustomerByID(req, res)
});
app.post("/admin/customer", function (req, res) {
    managerCtrler.createCustomer(req, res);
})
app.put("/admin/customer", function (req, res) {
    managerCtrler.updateCustomer(req, res)
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
app.put("/admin/carriage", function (req, res) {
    managerCtrler.editCarriage(req, res);
})

//test print
app.get("/admin/ticket", function (req, res) {
    // loginController.CheckLogin().then(check => {
    //     if (check) {
    res.render('ticketadmin');
    //     }
    //     else {
    //         res.render('login');
    //     }
    // })
})
app.get("/printTicket", function (req, res) {
    managerCtrler.printTicketByRepresentativeId(req, res);
})
app.get("/getAllRepre", function (req, res) {
    managerCtrler.getAllRepreBByID(req, res)
})
app.put("/admin/ticket", function (req, res) {
    managerCtrler.editStatusTicket(req, res);
})


app.post("/admin/schedule", function (req, res) {
    managerCtrler.createSchedule(req, res);
})
app.get("/getAllScheduleDetail", function (req, res) {
    managerCtrler.getAllScheduleDetail(req, res)
})
app.get("/getListDetail", function (req, res) {
    managerCtrler.getListDetail(req, res);
})

app.post("/admin/scheduledetail", function (req, res) {
    managerCtrler.createScheduleDetail(req, res)
})

app.post("/admin/cost", function (req, res) {
    managerCtrler.createTableCost(req, res)
})
app.delete("/admin/schedule", function (req, res) {
    managerCtrler.delSchedule(req, res)
})


var server = app.listen(port, function () {
    console.log("Run on port " + port);
});



//TEST CHAT 
app.get("/chat", function (req, res) {
    res.render('chat');
})
var io = require('socket.io')(server);
var numUsers = 0;
io.on('connection', (socket) => {
    var addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on('new message', (data) => {
        // we tell the client to execute 'new message'
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', (username) => {
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', () => {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
        if (addedUser) {
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
});