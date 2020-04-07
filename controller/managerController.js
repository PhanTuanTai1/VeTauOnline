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
module.exports.createCustomer = (req, res) => {
    // Validate request
    if (!req.query) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Create a customer
    const cus = {
      Name:req.query.Name
    };
  
    // Save customer in the database
    db.Customer.create(cus)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the customer."
        });
      });
  };
module.exports.delCustomerByID = function(req,res){
    db.Customer.destroy({
        where: { ID:req.query.ID}
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
