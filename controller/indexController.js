var { Sequelize, Model, DataTypes } = require('sequelize');
var db = require("../data_access/DataAccess");
var moment = require('moment');
var bucketjs = require('../node_modules/buckets-js/dist/buckets');

module.exports.index = function(req,res) {
    db.Station.findAll({
        attributes:["ID","Name"]
    }).then(station =>{       
        station = station;
        res.end(JSON.stringify(station));
    })
}

module.exports.train = function(req,res){
    db.Train.findAll({
        attributes:["ID","Name"]
    }).then(train =>{
        train = train;
        res.end(JSON.stringify(train));
    })
}

module.exports.search =  function(req,res){
    console.log(req.query);
    
    if(typeof(req.query.ONE_WAY) != "undefined"){
        db.Schedule.findAll({
            attributes: ['ID','DateDeparture','TimeDeparture','TrainID'],
            where:{
                DateDeparture: req.query.DEPART
            },
            include:[{
                model: db.ScheduleDetail,
                attributes: ['ID','ScheduleID','DepartureStationID', 'ArrivalStationID','Time'],
                where:{
                    DepartureStationID: parseInt(req.query.FROM),
                    ArrivalStationID: parseInt(req.query.TO)
                }
            }],
        }).then(Schedule => {   
            // console.log(JSON.stringify(Schedule));
            if(Schedule.length === 0) {
                res.render('searchResultOneWay',{result : [], query: JSON.stringify(req.query)});
                res.end();
            }     
            var result = [];
            var count = 0;
            Schedule.forEach((schedule, index, array ) => {     

                checkSeat(schedule.TrainID,req.query.PASSENGERS, req.query.DEPART).then(check =>{
                    if(check){
                        result.push(schedule);                   
                    }           
                    if(index + 1 === array.length){
                        if(result.length === 0) {
                            res.render('searchResultOneWay',{result : JSON.stringify(result), query: JSON.stringify(req.query)});
                        }
                        else {
                            res.render('searchResultOneWay',{result : JSON.stringify(Schedule), query: JSON.stringify(req.query)});
                        }
                    }
                });                
            })          
        })      
    }   
}

module.exports.scheduleDetail = function(req,res) {
    db.Schedule.findAll({
        attributes: ['ID','TrainID','TimeDeparture','DateDeparture'],
        where: {
            ID: req.query.SCHEDULEID,
            TrainID: req.query.TRAINID
        },
        include:[{
            model: db.ScheduleDetail,
            attributes: ['ID','DepartureStationID','ArrivalStationID','Length','Time'],
            where:{
                DepartureStationID: parseInt(req.query.DepartID),
                ArrivalStationID: parseInt(req.query.ArrivalID)
            },
            include:[{
                model: db.TableCost,
                attributes: ['SeatTypeID','Cost',"ScheduleID"]
            }]
        }]
    }).then(async result => {
        var DepartureStation = await getStationByID(result[0].ScheduleDetails[0].DepartureStationID);
        var ArrivalStation = await getStationByID(result[0].ScheduleDetails[0].ArrivalStationID);
        var Train = await getTrainByID(result[0].TrainID);
        var dic = await getAllSeatType();
        console.log(dic.get(1));
        console.log(req.query.query);
        res.render('scheduleDetail', 
            {result: result, 
            departureStation: DepartureStation, 
            arrivalStation: ArrivalStation, 
            train: Train, 
            moment: moment, 
            dic: dic, 
            ONE_WAY: req.query.ONE_WAY, 
            PASSENGERS: req.query.PASSENGERS, 
            SCHEDULEID: req.query.SCHEDULEID,
            TrainID:  req.query.TRAINID,
            SCHEDULEDETAILID: result[0].ScheduleDetails[0].ID});
    })
}

module.exports.getFirstCost = function(req,res){
    console.log(req.query.ScheduleID);
    db.TableCost.findOne({
        attributes: ['Cost'],
        where: {
            ScheduleID: req.query.ScheduleID
        }
    }).then(cost =>{
        res.end(JSON.stringify(cost));
    })
}

module.exports.getAllSeatType = function(req,res){
    db.SeatType.findAll({
        attributes: ['ID','TypeName']
    }).then(seatType =>{
        res.end(JSON.stringify(seatType));
    })
}

