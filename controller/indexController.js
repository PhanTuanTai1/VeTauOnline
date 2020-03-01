var { Sequelize, Model, DataTypes } = require('sequelize');
var db = require("../data_access/DataAccess");
var formidable = require("formidable");

module.exports.index = function(req,res) {
    db.Station.findAll({
        attributes:["ID","Name"]
    }).then(station =>{       
        res.end();
    })
}

module.exports.searchSchedule = function(req,res){

    let form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files){
        var departureStationID = fields.departureStation;
        var arrivalStationID = fields.arrivalStation;
        var departureDate = fields.departureDate;
        var numberOfPassenger = fields.numberOfPassenger;

        // console.log(fields);
        // console.log(departureStationID);
        // console.log(arrivalStationID);

        db.ScheduleDetail.findAll({
            attributes: ['ID','ScheduleID'],
            where: {
                DepartureStationID : departureStationID, 
                ArrivalStationID : arrivalStationID
            },
            include:{
                model: db.Schedule,
                attributes: ['ID','TrainID','DateDeparture','TimeDeparture'],
                
            }
        }).then(ScheduleDetail => {

            console.log(JSON.stringify(ScheduleDetail));

            // ScheduleDetail.forEach(element => {
            //     console.log(JSON.stringify());
            // });
        })
    })     
}