var { Sequelize, Model, DataTypes } = require('sequelize');
var db = require("../data_access/DataAccess");



module.exports.index = function(req,res) {
    db.Station.findAll({
        attributes:["ID","Name"],
        tableName : "Station"
    }).then(station =>{           
        res.end(JSON.jsFriendlyJSONStringify(station));
    })
}