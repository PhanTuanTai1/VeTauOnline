var { Sequelize, Model, DataTypes, Op } = require('sequelize');
var db = require("../data_access/DataAccess");
var moment = require('moment');
var bucketjs = require('../node_modules/buckets-js/dist/buckets');
var formidable = require('formidable');
var UUID = require('uuidjs');
var md5 = require('md5');
var Duration = require("duration");
var STATUS = {
    "NOTPRINT": "1",
    "PRINTED": "2",
    "CANCEL": "3"
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
                attributes: ['ID', 'ScheduleID', 'DepartureStationID', 'ArrivalStationID', 'Time'],
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
            console.log("ListSchedule: " + JSON.stringify(ListSchedule));
            var result = [];
            var count = 0;
            res.render('searchResultOneWay', { result: JSON.stringify(ListSchedule), query: JSON.stringify(req.query) });
            // ListSchedule.forEach((schedule, index, array ) => {     
            //     res.render('searchResultOneWay',{result : JSON.stringify(Schedule), query: JSON.stringify(req.query)});
            //     // checkSeat(schedule.TrainID,req.query.PASSENGERS, req.query.DEPART).then(check =>{
            //     //     if(check){
            //     //         result.push(schedule);                   
            //     //     }           
            //     //     if(index + 1 === array.length){
            //     //         if(result.length === 0) {
            //     //             res.render('searchResultOneWay',{result : JSON.stringify(result), query: JSON.stringify(req.query)});
            //     //         }
            //     //         else {
            //     //             res.render('searchResultOneWay',{result : JSON.stringify(Schedule), query: JSON.stringify(req.query)});
            //     //         }
            //     //     }
            //     // });                
            // })          
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
            where: {
                DateDeparture: date
            },
            include: [{
                model: db.ScheduleDetail,
                attributes: ['ID', 'ScheduleID', 'DepartureStationID', 'ArrivalStationID', 'Time'],
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
                res.render('searchResultRoundTrip', { result: JSON.stringify(ListSchedule), query: JSON.stringify(req.query), STEP: 1 });
            }
            else {
                var data = { 'SCHEDULEID': req.query.SCHEDULEID, 'SCHEDULEDETAILID': req.query.SCHEDULEDETAILID, 'costID': req.query.costID }
                res.cookie('step1', data)
                res.render('searchResultRoundTrip', { result: JSON.stringify(ListSchedule), query: JSON.stringify(req.query), STEP: 2, DepartureQuery: req.query.DepartureQuery });
            }
            // ListSchedule.forEach((schedule, index, array ) => {     

            //     checkSeat(schedule.TrainID,req.query.PASSENGERS, req.query.DEPART).then(check =>{
            //         if(check){
            //             result.push(schedule);                   
            //         }           
            //         if(index + 1 === array.length){
            //             if(result.length === 0) {
            //                 if(typeof(req.query.STEP) == "undefined"){
            //                     res.render('searchResultRoundTrip',{result : JSON.stringify(result), query: JSON.stringify(req.query),STEP: 1});
            //                 }
            //                 else {
            //                     var data = {'SCHEDULEID': req.query.SCHEDULEID, 'SCHEDULEDETAILID': req.query.SCHEDULEDETAILID, 'costID': req.query.costID}
            //                     res.cookie('step1', data)
            //                     res.render('searchResultRoundTrip',{result : JSON.stringify(result), query: JSON.stringify(req.query),STEP: 2, DepartureQuery: req.query.DepartureQuery});
            //                 }
            //             }
            //             else {
            //                 if(typeof(req.query.STEP) == "undefined"){
            //                     res.render('searchResultRoundTrip',{result : JSON.stringify(result), query: JSON.stringify(req.query),STEP: 1});
            //                 }
            //                 else {
            //                     var data = {'SCHEDULEID': req.query.SCHEDULEID, 'SCHEDULEDETAILID': req.query.SCHEDULEDETAILID, 'costID': req.query.costID}
            //                     res.cookie('step1', data)
            //                     res.render('searchResultRoundTrip',{result : JSON.stringify(result), query: JSON.stringify(req.query),STEP: 2, DepartureQuery: req.query.DepartureQuery});
            //                 }
            //             }
            //         }
            //     });                
            // })          
        })
    }
}

