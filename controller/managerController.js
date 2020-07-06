var { Sequelize, Model, DataTypes, Op } = require('sequelize');
var db = require("../data_access/DataAccess");
var moment = require('moment');
var uuid = require('uuidjs');

var mail = require('nodemailer')
var config = require('../config/common');
const { func } = require('assert-plus');
const { values } = require('lodash');
var transporter = mail.createTransport({
  service: 'gmail',
  auth: {
    user: config.UserName,
    pass: config.Password
  }
});

function SendMail(mail, id, from, to) {
  console.log(mail);
  console.log(from + " " + to);
  var mailOptions = {
    from: 'trainticketonlinevn@gmail.com',
    to: mail,
    subject: 'Cancel ticket confirmation',
    html: `<p>Ticket <strong style="color:red;">${id}</strong> from <strong style="color:red;">${from}</strong> to <strong style="color:red;">${to}</strong> has canceled according to request from you.</p>`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(JSON.stringify(error))
      transporter.sendMail(mailOptions)
    }
    else {
      console.log('Email sent: ' + info.response);
    }
  })
}

module.exports.cancelTicket = async function (req, res) {
  SendMail(req.query.mail, req.query.id, req.query.from, req.query.to);
  db.Ticket.update({
    Status: 3
  }, {
    where: {
      ID: req.query.id,
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

//#region Customer
module.exports.getAllCustomer = function (req, res) {
  db.Customer.findAll({
    include: { all: true }
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

}
module.exports.createScheduleDetail = async function (req, res) {
  let departID = await req.query.DepartureStationID;
  let arrivalID = await req.query.ArrivalStationID;
  let startSta = await db.Station.findByPk(req.query.start);
  let sta = await db.Station.findAll({ raw: true });
  let distance = await Math.abs(parseInt(sta.find(x => x.ID == arrivalID).Distance) - parseInt(sta.find(x => x.ID == departID).Distance));
  let time = moment(req.query.DateDeparture + " " + req.query.TimeDeparture).add(Math.abs(parseInt(sta.find(x => x.ID == departID).Distance - startSta.Distance)) / 60, "hours");

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
  let train = await db.Schedule.findByPk(req.query.ID, { raw: true });
  let list = [];
  let carr = await db.Carriage.findAll({
    attributes: ['ID'],
    where: {
      TrainID: train.TrainID
    },
    raw: true
  });
  console.log(carr.data);
  for (let i = 0; i < carr.length; i++) {
    await db.Seat.findOne({
      where: {
        CarriageID: carr[i].ID
      },
      raw: true
    }).then(r => list.push(r.SeatTypeID))
  };
  let newList = await [...new Set(list)];
  await newList.map(async e => {
    let cost = (await db.SeatType.findByPk(e)).CostPerKm;
    let sche = (await db.ScheduleDetail.findByPk(req.query.ScheduleDetailID)).Length;
    const a = {
      ScheduleID: parseInt(req.query.ScheduleDetailID),
      SeatTypeID: parseInt(e),
      Cost: parseInt(parseInt(cost) * parseInt(sche)),
    }
    db.TableCost.create(a).then(abc => {
      return res.send(abc);

    });
  });

}
module.exports.delSchedule = async function (req, res) {
  let listDetail = await db.ScheduleDetail.findAll({
    where: {
      ScheduleID: req.query.ScheduleID,
    },
    raw: true
  })
  listDetail.map(detail => {
    db.TableCost.destroy({
      where: {
        ScheduleID: detail.ID
      }
    })
  })
  await db.ScheduleDetail.destroy({
    where: {
      ScheduleID: req.query.ScheduleID
    }
  })
  db.Schedule.destroy({
    where: {
      ID: req.query.ScheduleID
    }
  })
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
  else if (seatTypeID == 6) //khoang 6
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
    else if (seatTypeID == 6) //khoang 6
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

module.exports.getListDetail = function (req, res) {
  db.ScheduleDetail.findAll({

  }).then(detail => res.end(JSON.stringify(detail)))
}

module.exports.getListCusBySchedule = async function (req, res) {
  const listCusID = [];
  const sche = await db.ScheduleDetail.findOne({
    where: {
      ID: req.query.scheID,
    }, raw: true,
    include: [db.Schedule]
  });
  const schemain = await db.Schedule.findByPk(await sche.ScheduleID, { raw: true });
  const from = await sche.DepartureStationID;
  const to = await sche.ArrivalStationID;
  const date = await schemain.DateDeparture;
  const ticket = await db.Ticket.findAll({
    where: {
      DepartureStationID: from,
      ArrivalStationID: to,
      DepartureDate: date,
      [Op.or]: [
        { Status: 1 },
        { Status: 2 }
      ]
    },
    raw: true
  });
  res.end(JSON.stringify(await list(ticket)));
}

async function list(ticket) {
  let list = [];
  for (let a of ticket) {
    try {
      let temp = await db.Customer.findByPk(a.CustomerID, { raw: true });
      list.push(temp);
    }
    catch (e) {
      console.log('ok');
    }
  }
  return list;
}
module.exports.getAllScheDetailWithNoCondition = function (req, res) {
  db.ScheduleDetail.findAll({ include: [db.Schedule], raw: true }).then(data => res.end(JSON.stringify(data)))
}

