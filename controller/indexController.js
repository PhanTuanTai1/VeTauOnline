var { Sequelize, Model, DataTypes } = require('sequelize');
var db = require("../data_access/DataAccess");
var formidable = require("formidable");

module.exports.index = function(req,res) {
    db.Station.findAll({
        attributes:["ID","Name"]
    }).then(station =>{       
        res.end(JSON.stringify(station));
    })
}

module.exports.train = function(req,res){
    db.Train.findAll({
        attributes:["ID","Name"]
    }).then(train =>{
        res.end(JSON.stringify(train));
    })
}
// module.exports.searchSchedule = function(req,res){

//     let form = new formidable.IncomingForm();

//     form.parse(req, function(err, fields, files){
//         var departureStationID = fields.departureStation;
//         var arrivalStationID = fields.arrivalStation;
//         var departureDate = fields.departureDate;
//         var numberOfPassenger = fields.numberOfPassenger;

//         // console.log(fields);
//         // console.log(departureStationID);
//         // console.log(arrivalStationID);

//         db.ScheduleDetail.findAll({
//             attributes: ['ID','ScheduleID'],
//             where: {
//                 DepartureStationID : departureStationID, 
//                 ArrivalStationID : arrivalStationID
//             },
//             include:{
//                 model: db.Schedule,
//                 attributes: ['ID','TrainID','DateDeparture','TimeDeparture'],
                
//             }
//         }).then(ScheduleDetail => {

//             console.log(JSON.stringify(ScheduleDetail));

//             // ScheduleDetail.forEach(element => {
//             //     console.log(JSON.stringify());
//             // });
//         })
//     })     
// }

module.exports.search =  function(req,res){
    console.log(req.query);
    
    if(typeof(req.query.ONE_WAY) != "undefined"){
        var departDate = new Date(parseInt(req.query.DEPART));
        console.log(departDate.toISOString());
        db.Schedule.findAll({
            attributes: ['ID','DateDeparture','TrainID'],
            where:{
                DateDeparture: departDate
            },
            include:[{
                model: db.ScheduleDetail,
                attributes: ['DepartureStationID', 'ArrivalStationID'],
                where:{
                    DepartureStationID: parseInt(req.query.FROM),
                    ArrivalStationID: parseInt(req.query.TO)
                }
            }],
        }).then(Schedule => {        
            console.log(Schedule);   
            var result = [];
            var count = 0;
            Schedule.forEach((schedule, index, array )=> {
                checkSeat(schedule.TrainID,req.query.PASSENGERS, departDate).then(check =>{
                    console.log(check);
                    if(check){
                        result.push({
                            "TrainID": schedule.ID,
                            "DepartureStationID": schedule.ScheduleDetails[0].DepartureStationID,
                            "ArrivalStationID": schedule.ScheduleDetails[0].ArrivalStationID,
                        })
                    }
                    count++;
                    if(count === array.length){
                        if(result.length == 0) {
                            res.render('searchResultOneWay',{result : JSON.stringify(result)});
                        }
                        res.render('searchResultOneWay',{result : JSON.stringify(Schedule)});
                    }
                });                
            })
            res.render('searchResultOneWay', {result : {"status": "404"}});
        })
    }
}

async function checkSeat(trainID, numberOfPassenger, departDate){
    var Trains = await getListCarriageAndSeat(trainID);
    for(var i = 0; i < Trains[0].Carriages.length; i++){
        var Tickets = await getListTicketByDepartureDate(departDate, Trains[0].Carriages[i].ID);  
        // console.log(Trains[0].Carriages[i].Seats.length);
        // console.log(Tickets.length);
        // console.log(numberOfPassenger);
        // console.log((Trains[0].Carriages[i].Seats.length < Tickets.length));
        if((Trains[0].Carriages[i].Seats.length - Tickets.length) > 0 && (Trains[0].Carriages[i].Seats.length - Tickets.length) >= parseInt(numberOfPassenger)) return true;  
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