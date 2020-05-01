var { Sequelize, Model, DataTypes } = require('sequelize');
var db = require("../data_access/DataAccess");
var moment = require('moment');
var uuid = require('uuidjs');
//#region Customer
module.exports.getAllCustomer = function (req, res) {
    db.Customer.findAll({
    }).then(cus => {
        res.end(JSON.stringify(cus)); 
    })
}
module.exports.createCustomer = (req, res) => {
    //Create a customer
    const cus = {
      ID:uuid.genV4().intFields.timeLow,
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
module.exports.updateTrain = function(req,res){
  const train ={
    Name : req.query.Name
  }
  db.Train.update(train,{
    where:{
      ID:req.query.ID
    }
  }).then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the customer."
    });
  });
}
module.exports.getTrainByID = function(req,res){
  db.Train.findByPk(req.query.ID).then(train=>{
    res.end(JSON.stringify(train))
  })
}
module.exports.createTrain = (req, res) => {
 
  //Create a customer
  const train = {
    ID:uuid.genV4().bitFields.clockSeqLow,
    Name:req.query.Name
  };
  // Save customer in the database
  db.Train.create(train)
    .then(data => {
      res.send(data);
    })
   
};
//#endregion

//#region Ticket
module.exports.printTicketByRepresentativeId = (req,res) => {
  db.Ticket.findAll().then(ticket=>{
    res.end(JSON.stringify(ticket))
  })
}

//#endregion
