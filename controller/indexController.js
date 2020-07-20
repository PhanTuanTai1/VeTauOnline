var { Sequelize, Model, DataTypes, Op } = require('sequelize');
var db = require("../data_access/DataAccess");
var moment = require('moment');
var bucketjs = require('../node_modules/buckets-js/dist/buckets');
var formidable = require('formidable');
var UUID = require('uuidjs');
var md5 = require('md5');
var Duration = require("duration");
var mail = require('nodemailer')
var config = require('../config/common');
const { resolve } = require('bluebird');
var transporter = mail.createTransport({
    service: 'gmail',
    auth: {
      user: config.UserName,
      pass: config.Password
    }
  });

var STATUS = {
    "NOTPRINT": "1",
    "PRINTED": "2",
    "CANCEL": "3",
    "WAITING_CANCEL" : "4"
}

module.exports.index = function (req, res) {
    db.Station.findAll({
        attributes: ["ID", "Name"]
    }).then(station => {
        station = station;
        res.end(JSON.stringify(station));
    })
}

module.exports.train = function (req, res) {
    db.Train.findAll({
        attributes: ["ID", "Name"]
    }).then(train => {
        train = train;
        res.end(JSON.stringify(train));
    })
}

module.exports.search = function (req, res) {

    if (typeof (req.query.ONE_WAY) != "undefined" && req.query.ONE_WAY == "true") {
        db.Schedule.findAll({
            attributes: ['ID', 'DateDeparture', 'TimeDeparture', 'TrainID'],
            include: [{
                model: db.ScheduleDetail,
                attributes: ['ID', 'ScheduleID', 'DepartureStationID', 'ArrivalStationID', 'Time','StartTime'],
                where: {
                    DepartureStationID: parseInt(req.query.FROM),
                    ArrivalStationID: parseInt(req.query.TO)
                }
            }],
        }).then(async Schedule => {
            console.log('Schedule: ' + JSON.stringify(Schedule));
            if (Schedule.length === 0) {
                res.render('searchResultOneWay', { result: [], query: JSON.stringify(req.query), error: 1, arrivalID: req.query.TO, departureID: req.query.FROM });
                res.end();
            }
            var ListSchedule = await getScheduleMatch(req.query.DEPART, parseInt(req.query.FROM), Schedule);
            if(ListSchedule.length == 0) {
                res.render('searchResultOneWay', { result: [], query: JSON.stringify(req.query), error: 1, arrivalID: req.query.TO, departureID: req.query.FROM });
                res.end();
            }
            else{
                console.log("ListSchedule: " + JSON.stringify(ListSchedule));
                res.render('searchResultOneWay', { result: JSON.stringify(ListSchedule), query: JSON.stringify(req.query), numberOfPassenger: req.query.PASSENGERS});
            }        
        })
    }
    else if (typeof (req.query.ROUND_TRIP) != "undefined" && req.query.ROUND_TRIP == "true") {
        var date = req.query.DEPART;
        var from = req.query.FROM;
        var to = req.query.TO;

        if (typeof (req.query.STEP) != "undefined" && req.query.STEP == 1) {
            date = req.query.RETURN;
            from = req.query.TO;
            to = req.query.FROM;
        }

        db.Schedule.findAll({
            attributes: ['ID', 'DateDeparture', 'TimeDeparture', 'TrainID'],
            include: [{
                model: db.ScheduleDetail,
                attributes: ['ID', 'ScheduleID', 'DepartureStationID', 'ArrivalStationID', 'Time','StartTime'],
                where: {
                    DepartureStationID: parseInt(from),
                    ArrivalStationID: parseInt(to)
                }
            }],
        }).then(async Schedule => {
            // console.log(JSON.stringify(Schedule));
            if (Schedule.length === 0) {
                if (typeof (req.query.STEP) == "undefined") {
                    res.render('searchResultRoundTrip', { result: [], query: JSON.stringify(req.query), STEP: 1, error: 1, arrivalID: req.query.TO, departureID: req.query.FROM });
                }
                else {
                    res.render('searchResultRoundTrip', { result: [], query: JSON.stringify(req.query), STEP: 2, DepartureQuery: req.query.DepartureQuery, error: 1, arrivalID: req.query.TO, departureID: req.query.FROM });
                }
                res.end();
            }
            var result = [];
            var count = 0;
            var ListSchedule = await getScheduleMatch(date, parseInt(from), Schedule);
            if (typeof (req.query.STEP) == "undefined") {
                res.render('searchResultRoundTrip', { result: JSON.stringify(ListSchedule), query: JSON.stringify(req.query), STEP: 1 , numberOfPassenger: req.query.PASSENGERS});
            }
            else {
                var data = { 'SCHEDULEID': req.query.SCHEDULEID, 'SCHEDULEDETAILID': req.query.SCHEDULEDETAILID, 'costID': req.query.costID }
                res.cookie('step1', data)
                res.render('searchResultRoundTrip', { result: JSON.stringify(ListSchedule), query: JSON.stringify(req.query), STEP: 2, DepartureQuery: req.query.DepartureQuery , numberOfPassenger: req.query.PASSENGERS});
            } 
        })
    }
}

function getAllScheduleDetailByID(ScheduleID)
{
    return new Promise(resolve => {
        db.Schedule.findOne({
            attributes: ['ID'],
            where: {
                ID: ScheduleID
            },
            include: {
                model: db.ScheduleDetail,
                attributes: ['ID','ScheduleID','DepartureStationID','ArrivalStationID','Length','Time','StartTime'],
                order: ['Length','DESC']
            }
        }).then(data => {
            resolve(data);
        })
    })
}