function getScheduleMatch(Date, DepartureID, ListSchedule) {
    var ListFilter = [];
    return new Promise(resolve => {
        ListSchedule.forEach(async (schedule, index, array) => {
            var TimeScheduleDetails = parseInt(schedule.ScheduleDetails[0].Time * 60 + (array.length * 15));
            var TimeDepartInt = parseInt(moment(schedule.TimeDeparture).format('hh'));
            var MinutesDepartInt = parseInt(moment(schedule.TimeDeparture).format('mm'));
            var DateDepart = moment(schedule.DateDeparture).add(TimeDepartInt, 'hour').add(MinutesDepartInt + TimeScheduleDetails, 'minutes').format('DD-MM-YYYY');
            var DateDepartFormat = (moment(Date).subtract(7, 'hour').format('DD-MM-YYYY'));
            console.log("Expected:" + moment(Date).subtract(7, 'hour').format('DD-MM-YYYY'));
            console.log("Actual:" + DateDepart);
            if (DateDepartFormat === DateDepart) {
                ListFilter.push(schedule)
            }
            else {
                await checkIsDepartureStationFirst(DepartureID, schedule).then(data => {
                    if (data) {
                        ListFilter.push(schedule)
                    }
                });
            }
            if (index + 1 === array.length) resolve(ListFilter);
        })
    });
}

