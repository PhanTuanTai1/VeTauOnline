var { Sequelize, Model, DataTypes, Op } = require('sequelize');
var db = require("../data_access/DataAccess");
var STATUS = {
    "NOTPRINT": "1",
    "PRINTED": "2",
    "CANCEL": "3",
    "WAITING_CANCEL" : "4"
}

module.exports.GetAllSchedule = function (req, res) {
    db.Schedule.findAll({
        attributes: ["ID", "DateDeparture", "TimeDeparture", "TrainID"]
    }).then(ListSchedule => {
        res.end(JSON.stringify(ListSchedule));
    })
}