function getScheduleMatch(Date, DepartureID, ListSchedule) {
    var ListFilter = [];
    return new Promise(async resolve => {
        ListSchedule.forEach(async (schedule, index, array ) => {
            var Schedule = await getAllScheduleDetailByID(schedule.ID);
            var firstScheduleDetail = Schedule.ScheduleDetails[0];
            var getScheduleDetailBeforeThisScheduleDetail;
            var TimeScheduleDetails;
            if(firstScheduleDetail.DepartureStationID == schedule.ScheduleDetails[0].DepartureStationID 
                && firstScheduleDetail.ArrivalStationID == schedule.ScheduleDetails[0].ArrivalStationID){

                getScheduleDetailBeforeThisScheduleDetail = firstScheduleDetail;
                TimeScheduleDetails = 0;   
            }
            else {
                getScheduleDetailBeforeThisScheduleDetail = Schedule.ScheduleDetails.filter(scheduleDetail => {
                    return scheduleDetail.DepartureStationID == firstScheduleDetail.DepartureStationID 
                    && schedule.ScheduleDetails[0].DepartureStationID == scheduleDetail.ArrivalStationID
                })              
                TimeScheduleDetails = parseInt(getScheduleDetailBeforeThisScheduleDetail.Time * 60);
            }

            console.log("---------------------------getScheduleDetailBeforeThisScheduleDetail: " + JSON.stringify(getScheduleDetailBeforeThisScheduleDetail));
            var TimeDepartInt = parseInt(moment(schedule.TimeDeparture).subtract(7,'hour').format('HH'));
            console.log("---------------------------TimeDepartInt: " + TimeDepartInt)
            
            var MinutesDepartInt = parseInt(moment(schedule.TimeDeparture).format('mm'));

            // Departure Date in Database
            var DateDepart = moment(schedule.DateDeparture).add(TimeDepartInt, 'hour')
                            .subtract(7,'hour').add(MinutesDepartInt + TimeScheduleDetails, 'minutes').format('YYYY-MM-DD');

            // Departure Date in website
            var DateDepartFormat = (moment(Date).subtract(7, 'hour').format('YYYY-MM-DD'));
            var parseDateDepart = moment(DateDepart);
            var parseDateDepartFormat = moment(DateDepartFormat);

            console.log("----------Expected:" +  DateDepartFormat);
            console.log("----------Actual:" +  DateDepart);
            console.log("Schedule.DateDeparture: " + schedule.DateDeparture);
            var check = await checkIsSameDepartureStationIDFirst(DepartureID, schedule.ID);

            console.log("----------OR Expected:" +  moment(schedule.DateDeparture).format('DD-MM-YYYY'));
            console.log("----------OR Actual:" +  moment(Date).subtract(7, 'hour').format('DD-MM-YYYY'));
            console.log("---------------Check: " + check);
            console.log("Date parameter: " + Date)
            if((DateDepartFormat == DateDepart && !check) 
                || (check && moment(schedule.DateDeparture).format('DD-MM-YYYY') == moment(Date).subtract(7, 'hour').format('DD-MM-YYYY'))) 
            {           
                ListFilter.push(schedule)
            }       
            else if(moment(moment(DateDepartFormat).add(129600000, 'milliseconds')._d).format('YYYY-MM-DD') == parseDateDepart._d){
                ListFilter.push(schedule)                     
            }

            if(index + 1 === array.length) {
                resolve(ListFilter);
            }
        })
    });
}

function checkIsSameDepartureStationIDFirst(DepartureID, ScheduleID){
    return new Promise(resolve => {
        db.Schedule.findOne({
            attributes: ['ID'],
            where:{
                ID: ScheduleID
            },
            include:{
                model: db.ScheduleDetail,
                attributes: ['ID','DepartureStationID']
            }
        }).then(data => {
            console.log(JSON.stringify(data));
            if(data.ScheduleDetails[0].DepartureStationID == DepartureID) resolve(true);
            else resolve(false);
        })
    });
}

// function checkIsDepartureStationFirst(DepartureID, Schedule){
//     return new Promise(resolve => {
//         db.Schedule.findOne({
//             attributes: ['ID'],
//             where: {
//                 ID: Schedule.ID
//             },
//             include: {
//                 model: db.ScheduleDetail,
//                 attributes: ['ID', 'DepartureStationID']
//             }
//         }).then(data => {
//             console.log(JSON.stringify(data));
//             if (data.ScheduleDetails[0].DepartureStationID == DepartureID) resolve(true);
//             else resolve(false);
//         })
//     });
// }

