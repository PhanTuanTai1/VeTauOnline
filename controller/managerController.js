var { Sequelize, Model, DataTypes } = require('sequelize');
var db = require("../data_access/DataAccess");
var moment = require('moment');
//#region Customer
module.exports.getAllCustomer = function (req, res) {
    db.Customer.findAll({
        // include: [{
        //     model: db.Representative
        // }]
    }).then(cus => {
        res.end(JSON.stringify(cus));
    })
}
//#endregion

//#region Station
module.exports.getAllStation = function (req, res) {
    db.Station.findAll().then(sta => {
        res.end(JSON.stringify(sta));
    })
}
//#endregion

//#region Train
module.exports.getAllTrain = function (req, res) {
    db.Train.findAll().then(train => {
        res.end(JSON.stringify(train));
    })
}
//#endregion
