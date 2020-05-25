var { Sequelize, Model, DataTypes, Op } = require('sequelize');
var db = require("../data_access/DataAccess");
var moment = require('moment');
var uuid = require('uuidjs');


//#region Customer
module.exports.getAllCustomer = function (req, res) {
  db.Customer.findAll({
    include: [db.Representative]
  }).then(cus => {
    res.end(JSON.stringify(cus));
  })
}
module.exports.createCustomer = (req, res) => {
  //Create a customer
  const cus = {
    ID: uuid.genV4().intFields.timeLow,
    Name: req.query.Name,
    Passport: req.query.Passport,
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
module.exports.delCustomerByID = function (req, res) {
  db.Customer.destroy({
    where: { ID: req.query.ID }
  })
}
module.exports.updateCustomer = function (req, res) {
  const cus = {
    Name: req.query.Name,
    Passport: req.query.Passport
  }
  db.Customer.update(cus, {
    where: {
      ID: req.query.ID
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
//#endregion

//#region Station
module.exports.getAllStation = function (req, res) {
  db.Station.findAll().then(sta => {
    res.end(JSON.stringify(sta));
  })
}
module.exports.delStation = function (req, res) {
  db.Station.destroy({
    where: { ID: req.query.ID }
  })
}
//#endregion

//#region Train
module.exports.getAllTrain = function (req, res) {
  db.Train.findAll().then(train => {
    res.end(JSON.stringify(train));
  })
}
module.exports.delTrain = function (req, res) {
  db.Train.destroy({
    where: { ID: req.query.ID }
  })
}
module.exports.updateTrain = function (req, res) {
  const train = {
    Name: req.query.Name
  }
  db.Train.update(train, {
    where: {
      ID: req.query.ID
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
module.exports.getTrainByID = function (req, res) {
  db.Train.findByPk(req.query.ID).then(train => {
    res.end(JSON.stringify(train))
  })
}
module.exports.createTrain = (req, res) => {

  //Create a customer
  const train = {
    ID: uuid.genV4().bitFields.clockSeqLow,
    Name: req.query.Name
  };
  // Save customer in the database
  db.Train.create(train)
    .then(data => {
      res.send(data);
    })

};
//#endregion

//#region Ticket
module.exports.printTicketByRepresentativeId = (req, res) => {
  db.Ticket.findAll({
    include: { all: true }
  }).then(ticket => {
    res.end(JSON.stringify(ticket))
  })
}

module.exports.editStatusTicket = (req, res) => {
  if (req.query.request == "print") {
    db.Ticket.update({
      Status: 2
    }, {
      where: {
        CustomerID: req.query.cusID,
      },

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
  else if (req.query.request == "cancel") {
    db.Ticket.update({
      Status: 3
    }, {
      where: {
        CustomerID: req.query.cusID,
      },

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
}

//#endregion

//#region Schedule
module.exports.getAllSchedule = function (req, res) {
  db.Schedule.findAll({
    include: { all: true },
  }).then(sche => res.end(JSON.stringify(sche)))
}
module.exports.createSchedule = async function (req, res) {
  // const travel = await db.Station.findAll(
  //   {
  //     where: {
  //       ID: {
  //         [Op.between]: [req.query.from, req.query.to]
  //       }
  //     },
  //     raw: true
  //   }
  // );


  var id = parseInt(uuid.genV4().intFields.timeLow.toString().substring(0, 9));
  const schedule = {
    ID: id,
    TrainID: req.query.TrainID,
    DateDeparture: req.query.DateDeparture,
    TimeDeparture: req.query.TimeDeparture,
  };
  db.Schedule.create(schedule).then(r => res.send(r));
  // var shortDistance = 0;
  // var timeStart = moment(req.query.DateDeparture + " " + req.query.TimeDeparture);
  // var i = 1;
  // let tong = 0;
  // let time = "";
  // count = (await db.ScheduleDetail.findAll({ raw: true })).length;
  // travel.forEach(async item => {
  //   let arrival = item.ID;
  //   if (arrival == req.query.from) {
  //     shortDistance = 0;
  //   }
  //   else {
  //     shortDistance = item.Distance - shortDistance;
  //   }
  //   tong = item.Distance;
  //   count++;
  //   const scheduleDetail = {
  //     ID: count,
  //     ScheduleID: id,
  //     DepartureStationID: req.query.from,
  //     ArrivalStationID: item.ID,
  //     StartTime: timeStart.format("HH:mm"),
  //     Length: tong,
  //     Time: (shortDistance / 90).toFixed(2),
  //   };
  //   time = shortDistance / 90;
  //   db.ScheduleDetail.create(scheduleDetail);
  //   timeStart.add(time, "hours");
  //   i++;
  //   shortDistance = item.Distance;
  // });
}
module.exports.createScheduleDetail = async function (req, res) {
  let departID = await req.query.DepartureStationID;
  let arrivalID = await req.query.ArrivalStationID;
  let sta = await db.Station.findAll({ raw: true });
  let distance = 0;
  if (departID > arrivalID) {
    distance = await (parseInt(sta.find(x => x.ID == departID).Distance) - parseInt(sta.find(x => x.ID == arrivalID).Distance));
  }
  else {
    distance = await (parseInt(sta.find(x => x.ID == arrivalID).Distance) - parseInt(sta.find(x => x.ID == departID).Distance));
  }
  let time = moment(req.query.DateDeparture + " " + req.query.TimeDeparture).add(distance / 60, "hours");
  const sche = await {
    ID: parseInt(uuid.genV4().intFields.timeLow.toString().substring(0, 9)),
    ScheduleID: req.query.ScheduleID,
    DepartureStationID: departID,
    ArrivalStationID: arrivalID,
    Length: distance,
    Time: (distance / 60).toFixed(2),
    StartTime: time.format("HH:mm")
  }
  db.ScheduleDetail.create(sche).then(r => res.send(r));
}

module.exports.createTableCost = async function (req, res) {
  let train = await db.Schedule.findOne({
    where: {
      ID: req.query.ID,
    },
    raw: true
  });
  console.log(train.TrainID);
  let carriagetype = await db.Carriage.findAll({ where: { TrainID: train.TrainID }, raw: true });
  let a = [];
  await carriagetype.forEach(e => {

    let seattype = db.Seat.findAll({ where: { CarriageID: e.ID }, raw: true }).then(r => a.push[r]);
  })
  console.log(a);
}
//#endregion

//#region Seat
module.exports.getAllSeat = function (req, res) {
  db.Seat.findAll({
    include: [db.Carriage, db.SeatType]
  }).then(seat => res.end(JSON.stringify(seat)))
}
async function createSeat(carriageID, seatTypeID, seatNum) {
  const seat = await {
    ID: parseInt(uuid.genV4().intFields.timeLow.toString().substring(0, 9)),
    CarriageID: carriageID,
    SeatTypeID: seatTypeID,
    SeatNumber: seatNum
  }
  db.Seat.create(seat);
}
async function delSeat(seatID) {
  db.Seat.destroy({
    where: {
      ID: seatID
    }
  })
}
//#endregion
module.exports.getAllTypeOfSeat = async function (req, res) {
  const d = await db.SeatType.findAll({
    group: ['SeatType.ID', 'SeatType.TypeName', 'SeatType.CostPerKm'],
    attributes: [
      'ID', 'TypeName', 'CostPerKm',
      [
        Sequelize.fn('COUNT', Sequelize.col('Seats.SeatTypeID')), 'Seats'
      ]
    ],
    include: [
      {
        model: db.Seat,
        attributes: []
      }
    ],
    raw: true,
  }).then(seatType => res.end(JSON.stringify(seatType)));
}

module.exports.getAllCarriage = function (req, res) {
  db.Carriage.findAll({
    include: db.Train,
  }).then(carriage => res.end(JSON.stringify(carriage)))
}
module.exports.createCarriage = async function (req, res) {
  const carr = await {
    ID: parseInt(uuid.genV4().intFields.timeLow.toString().substring(0, 9)),
    Name: req.query.Name,
    TrainID: req.query.TrainID
  }
  await db.Carriage.create(carr).then(a => res.send(a));
  let seatTypeID = await req.query.SeatTypeID;
  let seatCount = "";
  if (seatTypeID == 1)//khoang 4
  {
    seatCount = 28;
  }
  else if (seatTypeID == 2) //khoang 6
  {
    seatCount = 42;
  }
  else seatCount = 56;
  for (let i = 1; i <= seatCount; i++) {
    createSeat(carr.ID, seatTypeID, i);
  }
}
module.exports.editCarriage = async function (req, res) {
  const carr = await {
    Name: req.query.Name,
    TrainID: req.query.TrainID
  }
  let seat = await db.Seat.findOne({ where: { CarriageID: req.query.ID }, raw: true });
  await db.Carriage.update(carr, { where: { ID: req.query.ID } }).then(a => res.send(a));
  if (seat != null && seat.SeatTypeID != req.query.SeatTypeID) {
    let allseat = await db.Seat.findAll({ where: { CarriageID: req.query.ID }, raw: true });
    await allseat.forEach(s => {
      db.Seat.destroy({ where: { ID: s.ID } });
    })
    let seatTypeID = await req.query.SeatTypeID;
    let seatCount = "";
    if (seatTypeID == 1)//khoang 4
    {
      seatCount = 28;
    }
    else if (seatTypeID == 2) //khoang 6
    {
      seatCount = 42;
    }
    else seatCount = 56;
    for (let i = 1; i <= seatCount; i++) {
      createSeat(carr.ID, seatTypeID, i);
    }
  }

  // let seatTypeID = await req.query.SeatTypeID;
  // let seatCount = "";
  // if (seatTypeID == 1)//khoang 4
  // {
  //   seatCount = 28;
  // }
  // else if (seatTypeID == 2) //khoang 6
  // {
  //   seatCount = 42;
  // }
  // else seatCount = 56;
  // for (let i = 1; i <= seatCount; i++) {
  //   createSeat(carr.ID, seatTypeID, i);
  // }
}
module.exports.delCarriage = async function (req, res) {
  let carrID = req.query.ID;
  await db.Seat.findAll({
    where: {
      CarriageID: carrID
    },
    raw: true
  }).then(seat => {
    seat.forEach(s => db.Seat.destroy({
      where: {
        ID: s.ID
      }
    }))
  });
  db.Carriage.destroy({
    where: {
      ID: carrID
    }
  });
}
module.exports.getAllRepreBByID = function (req, res) {
  db.Representative.findAll({
    where: {
      ID: req.query.repreID
    },
    group: ['Customers.Name', 'Representative.ID', 'Representative.Name', 'Representative.Phone', 'Representative.Passport', 'Representative.TotalCost', 'Representative.Email', 'Representative.DateBooking'],
    attributes: [
      'ID', 'Name', 'Phone', 'Passport', 'TotalCost', 'Email', 'DateBooking',
      [
        Sequelize.fn('COUNT', Sequelize.col('Customers.RepresentativeID')), 'Customers'
      ]
    ],
    include: [
      {
        model: db.Customer,
        attributes: ['Name']
      }
    ],
    raw: true,
  }).then(repre => res.end(JSON.stringify(repre)))
}

module.exports.getAllScheduleDetail = function (req, res) {
  db.ScheduleDetail.findAll({
    where: {
      ScheduleID: req.query.ScheduleID
    },
  }).then(detail => res.end(JSON.stringify(detail)))
}
