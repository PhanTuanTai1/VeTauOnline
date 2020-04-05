var { Sequelize, Model, DataTypes } = require('sequelize');
var db = require("../data_access/DataAccess");
var moment = require('moment');

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
        moment(req.query.DEPART).format('YYYY-MM-DD')
        db.Schedule.findAll({
            attributes: ['ID','DateDeparture','TrainID'],
            where:{
                DateDeparture: req.query.DEPART
            },
            include:[{
                model: db.ScheduleDetail,
                attributes: ['ID','ScheduleID','DepartureStationID', 'ArrivalStationID'],
                where:{
                    DepartureStationID: parseInt(req.query.FROM),
                    ArrivalStationID: parseInt(req.query.TO)
                }
            }],
        }).then(Schedule => {   
            if(Schedule.length === 0) {
                res.render('searchResultOneWay',{result : []});
                res.end();
            }     
            var result = [];
            var count = 0;
            Schedule.forEach((schedule, index, array ) => {
                checkSeat(schedule.TrainID,req.query.PASSENGERS, moment(req.query.DEPART).format('YYYY-MM-DD')).then(check =>{
                    console.log(check);
                    if(check){
                        result.push(schedule)
                    }
                    count++;
                    if(count === array.length){
                        if(result.length === 0) {
                            res.render('searchResultOneWay',{result : JSON.stringify(result)});
                        }
                        else {
                            res.render('searchResultOneWay',{result : JSON.stringify(Schedule)});
                        }
                    }
                });                
            })          
        })      
    }   
}

module.exports.scheduleDetail = function(req,res) {
    db.Schedule.findAll({
        attributes: ['ID','TrainID'],
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
                attributes: ['SeatTypeID','Cost']
            }]
        }]
    }).then(async result => {
        var DepartureStation = await getStationByID(result[0].ScheduleDetails[0].DepartureStationID);
        var ArrivalStation = await getStationByID(result[0].ScheduleDetails[0].ArrivalStationID);
        var Train = await getTrainByID(result[0].TrainID);
        console.log(JSON.stringify(DepartureStation));
        console.log(JSON.stringify(ArrivalStation));
        // console.log(JSON.stringify(Train));
        // console.log(JSON.stringify(result));
        res.render('scheduleDetail', 
            {result: result, departureStation: DepartureStation, arrivalStation: ArrivalStation, train: Train});
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
                attributes: ['ID','CarriageID','SeatTypeID'],
                as: "Seats"
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