module.exports.scheduleDetail = function (req, res) {
    db.Schedule.findAll({
        attributes: ['ID', 'TrainID', 'TimeDeparture', 'DateDeparture'],
        where: {
            ID: req.query.SCHEDULEID,
            TrainID: req.query.TRAINID
        },
        include: [{
            model: db.ScheduleDetail,
            attributes: ['ID', 'DepartureStationID', 'ArrivalStationID', 'Length', 'Time','StartTime'],
            where: {
                DepartureStationID: parseInt(req.query.DepartID),
                ArrivalStationID: parseInt(req.query.ArrivalID)
            },
            include: [{
                model: db.TableCost,
                attributes: ['SeatTypeID', 'Cost', "ScheduleID"]
            }]
        }]
    }).then(async result => {
        var DepartureStation = await getStationByID(result[0].ScheduleDetails[0].DepartureStationID);
        var ArrivalStation = await getStationByID(result[0].ScheduleDetails[0].ArrivalStationID);
        var Train = await getTrainByID(result[0].TrainID);
        var data2 = await getAllSeatType(Train);
        console.log("Schedule: " + JSON.stringify(result));
        await getListSeatSoldDetail(result[0], false).then(data3 => {
            console.log("Empty: " + data3.isEmpty())
            var data = JSON.parse(req.query.Query);
            console.log("Result: " + JSON.stringify(result));
            console.log("Empty dic: " + data2.isEmpty())
            console.log("RENDER");
            if(typeof(req.query.ONE_WAY) != "undefined"){
                res.render('scheduleDetail', 
                {result: result, 
                departureStation: DepartureStation, 
                arrivalStation: ArrivalStation, 
                train: Train, 
                moment: moment, 
                duration: Duration,
                dic: data2, 
                ONE_WAY: req.query.ONE_WAY, 
                PASSENGERS: req.query.PASSENGERS, 
                DEPART: data.DEPART,
                FROM: data.FROM,
                TO: data.TO,
                SCHEDULEID: req.query.SCHEDULEID,
                TrainID:  req.query.TRAINID,
                SCHEDULEDETAILID: result[0].ScheduleDetails[0].ID,
                query: req.query.Query,
                ListSeatSold: data3});
            }
            else if(typeof(req.query.ROUND_TRIP) != "undefined" && req.query.STEP == 2){
                res.render('scheduleDetail', 
                {result: result, 
                departureStation: DepartureStation, 
                arrivalStation: ArrivalStation, 
                train: Train, 
                moment: moment,       
                duration: Duration,
                dic: data2, 
                ROUND_TRIP: req.query.ROUND_TRIP, 
                PASSENGERS: req.query.PASSENGERS, 
                DEPART: data.DEPART,
                RETURN: data.RETURN,
                FROM: data.FROM,
                TO: data.TO,
                SCHEDULEID: req.query.SCHEDULEID,
                TrainID:  req.query.TRAINID,
                SCHEDULEDETAILID: result[0].ScheduleDetails[0].ID,
                STEP:2,
                query: req.query.Query,
                ListSeatSold: data3});
            }
            else {
                res.render('scheduleDetail', 
                {result: result, 
                departureStation: DepartureStation, 
                arrivalStation: ArrivalStation, 
                train: Train, 
                moment: moment, 
                duration: Duration,
                dic: data2, 
                ROUND_TRIP: req.query.ROUND_TRIP, 
                PASSENGERS: req.query.PASSENGERS, 
                DEPART: data.DEPART,
                RETURN: data.RETURN,
                FROM: data.FROM,
                TO: data.TO,
                SCHEDULEID: req.query.SCHEDULEID,
                TrainID:  req.query.TRAINID,
                SCHEDULEDETAILID: result[0].ScheduleDetails[0].ID,
                STEP:req.query.STEP,
                DepartureQuery: data,
                query: req.query.Query,
                ListSeatSold: data3 });
            }     
            })
        
    })
}

module.exports.getFirstCost = function (req, res) {
    console.log(req.query.ScheduleID);
    db.TableCost.findOne({
        attributes: ['Cost'],
        where: {
            ScheduleID: req.query.ScheduleID
        }
    }).then(cost => {
        res.end(JSON.stringify(cost));
    })
}

module.exports.getAllSeatType = function (req, res) {
    db.SeatType.findAll({
        attributes: ['ID', 'TypeName']
    }).then(seatType => {
        res.end(JSON.stringify(seatType));
    })
}

module.exports.passenger = function (req, res) {
    db.Schedule.findOne({
        attributes: ['ID', 'TrainID', 'DateDeparture', 'TimeDeparture'],
        where: {
            ID: parseInt(req.query.SCHEDULEID)
        },
        include: [{
            model: db.ScheduleDetail,
            attributes: ['ID', 'DepartureStationID', 'ArrivalStationID', 'Length', 'Time'],
            where: {
                ID: parseInt(req.query.SCHEDULEDETAILID)
            },
            include: [{
                model: db.TableCost,
                attributes: ['ScheduleID', 'SeatTypeID', 'Cost'],
                where: {
                    SeatTypeID: parseInt(req.query.costID)
                }
            }]
        }]
    }).then(result => {
        if (typeof (req.cookies.step1) != "undefined" && typeof (req.query.ONE_WAY) == "undefined") {
            db.Schedule.findOne({
                attributes: ['ID', 'TrainID', 'DateDeparture', 'TimeDeparture'],
                where: {
                    ID: parseInt(req.cookies.step1.SCHEDULEID)
                },
                include: [{
                    model: db.ScheduleDetail,
                    attributes: ['ID', 'DepartureStationID', 'ArrivalStationID', 'Length', 'Time'],
                    where: {
                        ID: parseInt(req.cookies.step1.SCHEDULEDETAILID)
                    },
                    include: [{
                        model: db.TableCost,
                        attributes: ['ScheduleID', 'SeatTypeID', 'Cost'],
                        where: {
                            SeatTypeID: parseInt(req.cookies.step1.costID)
                        }
                    }]
                }]
            }).then(result2 => {
                res.render('passengers', {
                    result: result, result2: result2,
                    moment: moment,
                    SeatTypeID: req.query.costID,
                    passengers: req.query.PASSENGERS,
                    FROM: req.query.FROM,
                    TO: req.query.TO,
                    DEPART: req.query.DEPART,
                    ONE_WAY: req.query.ONE_WAY,
                    ROUND_TRIP: req.query.ROUND_TRIP,
                    query: req.query.Query,
                    duration: Duration
                })
            })
        }
        else {
            console.log('req.query.Query: ' + req.query.Query);
            res.render('passengers', {
                result: result,
                moment: moment,
                SeatTypeID: req.query.costID,
                passengers: req.query.PASSENGERS,
                FROM: req.query.FROM,
                TO: req.query.TO,
                DEPART: req.query.DEPART,
                ONE_WAY: req.query.ONE_WAY,
                ROUND_TRIP: req.query.ROUND_TRIP,
                query: req.query.Query,
                duration: Duration
            })
        }
    })
}