function checkIsDepartureStationFirst(DepartureID, Schedule) {
    return new Promise(resolve => {
        db.Schedule.findOne({
            attributes: ['ID'],
            where: {
                ID: Schedule.ID
            },
            include: {
                model: db.ScheduleDetail,
                attributes: ['ID', 'DepartureStationID']
            }
        }).then(data => {
            console.log(JSON.stringify(data));
            if (data.ScheduleDetails[0].DepartureStationID == DepartureID) resolve(true);
            else resolve(false);
        })
    });
}
module.exports.scheduleDetail = function (req, res) {
    db.Schedule.findAll({
        attributes: ['ID', 'TrainID', 'TimeDeparture', 'DateDeparture'],
        where: {
            ID: req.query.SCHEDULEID,
            TrainID: req.query.TRAINID
        },
        include: [{
            model: db.ScheduleDetail,
            attributes: ['ID', 'DepartureStationID', 'ArrivalStationID', 'Length', 'Time'],
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
        var dic = await getAllSeatType();
        var getListSeatSold = await getListSeatSoldDetail(result[0])
        var data = JSON.parse(req.query.Query);

        if (typeof (req.query.ONE_WAY) != "undefined") {
            res.render('scheduleDetail',
                {
                    result: result,
                    departureStation: DepartureStation,
                    arrivalStation: ArrivalStation,
                    train: Train,
                    moment: moment,
                    duration: Duration,
                    dic: dic,
                    ONE_WAY: req.query.ONE_WAY,
                    PASSENGERS: req.query.PASSENGERS,
                    DEPART: data.DEPART,
                    FROM: data.FROM,
                    TO: data.TO,
                    SCHEDULEID: req.query.SCHEDULEID,
                    TrainID: req.query.TRAINID,
                    SCHEDULEDETAILID: result[0].ScheduleDetails[0].ID,
                    query: req.query.Query
                });
        }
        else if (typeof (req.query.ROUND_TRIP) != "undefined" && req.query.STEP == 2) {
            res.render('scheduleDetail',
                {
                    result: result,
                    departureStation: DepartureStation,
                    arrivalStation: ArrivalStation,
                    train: Train,
                    moment: moment,
                    dic: dic,
                    ROUND_TRIP: req.query.ROUND_TRIP,
                    PASSENGERS: req.query.PASSENGERS,
                    DEPART: data.DEPART,
                    RETURN: data.RETURN,
                    FROM: data.FROM,
                    TO: data.TO,
                    SCHEDULEID: req.query.SCHEDULEID,
                    TrainID: req.query.TRAINID,
                    SCHEDULEDETAILID: result[0].ScheduleDetails[0].ID,
                    STEP: 2,
                    query: req.query.Query
                });
        }
        else {
            res.render('scheduleDetail',
                {
                    result: result,
                    departureStation: DepartureStation,
                    arrivalStation: ArrivalStation,
                    train: Train,
                    moment: moment,
                    dic: dic,
                    ROUND_TRIP: req.query.ROUND_TRIP,
                    PASSENGERS: req.query.PASSENGERS,
                    DEPART: data.DEPART,
                    RETURN: data.RETURN,
                    FROM: data.FROM,
                    TO: data.TO,
                    SCHEDULEID: req.query.SCHEDULEID,
                    TrainID: req.query.TRAINID,
                    SCHEDULEDETAILID: result[0].ScheduleDetails[0].ID,
                    STEP: req.query.STEP,
                    DepartureQuery: data,
                    query: req.query.Query
                });
        }
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
                    query: req.query.Query
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
                query: req.query.Query
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
        attributes: ['ID', 'TypeObjectName']
    }).then(data => {
        res.end(JSON.stringify(data));
    })
}

module.exports.getListSeatSold = function (req, res) {
    db.Ticket.findAll({
        attributes: ['SeatID'],
        where: {
            DepartureDate: JSON.parse(req.query.dateDepart)
        }
    }).then(data => {
        res.end(JSON.stringify(data));
    })
}

module.exports.getAllSeat = function (req, res) {
    getAllSeat().then(data => {
        res.end(JSON.stringify(data));
    })
}

module.exports.createSession = function (req, res) {
    var Representative = req.body.data.Representative;
    var ListPassenger = req.body.data.ListPassenger;
    var ListSeat = req.body.data.ListSeat;
    var ListSeat2;
    var TicketInfo = req.body.data.TicketInfo
    var TicketInfo2;
    var RepresentativeID = parseInt(UUID.genV4().bitFields.clockSeqLow) + parseInt(Math.random() * 10000000);
    var total = TicketInfo.Price * ListPassenger.length;

    if (typeof (req.body.data.TicketInfo2) != "undefined") {
        TicketInfo2 = req.body.data.TicketInfo2;
        total += TicketInfo2.Price * ListPassenger.length
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

        CreateListPassengerModel(ListPassenger, RepresentativeID).then(data => {
            CreateTicket(data, TicketInfo, ListSeat).then(data2 => {
                TicketInfo.PassengerQuantity = data.length;
                TicketInfo.SeatID = data2[0].SeatID;
                res.cookie('data', RepresentativeModel, { maxAge: 600000 }); // Representative
                res.cookie('data2', data, { maxAge: 600000 }); // ListPassenger
                res.cookie('data3', data2, { maxAge: 600000 }); // Ticket
                res.cookie('data4', TicketInfo, { maxAge: 600000 });
                CreateTicket(data, TicketInfo2, ListSeat2).then(data3 => {
                    TicketInfo2.PassengerQuantity = data.length;
                    TicketInfo2.SeatID = data3[0].SeatID;
                    res.cookie('data5', data3, { maxAge: 600000 }); // Ticket 2
                    res.cookie('data6', TicketInfo2, { maxAge: 600000 });
                    res.end('/payment');
                })
            })
        });
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
        console.log(JSON.stringify(TicketInfo));
        CreateListPassengerModel(ListPassenger, RepresentativeID).then(data => {
            CreateTicket(data, TicketInfo, ListSeat).then(data2 => {
                TicketInfo.PassengerQuantity = data.length;
                TicketInfo.SeatID = data2[0].SeatID;
                res.cookie('data', RepresentativeModel, { maxAge: 600000 }); // Representative
                res.cookie('data2', data, { maxAge: 600000 }); // ListPassenger
                res.cookie('data3', data2, { maxAge: 600000 }); // Ticket
                res.cookie('data4', TicketInfo, { maxAge: 600000 });
                res.end('/payment');
            })
        });
    }


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
    var url = 'https://sandbox.nganluong.vn:8088/nl35/checkout.php?';
    url += 'merchant_site_code=48847&';
    url += 'return_url=http://localhost:3000/paymentSuccess&';
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
    var secure_code = md5(48847 + ' ' + 'http://localhost:3000/paymentSuccess' + ' ' + 'phantuantai1234@gmail.com' + ' ' + 'thanhtoantienvetau' + ' '
        + req.cookies.data.ID + ' ' + req.cookies.data.TotalCost + ' ' + 'vnd' + ' ' + 1 + ' ' + 0 + ' ' + 0 + ' ' + 0 + ' '
        + 0 + ' ' + 1 + ' ' + 1 + ' ' + 1 + ' ' + '3fb19dfe9df59a63b23ca36069c3aea5')
    url += 'secure_code=' + secure_code;
    res.redirect(url);
}

module.exports.InsertData = function (req, res) {
    //console.log(req.cookies);
    var Representative = req.cookies.data;
    var ListPassenger = req.cookies.data2;
    var ListTicket = req.cookies.data3;
    console.log("req.query:" + JSON.stringify(req.query));
    var ListTicket2;
    if (typeof (req.cookies.data5) != undefined) {
        ListTicket2 = req.cookies.data5;
    }

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
function CreateListPassengerModel(ListPassenger, RepresentativeID) {
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
        ListPassengerModel.forEach((data, index) => {
            var ID = parseInt(UUID.genV4().bitFields.clockSeqLow) + parseInt(Math.random() * 10000000);

            var TicketModel = db.Ticket.build({
                'ID': ID,
                'CustomerID': data.ID,
                'SeatID': ListSeat[index].ID,
                'DepartureDate': TicketInfo.DepartureDate,
                'DepartureTime': TicketInfo.DepartureTime,
                'Price': TicketInfo.Price,
                'Status': STATUS["NOTPRINT"],
                'DepartureStationID': TicketInfo.DepartureStationID,
                'ArrivalStationID': TicketInfo.ArrivalStationID,
                'TrainName': TicketInfo.TrainName
            })
            ListTicketInfo.push(TicketModel);
        })
        resolve(ListTicketInfo);
    })
}

function getListSeatSoldDetail(Schedule) {
    return new Promise(resolve => {
        db.Schedule.findOne({
            attributes: ['ID', 'DateDeparture', 'TrainID'],
            where: {
                ID: Schedule.ID
            },
            include: {
                model: db.ScheduleDetail,
                attributes: ['ID', 'DepartureStationID', 'ArrivalStationID'],
                where: {
                    Time: {
                        [Op.gt]: Schedule.ScheduleDetails[0].Time
                    }
                }
            }
        }).then(async data => {
            var ListTicket = await getListTicketSold(data);
            console.log(JSON.stringify(ListTicket));
            resolve(ListTicket);
        })
    })
}

function getListTicketSold(Schedule) {
    var ListTicketFilter = [];
    return new Promise(resolve => {
        getTrainByID(Schedule.TrainID).then(data => {
            console.log(JSON.stringify(data));
            Schedule.ScheduleDetails.forEach((detail, index, array) => {
                db.Ticket.findAll({
                    attributes: ['ID', 'SeatID'],
                    where: {
                        DepartureDate: Schedule.DateDeparture,
                        DepartureStationID: detail.DepartureStationID,
                        ArrivalStationID: detail.ArrivalStationID,
                        TrainName: data[0].Name
                    }
                }).then(result => {
                    ListTicketFilter.push(result);

                    if (index + 1 === array.length) {
                        resolve(ListTicketFilter);
                    }
                })
            })
        })
    })
}

function RandomCustomerID() {
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
function getListCarriageAndSeat(trainID) {
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
        db.Train.findAll({
            attributes: ["ID", "Name"],
            where: {
                ID: TrainID
            }
        }).then(Train => {
            resolve(Train);
        })
    })
}

function getAllSeatType() {
    return new Promise(resolve => {
        db.SeatType.findAll({
            attributes: ['ID', 'TypeName'],
        }).then(seatType => {
            var dic = new bucketjs.Dictionary();
            seatType.forEach((seat, index, array) => {
                dic.set(seat.ID, seat.TypeName);

                if (index + 1 == array.length) {
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