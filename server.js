var express = require("express");
var controller = require("./controller/indexController");
var managerCtrler = require("./controller/managerController");
var loginController = require("./controller/loginController");
var bodyParser = require("body-parser");
var session = require('express-session');
var cookieParser = require('cookie-parser')
var port = process.env.PORT || 3000;
//var process = require('process');

var Cookies = require('cookies');
//
var keys = ['keyboard cat']
// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = express();


var http = require('http').createServer(app);
var io = require("socket.io")(http);
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
    var session_id = req.cookies.session_id;
    res.cookie('data', "", { maxAge: 0 });
    res.cookie('data2', "", { maxAge: 0 });
    res.cookie('data3', "", { maxAge: 0 });
    res.cookie('data4', "", { maxAge: 0 });
    res.cookie('data5', "", { maxAge: 0 });
    res.cookie('data6', "", { maxAge: 0 });
    res.cookie('step1', "", { maxAge: 0 });
    if(session_id != "undefined"){
        let data =  listSeatBlock.filter(x => {
            return x.session_id != session_id;
        })
        let data2 = listSeatBlock.filter(x => {
            return x.session_id == session_id;
        })
    
        listSeatBlock = data;
        res.cookie('session_id', req.session.id);
    }

    res.render('index2');
})

app.get("/passenger", function (req, res) {
    //console.log(req.headers.cookie.session_id);
    if (typeof (req.headers.cookie) == "undefined") {
        console.log("SessionID: " + req.session.id);
        
    }

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
    if (typeof(req.headers.cookie) == "undefined") {
        console.log(req.headers.cookie);
        console.log("req.session.id: " + req.session.id);
        res.cookie('session_id', req.session.id)
    }
    controller.createSession(req, res);
})

app.get('/test', function (req, res) {
    res.render('test');
})

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
    res.render('manageBookingForm');
})

app.get('/manageBooking1', function (req, res) {
    res.render('managebooking');
})

app.post('/SearchBooking', function (req, res) {
    controller.ManageBooking(req, res);
})

app.get('/getSeatTypeBySeatID', function (req, res) {
    controller.getSeatTypeBySeatID(req, res);
})

