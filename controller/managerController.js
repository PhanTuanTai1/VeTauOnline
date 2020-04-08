var { Sequelize, Model, DataTypes } = require('sequelize');
var db = require("../data_access/DataAccess");
var moment = require('moment');
//#region Customer
module.exports.getAllCustomer = function (req, res) {
    db.Customer.findAll({
    }).then(cus => {
        res.end(JSON.stringify(cus));
    })
}
module.exports.createCustomer = (req, res) => {
    // Validate request
    if (!req.query.Name) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
   
    //Create a customer
    const cus = {
      ID:req.query.ID,
      Name:req.query.Name,
      Passport:req.query.Passport,
      RepresentativeID: req.query.RepresentativeID,
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
module.exports.delStation = function(req,res){
  db.Station.destroy({
      where: { ID:req.query.ID}
  })
}
//#endregion

//#region Train
module.exports.getAllTrain = function (req, res) {
    db.Train.findAll().then(train => {
        res.end(JSON.stringify(train));
    })
}
module.exports.delTrain = function(req,res){
  db.Train.destroy({
      where: { ID:req.query.ID}
  })
}
module.exports.createTrain = (req, res) => {
  // Validate request
  if (!req.query.Name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
 
  //Create a customer
  const train = {
    ID:req.query.ID,
    Name:req.query.Name
  };
  // Save customer in the database
  db.Train.create(train)
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
//#endregion