module.exports.passenger = function(req,res){
    db.Schedule.findOne({
        attributes: ['ID','TrainID','DateDeparture','TimeDeparture'],
        where: {
            ID: parseInt(req.query.SCHEDULEID)
        },
        include:[{
            model: db.ScheduleDetail,
            attributes: ['ID', 'DepartureStationID', 'ArrivalStationID', 'Length', 'Time'],
            where: {
                ID: parseInt(req.query.SCHEDULEDETAILID)
            },
            include: [{
                model: db.TableCost,
                attributes: ['ScheduleID','SeatTypeID','Cost'],
                where: {
                    SeatTypeID: parseInt(req.query.costID)
                }
            }]
        }]
    }).then(result => {
        console.log(JSON.stringify(result));
        res.render('passengers', {result: result, moment: moment, SeatTypeID: req.query.costID})
    })
}

module.exports.getAllCarriage = function(req,res) {
    getAllCarriage().then(data => {
        res.end(JSON.stringify(data));
    });
    
}

module.exports.getAllTypeObject = function(req,res){
    db.TypeObject.findAll({
        attributes: ['ID','TypeObjectName']
    }).then(data =>{
        res.end(JSON.stringify(data));
    })
}

module.exports.getListSeatSold = function(req,res){
    
    db.Ticket.findAll({
        attributes: ['SeatID'],
        where: {
            DepartureDate : JSON.parse(req.query.dateDepart)
        }
    }).then(data => {
        res.end(JSON.stringify(data));
    })
}

module.exports.getAllSeat = function(req,res){
    getAllSeat().then(data => {
        res.end(JSON.stringify(data));
    })
}
async function checkSeat(trainID, numberOfPassenger, departDate){
    var Trains = await getListCarriageAndSeat(trainID);
    for(var i = 0; i < Trains[0].Carriages.length; i++){
        var Tickets = await getListTicketByDepartureDate(departDate, Trains[0].Carriages[i].ID);  
        console.log(Tickets.length);
        console.log(Trains[0].Carriages[i].Seats.length);
        if((Trains[0].Carriages[i].Seats.length - Tickets.length) > 0 && (Trains[0].Carriages[i].Seats.length - Tickets.length) >= parseInt(numberOfPassenger)) 
            return true;  
    }   
    return false;
}

function getAllCarriage(){
    return new Promise(resolve => {
        db.Carriage.findAll({
            attributes: ['ID','Name','TrainID']
    }).then(result => {       
        resolve(result);
    })})
}

function getAllSeat(){
    return new Promise(resolve => {
        db.Seat.findAll({
            attributes: ['ID','CarriageID','SeatTypeID','SeatNumber'],
        }).then(data => {
            resolve(data);
        })
    })
}
function getListCarriageAndSeat(trainID){
    return new Promise(resolve => {
        db.Train.findAll({
        attributes: ['ID'],
        where:{
            ID: parseInt(trainID)
        },
        include:{
            model: db.Carriage,
            attributes: ['ID'],
            include:{
                model: db.Seat,
                attributes: ['ID','CarriageID','SeatTypeID','SeatNumber']
            }
        }
    }).then(Train => {       
        resolve(Train);
    })})
}

function getListTicketByDepartureDate(departureDate, CarriageID){
    return new Promise(resolve => {
        db.Ticket.findAll({
        attributes: ['ID'],
        where:{
            DepartureDate: departureDate
        },
        include: {
            model: db.Seat,
            attributes: ['ID','CarriageID'],
            where:{
                CarriageID : CarriageID
            }
        }      
    }).then(Ticket => {       
        resolve(Ticket);
    })})
}

function getStationByID(StationID){
    return new Promise(resolve => {
        db.Station.findAll({
            attributes:["ID","Name"],
            where: {
                ID : StationID
            }
        }).then(Station =>{
            resolve(Station);
        })
    })  
}

function getTrainByID(TrainID){
    return new Promise(resolve => {
        db.Train.findAll({
            attributes:["ID","Name"],
            where: {
                ID : TrainID
            }
        }).then(Train =>{
            resolve(Train);
        })
    })  
}

function getAllSeatType(){
    return new Promise(resolve => {
        db.SeatType.findAll({
            attributes: ['ID','TypeName']
        }).then(seatType =>{
            var dic = new bucketjs.Dictionary();
            seatType.forEach((seat, index, array) =>{
                dic.set(seat.ID, seat.TypeName);
    
                if(index + 1 == array.length) {
                    resolve(dic);
                }
            })
        })
    })
}

function convertTypeObjectToDictionary(object){
    return new Promise(resolve => {
        var dic = new bucketjs.Dictionary();
        object.forEach((data,index,array) => {
            dic.set(object.ID, object.TypeObjectName);

            if(index + 1 == array.length){
                resolve(dic);
            }
        })
    })
}