app.get('/paymentSuccess', function (req, res) {
    //console.log(req);
    controller.InsertData(req, res, listSeatBlock);
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

app.get('/listFare',function(req,res){
    res.render('listFare');
})

app.get('/getAllScheduleClient',function(req,res) {
    controller.GetAllSchedule(req,res);
})

app.get('/getAllScheduleDetailClient',function(req,res) {
    controller.GettAllScheduleDetailByID(req,res);
})
//render
app.get("/admin/dashboard", function (req, res) {
    loginController.CheckLogin(req).then(async check => {
        if (check) {
            var staffData = await loginController.GetUser(req);
            if(staffData.Role != 1) {
                res.render('admin', {data: staffData});
            } 
            else {
                res.redirect('/admin/ticket');
            }        
        }
        else {
            res.render('login');
        }
    })
})
app.get("/abc", function (req, res) {
    managerCtrler.getListCusBySchedule(req, res)
})
app.get("/admin/customer", function (req, res) {
    loginController.CheckLogin(req).then(async check => {
        if (check) {
            var staffData = await loginController.GetUser(req);
            if(staffData.Role != 1) {
                res.render('customerAdmin', {data: staffData});
            } 
            else {
                res.redirect('/admin/ticket');
            }
        }
        else {
            res.render('login');
        }
    })
})
app.get("/admin/station", function (req, res) {
    loginController.CheckLogin(req).then(async check => {
        if (check) {
            var staffData = await loginController.GetUser(req);
            if(staffData.Role == 3) {
                res.render('stationAdmin', {data: staffData});
            } 
            else if(staffData.Role == 2){
                res.redirect('/admin/dashboard');
            }
            else {
                res.redirect('/admin/ticket');
            }
        }
        else {
            res.render('login');
        }
    })
})

app.get("/getAllScheNoCond", function (req, res) {
    managerCtrler.getAllScheDetailWithNoCondition(req, res);
})
app.get("/admin/train", function (req, res) {
    loginController.CheckLogin(req).then(check => {
        if (check) {
            loginController.GetUser(req).then(staffData => {
                if(staffData.Role == 3) {
                    res.render('trainAdmin', {data: staffData});
                } 
                else if(staffData.Role == 2){
                    res.redirect('/admin/dashboard');
                }
                else {
                    res.redirect('/admin/ticket');
                }
            });
            
        }
        else {
            res.render('login');
        }
    })
})
app.get("/admin/seat", function (req, res) {
    loginController.CheckLogin(req).then(async check => {
        if (check) {
            var staffData = await loginController.GetUser(req);
            if(staffData.Role == 3) {
                res.render('seatAdmin', {data: staffData});
            } 
            else if(staffData.Role == 2){
                res.redirect('/admin/dashboard');
            }
            else {
                res.redirect('/admin/ticket');
            }
        }
        else {
            res.render('login');
        }
    })
})
app.get("/admin/seattype", function (req, res) {
    loginController.CheckLogin(req).then(async check => {
        if (check) {
            var staffData = await loginController.GetUser(req);
            if(staffData.Role == 3) {
                res.render('seatTypeAdmin', {data: staffData});
            } 
            else if(staffData.Role == 2){
                res.redirect('/admin/dashboard');
            }
            else {
                res.redirect('/admin/ticket');
            }
        }
        else {
            res.render('login');
        }
    })
})
app.get("/admin/carriage", function (req, res) {
    loginController.CheckLogin(req).then(async check => {
        if (check) {
            var staffData = await loginController.GetUser(req);
            if(staffData.Role == 3) {
                res.render('carriageAdmin', {data: staffData});
            } 
            else if(staffData.Role == 2){
                res.redirect('/admin/dashboard');
            }
            else {
                res.redirect('/admin/ticket');
            }
        }
        else {
            res.render('login');
        }
    })
})
app.get("/admin/schedule", function (req, res) {
    loginController.CheckLogin(req).then(async check => {
        if (check) {
            var staffData = await loginController.GetUser(req);
            if(staffData.Role != 1) {
                res.render('scheduleAdmin', {data: staffData});
            } 
            else {
                res.redirect('/admin/ticket');
            }
        }
        else {
            res.render('login');
        }
    })
})

//action customer
app.delete("/admin/customer", function (req, res) {
    loginController.CheckLogin(req).then(async check => {
        if (check) {
            managerCtrler.delCustomerByID(req, res)
        }
        else {
            res.redirect('/admin/customer');
        }
    })
    
});
app.post("/admin/customer", function (req, res) {
    loginController.CheckLogin(req).then(async check => {
        if (check) {
            managerCtrler.createCustomer(req, res);
        }
        else {
            
            res.redirect('/admin/customer');
        }
    })
    
})
app.put("/admin/customer", function (req, res) {
    loginController.CheckLogin(req).then(async check => {
        if (check) {
            managerCtrler.updateCustomer(req, res);
        }
        else {
            res.redirect('/admin/customer');
        }
    })
})

//action train
app.get("/getTrain", function (req, res) {
    loginController.CheckLogin(req).then(async check => {
        if (check) {
            managerCtrler.getTrainByID(req, res);
        }
        else {
            res.redirect('/admin/train');
        }
    })
})
app.post("/admin/train", function (req, res) {
    loginController.CheckLogin(req).then(async check => {
        if (check) {
            managerCtrler.getTrainByID(req, res);
        }
        else {
            res.redirect('/admin/train');
        }
    })
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
    loginController.CheckLogin(req).then(async check => {
        if (check) {
            var staffData = await loginController.GetUser(req);
            res.render('ticketAdmin', {data : staffData});
        }
        else {
            res.render('login');
        }
    })
})
app.get("/admin/cancelticket", function (req, res) {
    loginController.CheckLogin(req).then(async check => {
        if (check) {
            var staffData = await loginController.GetUser(req);
            res.render('cancelTicketAdmin', {data: staffData});
        }
        else {
            res.render('login');
        }
    })
})
app.put("/cancelTicketWithMail", function (req, res) {
    managerCtrler.cancelTicket(req, res)
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

var listSeatBlock = [];
var fnc = new Function('io, data', 'setTimeout(() => {io.emit("response_unblock", data)}, 900000);');
//900000
var io = io.on('connection', (socket) => {
    
    console.log('a user connected');
    socket.emit('response', listSeatBlock);

    socket.on('changeStatus', (data) => {
        var check = false;
        listSeatBlock.forEach(seat => {
            if (data.id == seat.id && data.number == seat.number) {
                if (data.class.search('soft_bed_left') != -1) {
                    data.class = 'train_bed_cell bed can_block soft_bed_left reserved';
                }
                else if (data.class.search('soft_bed_right') != -1) {
                    data.class = 'train_bed_cell bed can_block soft_bed_right reserved';
                }
                else if (data.class.search('soft_seat_left') != -1) {
                    data.class = 'train_cell seat can_block soft_seat_left reserved';
                }
                check = true;
            }
        })

        //console.log(socket);
        if (typeof (data.class) != "undefined" && data.block == true) {

            if (data.class.search('soft_bed_left') != -1) {
                data.class = 'train_bed_cell bed can_block soft_bed_left reserved';
            }
            else if (data.class.search('soft_bed_right') != -1) {
                data.class = 'train_bed_cell bed can_block soft_bed_right reserved';
            }
            else if (data.class.search('soft_seat_left') != -1) {
                data.class = 'train_cell seat can_block soft_seat_left reserved';
            }

            if (!check) {
                listSeatBlock.push(data);
                socket.broadcast.emit('response', listSeatBlock);
                fnc(io, data);
            }
            else {
                //console.log(socket.id);
                socket.emit('response', { data: { listSeatBlock: listSeatBlock, check: true, id: data.id } });
            }
        }
        else if (typeof (data.class) != "undefined" && data.unblock == true) {
            var listUnblock = listSeatBlock.filter(seat => { return data.id != seat.id;});
            listSeatBlock = listUnblock;
            socket.broadcast.emit('response_unblock', data);
        }
    })

    socket.on('deleteSeat', (data) => {
        var listUnblock = listSeatBlock.filter(seat => { return data.id != seat.id;});
        listSeatBlock = listUnblock;
    })
});

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

app.get('/listSchedule', (req, res) => {
    res.render('listFare');
})
process.on("unhandledRejection", function (reason, p) {
    console.log("Unhandled Rejection:", reason.stack);
    //process.exit(1);
});

app.get('/changeStatus', (req,res) => {
    controller.ChangeStatusTicket(req,res);
})

http.listen(port, function () {
    console.log("Run on port " + port);
});

app.get('/admin/logout', (req,res) => {
    res.cookie('uid', "");
    res.end(JSON.stringify("/login"));
})

// //TEST CHAT 
// app.get("/chat", function (req, res) {
//     res.render('chat');
// })
// var io = require('socket.io')(server);
// var numUsers = 0;
// io.on('connection', (socket) => {
//     var addedUser = false;

//     // when the client emits 'new message', this listens and executes
//     socket.on('new message', (data) => {
//         // we tell the client to execute 'new message'
//         socket.broadcast.emit('new message', {
//             username: socket.username,
//             message: data
//         });
//     });

//     // when the client emits 'add user', this listens and executes
//     socket.on('add user', (username) => {
//         if (addedUser) return;

//         // we store the username in the socket session for this client
//         socket.username = username;
//         ++numUsers;
//         addedUser = true;
//         socket.emit('login', {
//             numUsers: numUsers
//         });
//         // echo globally (all clients) that a person has connected
//         socket.broadcast.emit('user joined', {
//             username: socket.username,
//             numUsers: numUsers
//         });
//     });

//     // when the client emits 'typing', we broadcast it to others
//     socket.on('typing', () => {
//         socket.broadcast.emit('typing', {
//             username: socket.username
//         });
//     });

//     // when the client emits 'stop typing', we broadcast it to others
//     socket.on('stop typing', () => {
//         socket.broadcast.emit('stop typing', {
//             username: socket.username
//         });
//     });

//     // when the user disconnects.. perform this
//     socket.on('disconnect', () => {
//         if (addedUser) {
//             --numUsers;

//             // echo globally that this client has left
//             socket.broadcast.emit('user left', {
//                 username: socket.username,
//                 numUsers: numUsers
//             });
//         }
//     });
// });