module.exports.getAllCarriage = function (req, res) {
    getAllCarriage().then(data => {
        res.end(JSON.stringify(data));
    });

}

module.exports.getAllTypeObject = function (req, res) {
    db.TypeObject.findAll({
        attributes: ['ID','TypeObjectName']
    }).then(data => {
        res.end(JSON.stringify(data));
    })
}

module.exports.getListSeatSold = async  function(req,res){ 
    console.log("Schedule: " + req.query.Schedule)
    await getListSeatSoldDetail(JSON.parse(req.query.Schedule),true).then(data => {
        ListSeatSold = [];
        if(data.length == 0) {
            console.log("data.length = 0");
            res.end(JSON.stringify(ListSeatSold));
        }
        data.forEach((ListSeat, index, array) => {
            ListSeat.forEach(ticket => {
                ListSeatSold.push({
                    "SeatID" : ticket.SeatID
                })
            })

            if(index + 1 === array.length) {
                console.log("array.length: " + array.length)
                res.end(JSON.stringify(ListSeatSold));
            }
        })
    })
}

module.exports.getAllSeat = function (req, res) {
    getAllSeat().then(data => {
        res.end(JSON.stringify(data));
    })
}

module.exports.createSession = async function (req, res) {
    var Representative = req.body.data.Representative;
    var ListPassenger = req.body.data.ListPassenger;
    var ListSeat = req.body.data.ListSeat;
    var ListSeat2;
    var TicketInfo = req.body.data.TicketInfo
    var TicketInfo2;
    var RepresentativeID = parseInt(UUID.genV4().bitFields.clockSeqLow) + parseInt(Math.random() * 10000000);
    var total = await calculateCost(TicketInfo, ListPassenger);

    if (typeof (req.body.data.TicketInfo2) != "undefined") {
        TicketInfo2 = req.body.data.TicketInfo2;
        total += await calculateCost(TicketInfo2, ListPassenger);
        ListSeat2 = req.body.data.ListSeat2;

        var RepresentativeModel = db.Representative.build({
            'Name': Representative.FullName,
            'Passport': Representative.Passport,
            'Email': Representative.Email,
            'Phone': Representative.Phone,
            'ID': RepresentativeID,
            'TotalCost': total,
            'DateBooking': moment(moment()._d).format('YYYY-MM-DD')
        })

        var listPassenger = await CreateListPassengerModel(ListPassenger, RepresentativeID);
        var listTicket = []
        while(listTicket.length < ListSeat.length) {
            listTicket = await CreateTicket(listPassenger, TicketInfo, ListSeat);
        }
        TicketInfo.PassengerQuantity = listPassenger.length;
        TicketInfo.SeatID = listTicket[0].SeatID;
        res.cookie('data', RepresentativeModel);
        res.cookie('data2', listPassenger);
        res.cookie('data3', listTicket);
        res.cookie('data4', TicketInfo);
        var listTicket2 = [];
        while(listTicket2.length < ListSeat2.length) {
            listTicket2 = await CreateTicket(listPassenger, TicketInfo2, ListSeat2);
        }
        TicketInfo2.PassengerQuantity = listPassenger.length;
        TicketInfo2.SeatID = listTicket2[0].SeatID;
        res.cookie('data5', listTicket2); // Ticket 2
        res.cookie('data6', TicketInfo2);
        res.end('/payment');
        // CreateListPassengerModel(ListPassenger, RepresentativeID).then(data => {
        //     CreateTicket(data, TicketInfo, ListSeat).then(data2 => {
        //         TicketInfo.PassengerQuantity = data.length;
        //         TicketInfo.SeatID = data2[0].SeatID;
        //         res.cookie('data', RepresentativeModel); // Representative
        //         res.cookie('data2', data); // ListPassenger
        //         res.cookie('data3', data2); // Ticket
        //         res.cookie('data4', TicketInfo);
        //         CreateTicket(data, TicketInfo2, ListSeat2).then(data3 => {
        //             TicketInfo2.PassengerQuantity = data.length;
        //             TicketInfo2.SeatID = data3[0].SeatID;
        //             res.cookie('data5', data3); // Ticket 2
        //             res.cookie('data6', TicketInfo2);
        //             res.end('/payment');
        //         })
        //     })
        // });
    }
    else {
        var RepresentativeModel = db.Representative.build({
            'Name': Representative.FullName,
            'Passport': Representative.Passport,
            'Email': Representative.Email,
            'Phone': Representative.Phone,
            'ID': RepresentativeID,
            'TotalCost': total,
            'DateBooking': moment(moment()._d).format('YYYY-MM-DD')
        })
        var listPassenger = await CreateListPassengerModel(ListPassenger, RepresentativeID);
        var listTicket = []
        while(listTicket.length < ListSeat.length) {
            listTicket = await CreateTicket(listPassenger, TicketInfo, ListSeat);
        }
        TicketInfo.PassengerQuantity = listPassenger.length;
        TicketInfo.SeatID = listTicket[0].SeatID;
        res.cookie('data', RepresentativeModel);
        res.cookie('data2', listPassenger);
        res.cookie('data3', listTicket);
        res.cookie('data4', TicketInfo);
        res.end('/payment');
        // console.log(JSON.stringify(TicketInfo));
        // CreateListPassengerModel(ListPassenger, RepresentativeID).then(data => {
        //     CreateTicket(data, TicketInfo, ListSeat).then(data2 => {
        //         TicketInfo.PassengerQuantity = data.length;
        //         TicketInfo.SeatID = data2[0].SeatID;
        //         res.cookie('data', RepresentativeModel); // Representative
        //         res.cookie('data2', data); // ListPassenger
        //         res.cookie('data3', data2); // Ticket
        //         res.cookie('data4', TicketInfo);
        //         res.end('/payment');
        //     })
        // });
    }


}

