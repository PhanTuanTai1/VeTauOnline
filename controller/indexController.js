var { Sequelize, Model, DataTypes } = require('sequelize');
var db = require("../data_access/DataAccess");
var encode = require("punycode");

module.exports.index = function(req,res) {
    db.Station.findAll({
        attributes:["ID","Name"],
        tableName : "Station"
    }).then(station =>{       
        res.end();
    })
}