function calculateCost(Ticket, ListPassenger){
    return new Promise(resolve => {
        db.TypeObject.findAll({
            attributes: ['ID','TypeObjectName','Discount']
        }).then(data => {
            let total = 0;
            ListPassenger.forEach((passenger, index, array) => {
                var discount = data.find(x => x.ID == parseInt(passenger.TypeObject))
                total += Ticket.Price - (Ticket.Price * parseFloat(discount.Discount));

                if(index == array.length - 1) {
                    resolve(total);
                }
            })
        })
        
    });
}
module.exports.payment = function (req, res) {
    if (typeof (req.cookies.data6) != "undefined") {
        console.log(req.cookies.data6);
        res.render('payment', { Representative: req.cookies.data, TicketInfo: req.cookies.data4, TicketInfo2: req.cookies.data6, moment: moment });
    }
    else {
        res.render('payment', { Representative: req.cookies.data, TicketInfo: req.cookies.data4, moment: moment });
    }

}

module.exports.getSeatTypeBySeatID = function (req, res) {
    db.Seat.findOne({
        attributes: ['ID'],
        where: {
            ID: req.query.SeatID
        },
        include: {
            model: db.SeatType,
            attributes: ['ID', 'TypeName']
        }
    }).then(data => {
        res.end(JSON.stringify(data));
    })
}

module.exports.RedirectToNganLuong = function (req, res) {
    let return_url = "https://trainticketonlinevn.herokuapp.com/paymentSuccess";
    //let return_url = "http://localhost:3000/paymentSuccess";
    let url = 'https://sandbox.nganluong.vn:8088/nl35/checkout.php?';
    url += 'merchant_site_code=48847&';
    url += 'return_url=' + return_url + '&';
    url += 'receiver=phantuantai1234@gmail.com&';
    url += 'transaction_info=thanhtoantienvetau&';
    url += 'order_code=' + req.cookies.data.ID + '&';
    url += 'price=' + req.cookies.data.TotalCost + '&';
    url += 'currency=vnd&';
    url += 'quantity=1&';
    url += 'tax=0&';
    url += 'discount=0&';
    url += 'fee_cal=0&';
    url += 'fee_shipping=0&';
    url += 'order_description=1&';
    url += 'buyer_info=1&';
    url += 'affiliate_code=1&';
    var secure_code = md5(48847 + ' ' + return_url + ' ' + 'phantuantai1234@gmail.com' + ' ' + 'thanhtoantienvetau' + ' '
        + req.cookies.data.ID + ' ' + req.cookies.data.TotalCost + ' ' + 'vnd' + ' ' + 1 + ' ' + 0 + ' ' + 0 + ' ' + 0 + ' '
        + 0 + ' ' + 1 + ' ' + 1 + ' ' + 1 + ' ' + '3fb19dfe9df59a63b23ca36069c3aea5')
    url += 'secure_code=' + secure_code;
    res.redirect(url);
}

function SendMail(email ,html, option){
    var mailOptions = {
        from: 'trainticketonlinevn@gmail.com',
        to: email,
        subject: 'Thank you for booking at our website (' + option + ')',
        html: html
    };
    transporter.sendMail(mailOptions, (error,info) => {
        if(error) {
            console.log(JSON.stringify(error))
            transporter.sendMail(mailOptions)
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    })
}
function unblockSeat(ListTicket, listBlock) {
    var filter;
    ListTicket.forEach(seat => {
        filter = listBlock.filter(x => {
            return x.id != seat.SeatID
        })
        listBlock = filter;
    })
}
module.exports.InsertData = async function (req, res, listBlock) {
    //console.log(req.cookies);
    var Representative = req.cookies.data;
    var ListPassenger = req.cookies.data2;
    var ListTicket = req.cookies.data3;
    
    console.log("req.query:" + JSON.stringify(req.query));
    var ListTicket2;
    var html2;
    var option = "One Way";
    if (typeof(req.cookies.data5) != "undefined") {
        ListTicket2 = req.cookies.data5;     
        html2 = await createTableListCustomer(Representative, ListPassenger, ListTicket2, req.query.payment_id);
        option = "Round Trip";
        SendMail(Representative.Email, html2, option)
        await unblockSeat(ListTicket2, listBlock);
    }

    var html = await createTableListCustomer(Representative, ListPassenger, ListTicket, req.query.payment_id);
    SendMail(Representative.Email, html, option)
    await unblockSeat(ListTicket, listBlock);
    db.Representative.create(Representative).then(data => {
        InsertPassenger(ListPassenger).then(data => {
            if (data) {
                InsertTicket(ListTicket).then(data1 => {
                    if (data1) {
                        if (typeof (req.cookies.data5) != "undefined") {
                            InsertTicket(ListTicket2).then(data2 => {
                                if (data2) {                                  
                                    res.render('confirmation', { ROUND_TRIP: true, Representative: req.cookies.data, moment: moment });
                                }
                                else {
                                    res.end("Error");
                                }
                            })
                        }
                        else {                           
                            res.render('confirmation', { Representative: req.cookies.data, moment: moment });
                        }
                    }
                    else {
                        res.end("Error");
                    }
                })
            }
            else {
                res.end("Error");
            }
        })
    })

}

module.exports.ManageBooking = function (req, res) {
    db.Representative.findOne({
        attributes: ['ID', 'DateBooking', 'TotalCost', 'Passport', 'Email'],
        where: {
            ID : req.body.booking_code
        },
        include: {
            model: db.Customer,
            attributes: ['ID', 'Name','TypeObjectID', 'Passport'],
            include: {
                model: db.Ticket,
                attributes: ['ID', 'CustomerID', 'Price','Status','DepartureStationID','ArrivalStationID','DepartureDate']
            }
        }
    }).then(data => {
        res.render('managebooking', {result: data, Date: new Date(), moment: moment});
    })
}

module.exports.GetAllSchedule = function(req,res) {
    db.Schedule.findAll({
        attributes: ['ID', 'DateDeparture', 'TrainID','TimeDeparture'],
        where: {
            DateDeparture: {[Op.gte] : moment()._d}
        },
        include: {
            model: db.ScheduleDetail,
            attributes: ['ID', 'DepartureStationID', 'ArrivalStationID', 'Length'],
            limit: 1,
            order:  [
                ['Length', 'DESC']
            ]
        },
    }).then(data => {
        console.log("GetAllSchedule: " + JSON.stringify(data));
        res.end(JSON.stringify(data));
    })
}

module.exports.GettAllScheduleDetailByID = function(req,res) {
    db.ScheduleDetail.findAll({
        attributes: ['ID','ScheduleID','DepartureStationID', 'ArrivalStationID','Length','StartTime','Time'],
        order: ['DepartureStationID'],      
        where: {
            ScheduleID: req.query.ID
        },
        include: {
            model: db.TableCost,
            attributes: ['ScheduleID','SeatTypeID','Cost'],
            include: {
                model: db.SeatType,
                attributes: ['ID','TypeName']
            }
        }
    }).then(data => {
        db.Schedule.findOne({
            attributes: ['ID','DateDeparture','TimeDeparture'],
            where : {
                ID : req.query.ID
            }
        }).then(schedule => {
            res.render('listScheduleDetail',{result:data, schedule: schedule});
        })
        
    })
}

function InsertPassenger(ListPassenger) {
    return new Promise(resolve => {
        ListPassenger.forEach(passenger => {
            db.Customer.create(passenger)
                .then(data => {
                    resolve(true);
                }).catch(err => {
                    console.log(err);
                    resolve(false);
                })
        })
    });
}

function InsertTicket(ListTicket) {
    return new Promise(resolve => {
        ListTicket.forEach(ticket => {
            db.Ticket.create(ticket)
                .then(data => {
                    resolve(true);
                }).catch(err => {
                    console.log(err);
                    resolve(false);
                })
        })
    });
}

function CreateListPassengerModel(ListPassenger, RepresentativeID){
    var ListPassengerModel = [];
    return new Promise(resolve => {
        ListPassenger.forEach(data => {
            RandomCustomerID().then(ID => {
                var PassengerModel = db.Customer.build({
                    'Name': data.Name,
                    'Passport': data.Passport,
                    'TypeObjectID': data.TypeObject,
                    'RepresentativeID': RepresentativeID,
                    'ID': ID
                })

                ListPassengerModel.push(PassengerModel);
            })
        })
        resolve(ListPassengerModel);
    })
}

function CreateTicket(ListPassengerModel, TicketInfo, ListSeat) {
    var ListTicketInfo = [];

    return new Promise(resolve => {
        ListPassengerModel.forEach((data, index, array) => {
            var ID = parseInt(UUID.genV4().bitFields.clockSeqLow) + parseInt(Math.random() * 10000000);
            caculateCostForTicket(TicketInfo.Price, data).then(cost => {
                var TicketModel = db.Ticket.build({
                    'ID': ID,
                    'CustomerID': data.ID,
                    'SeatID': ListSeat[index].ID,
                    'DepartureDate': TicketInfo.DepartureDate,
                    'DepartureTime': TicketInfo.DepartureTime,
                    'Price': cost,
                    'Status': STATUS["NOTPRINT"],
                    'DepartureStationID': TicketInfo.DepartureStationID,
                    'ArrivalStationID': TicketInfo.ArrivalStationID,
                    'TrainName': TicketInfo.TrainName
                })
                ListTicketInfo.push(TicketModel);
                
                if(index == array.length - 1) {
                    resolve(ListTicketInfo);
                }
            });
        })
        
    })
}

function caculateCostForTicket(Price, Passenger) {
    return new Promise(resolve => {
        db.TypeObject.findOne({
            attributes: ['Discount'],
            where : {
                ID: Passenger.TypeObjectID
            }
        }).then(data => {
            resolve(Price - (Price * data.Discount));
        })
    })
}

function getListSeatSoldDetail(Schedule, isBreak){
    return new Promise(resolve => {
        db.Schedule.findOne({
            attributes: ['ID', 'DateDeparture', 'TrainID','TimeDeparture'],
            where: {
                ID: Schedule.ID
            },
            include: {
                model: db.ScheduleDetail,
                attributes: ['ID', 'DepartureStationID', 'ArrivalStationID','Time'],
                where: {
                    [Op.or]: [{Time:{[Op.gte]: Schedule.ScheduleDetails[0].Time}},{DepartureStationID: Schedule.ScheduleDetails[0].DepartureStationID}]
                }
            }
        }).then(async data => {
            console.log("getListSeatSoldDetail: " + JSON.stringify(data));
            let listScheduleDetail = [];
            data.ScheduleDetails.forEach((detail,index,array) => {
                if(detail.DepartureStationID >= Schedule.ScheduleDetails[0].ArrivalStationID){
                    //array.splice(index,1)
                    listScheduleDetail = array.filter(x => {
                        return x.ID != detail.ID;
                    })
                }
                else {
                    listScheduleDetail = array;
                }
            })

            data.ScheduleDetails = listScheduleDetail;
            console.log("getListSeatSoldDetail After: " + JSON.stringify(data));
            var ListTicket = await getListTicketSold(data);
            if(isBreak) {
                var dataFilter = ListTicket.filter(data => {
                    return data.length > 1;
                })
                resolve(dataFilter);
                return;
            }
            else {
                var dataFilter = ListTicket.filter(data => {
                    return data.length > 1;
                })
                var dic = await convertToDictionary(dataFilter);
                console.log("Empty Function: " + dic.isEmpty());
                resolve(dic);
            }
        })
    })
}

function getListTicketSold(Schedule) {
    var ListTicketFilter = [];
    return new Promise(async resolve => {
       await getTrainByID(Schedule.TrainID).then(data => {
            console.log("getTrainByID: " + JSON.stringify(data));
            var hour = parseInt(moment(Schedule.TimeDeparture).subtract(7, 'hour').format('HH'))
            var min = parseInt(moment(Schedule.TimeDeparture).format('mm'))
            console.log("Hour: " + hour);
            console.log("Min: " + min);
            if(Schedule.ScheduleDetails.length === 0) resolve(ListTicketFilter);
            Schedule.ScheduleDetails.forEach(async (detail, index, array) => {
                var check = checkIsSameDepartureStationIDFirst(detail.DepartureStationID, Schedule.ID)
                var date = moment(moment(Schedule.DateDeparture).add(hour, 'hour').subtract(7, "hour").format("YYYY-MM-DD")).add(min, 'minutes');
                if(!check) {
                    date = moment(moment(Schedule.DateDeparture).add(hour, 'hour').subtract(7, "hour").format("YYYY-MM-DD")).add((60 * detail.Time) + min, 'minutes');
                }
                console.log("Date: " + moment(new Date(date)._d));
                await db.Ticket.findAll({
                    attributes: ['ID','SeatID'],
                    where: {
                        DepartureStationID: detail.DepartureStationID,
                        ArrivalStationID: detail.ArrivalStationID,
                        TrainName: data.Name,
                        DepartureDate : date,
                        [Op.or]: [{Status: 1},{Status: 2}]
                    }
                }).then(result => {
                    
                    console.log("DepartureStationID " + index + ": " + detail.DepartureStationID);
                    console.log("ArrivalStationID " + index + ": " + detail.ArrivalStationID);
                    ListTicketFilter.push(result);

                    if(index + 1 === array.length) {
                        console.log("Array.length 2: " + array.length);
                        if(ListTicketFilter.length == array.length)
                        {
                            console.log("ListTicketFilter.length == array.length");
                            resolve(ListTicketFilter);
                        }
                        else {
                            console.log("Call getListTicketSold function again");                       
                            resolve(getListTicketSold(Schedule));
                        }                       
                    }
                })             
            })
        })
    })
}

function convertToDictionary(ListSeatSold){
    console.log("Length ListSeatSold: " + ListSeatSold.length);
    var dic = new bucketjs.Dictionary();
    console.log("ListSeatSold: " + JSON.stringify(ListSeatSold));
    return new Promise(resolve => {
        if(ListSeatSold.length == 0){
            resolve(dic);
        }
        
        ListSeatSold.forEach((ticket,index,array) => {
            ticket.forEach(ticket => {
                db.Seat.findOne({
                    attributes: ['ID'],
                    where: {
                        ID: ticket.SeatID
                    },
                    include:{
                        model: db.SeatType,
                        attributes: ['ID','TypeName']
                    }
                }).then(data => {
                    console.log("Data Search: " + JSON.stringify(data));
                    if(typeof(dic.get(data.SeatType.ID)) == "undefined") {
                        dic.set(data.SeatType.ID, {SeatSold: 1});
                        console.log("Dictionary : " + dic.get(data.SeatType.ID).SeatSold)
                    }
                    else {
                        dic.get(data.SeatType.ID).SeatSold += 1;
                        
                    } 
                    if(index + 1 === array.length) {
                        resolve(dic);
                    }                                  
                })
            }) 
                    
        })
    })
}

function RandomCustomerID(){
    return new Promise(resolve => {
        resolve(parseInt(UUID.genV4().bitFields.clockSeqLow) + parseInt(Math.random() * 10000000));
    })
}


async function checkSeat(trainID, numberOfPassenger, departDate) {
    var Trains = await getListCarriageAndSeat(trainID);
    for (var i = 0; i < Trains[0].Carriages.length; i++) {
        var Tickets = await getListTicketByDepartureDate(departDate, Trains[0].Carriages[i].ID);
        if ((Trains[0].Carriages[i].Seats.length - Tickets.length) > 0 && (Trains[0].Carriages[i].Seats.length - Tickets.length) >= parseInt(numberOfPassenger))
            return true;
    }
    return false;
}

function getAllCarriage() {
    return new Promise(resolve => {
        db.Carriage.findAll({
            attributes: ['ID', 'Name', 'TrainID'],
            include: {
                model: db.Seat,
                attributes: ['SeatTypeID']
            }
        }).then(result => {
            resolve(result);
        })
    })
}

function getAllSeat() {
    return new Promise(resolve => {
        db.Seat.findAll({
            attributes: ['ID', 'CarriageID', 'SeatTypeID', 'SeatNumber'],
        }).then(data => {
            resolve(data);
        })
    })
}

function getListCarriageAndSeat(trainID){
    return new Promise(resolve => {
        db.Train.findAll({
            attributes: ['ID'],
            where: {
                ID: parseInt(trainID)
            },
            include: {
                model: db.Carriage,
                attributes: ['ID'],
                include: {
                    model: db.Seat,
                    attributes: ['ID', 'CarriageID', 'SeatTypeID', 'SeatNumber']
                }
            }
        }).then(Train => {
            resolve(Train);
        })
    })
}

function getListTicketByDepartureDate(departureDate, CarriageID) {
    return new Promise(resolve => {
        db.Ticket.findAll({
            attributes: ['ID'],
            where: {
                DepartureDate: departureDate
            },
            include: {
                model: db.Seat,
                attributes: ['ID', 'CarriageID'],
                where: {
                    CarriageID: CarriageID
                }
            }
        }).then(Ticket => {
            resolve(Ticket);
        })
    })
}

function getStationByID(StationID) {
    return new Promise(resolve => {
        db.Station.findAll({
            attributes: ["ID", "Name"],
            where: {
                ID: StationID
            }
        }).then(Station => {
            resolve(Station);
        })
    })
}

function getTrainByID(TrainID) {
    return new Promise(resolve => {
        db.Train.findOne({
            attributes:["ID","Name"],
            where: {
                ID : TrainID
            },
            include:{
                model: db.Carriage,
                attributes: ['ID']
            }
        }).then(Train => {
            resolve(Train);
        })
    })
}

function getAllSeatType(Train){
    var dic = new bucketjs.Dictionary();
    var pre;
    return new Promise(resolve => {    
       Train.Carriages.forEach((carriage,index,array) => {
            db.Carriage.findOne({
                attributes: ['ID'],
                where : {
                    ID: carriage.ID
                },
                include: {
                    model: db.Seat,
                    attributes: ['ID'],
                    include: {
                        model: db.SeatType,
                        attributes: ['ID','TypeName']
                    }
                }
            }).then(data => {
                console.log("Data Get All Seat Type: " + JSON.stringify(data));
                if(typeof(dic.get(data.Seats[0].SeatType.ID)) != "undefined"){
                    dic.get(data.Seats[0].SeatType.ID).TotalSeat += data.Seats.length;
                }
                else {
                    dic.set(data.Seats[0].SeatType.ID, {SeatTypeName: data.Seats[0].SeatType.TypeName, TotalSeat: data.Seats.length});     
                    console.log("GET: " + dic.get(data.Seats[0].SeatType.ID).SeatTypeName); 
                }   
                
                if(index + 1 === array.length) {
                    resolve(dic);
                }

            })      
    })
    })
    
}

function convertTypeObjectToDictionary(object) {
    return new Promise(resolve => {
        var dic = new bucketjs.Dictionary();
        object.forEach((data, index, array) => {
            dic.set(object.ID, object.TypeObjectName);

            if (index + 1 == array.length) {
                resolve(dic);
            }
        })
    })
}

async function createTableListCustomer(Representative, ListPassenger, ListTicket, PaymentID){
    return new Promise(async resolve => {
        var html = "<!DOCTYPE html> <html> <head> <style> table { font-family: arial, sans-serif; border-collapse: collapse; width: 100%; } td, th { border: 1px solid #dddddd; text-align: left; padding: 8px; } tr:nth-child(even) { background-color: #dddddd; } </style> </head>";
        var bookingInformation = "<body><h1>THANK YOU FOR BOOKING WITH US</h1><h2>Booking Information</h2><div>";
        bookingInformation += "<div><p>Full Name: " + Representative.Name + "</p>" +
        "<p>Booking Code: "  + Representative.ID + "</p>"
        + "<p>Payment ID: " + PaymentID + "</p>"
        + "<p>Passport: " + Representative.Passport + "</p>"
        + "<p style='color:red;'>Note: <span style='font-weight:bold'>PAYMENT ID</span> used to refund money in case of error</p></div>";
        var listCustomer = "<h2>List Customer</h2> <table> <tr><th>Ticket ID</th> <th>Full Name</th> <th>Passport</th> <th>Departure Station</th> <th>Destination Station</th> <th>Price (VND)</th></tr>";
        var DepartureStation = await getStationByID(ListTicket[0].DepartureStationID);
        var DestinationStation = await getStationByID(ListTicket[0].ArrivalStationID);
        ListPassenger.forEach((passenger,index,array) => {
            var ticket = ListTicket.filter(ticket => {
                return ticket.CustomerID == passenger.ID
            })
           
            listCustomer += "<tr>" 
                         +"<td>"+ ticket[0].ID +"</td>"   
                         +"<td>"+ passenger.Name+"</td>"
                         +"<td>"+ passenger.Passport+"</td>"
                         +"<td>"+ DepartureStation[0].Name+"</td>"
                         +"<td>"+ DestinationStation[0].Name+"</td>"
                         +"<td>"+ JSON.stringify(ticket[0].Price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")+"</td>"
                         +"</tr>"           
            if(index + 1 === array.length) {
                listCustomer += "</table></body></html>";
                resolve(html + bookingInformation + listCustomer);
            }
        })
    })
}


module.exports.ChangeStatusTicket = function(req,res){
    db.Ticket.update({
        Status: STATUS["WAITING_CANCEL"],       
    },
    {where: {ID: req.query.TicketID},}).then(data => {
        console.log("Ticket: " + JSON.stringify(data));
        res.end(JSON.stringify({status: 200}))
    })
}
