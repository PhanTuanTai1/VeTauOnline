var { Sequelize, Model, DataTypes } = require('sequelize');

Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
    date = this._applyTimezone(date, options);
  
    // Z here means current timezone, _not_ UTC
    // return date.format('YYYY-MM-DD HH:mm:ss.SSS Z');
    return date.format('YYYY-MM-DD');
  };

var sequelize = new Sequelize('TrainTicketDatabase', 'sa', '123456', {
    dialect: 'mssql',
    host: 'localhost',
    port: '57031',
    dialectOptions: {
      options: {
        useUTC: false,
        dateFirst: 1,
      }
    }
})

//1 Train Entity
class Train extends Model{}
Train.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
    'Name' : Sequelize.STRING
},
{ 
    sequelize, 
    modelName: 'Train',
    tableName: 'Train'
});

//2 Carriage Entity
class Carriage extends Model{}
Carriage.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
    'Name' : Sequelize.STRING
},
{ 
    sequelize, 
    modelName: 'Carriage',
    tableName: 'Carriage'
});

//3 Seat Entity
class Seat extends Model{}
Seat.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
},
{ 
    sequelize, 
    modelName: 'Seat',
    tableName: 'Seat'
});

//4 SeatType Entity
class SeatType extends Model{}
SeatType.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
    'TypeName' : Sequelize.STRING
},
{ 
    sequelize, 
    modelName: 'SeatType',
    tableName: 'SeatType'
});

//5 Schedule Entity
class Schedule extends Model{}
Schedule.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
    'DateDeparture' : Sequelize.DATE,
    'TimeDeparture' : Sequelize.TIME
},
{ 
    sequelize, 
    modelName: 'Schedule',
    tableName: 'Schedule'
});

//6 ScheduleDetail Entity
class ScheduleDetail extends Model{}
ScheduleDetail.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
    'Length' : Sequelize.INTEGER,
    'Time' : Sequelize.TIME,
},
{ 
    sequelize, 
    modelName: 'ScheduleDetail',
    tableName: 'ScheduleDetail',
});

//7 Station Entity
class Station extends Model{}
Station.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
    'Name' : Sequelize.STRING
},
{ 
    sequelize, 
    modelName: 'Station',
    tableName: 'Station'
});

//8 Ticket Entity
class Ticket extends Model{}
Ticket.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
    'Price' : Sequelize.FLOAT,
    'DepartureDate' : Sequelize.DATE,
    'DepartureTime' : Sequelize.TIME,
    'TrainName' : Sequelize.STRING,
    'Status' : Sequelize.BOOLEAN
},
{ 
    sequelize, 
    modelName: 'Ticket',
    tableName: 'Ticket'
});

//9 TableCost Entity
class TableCost extends Model{}
TableCost.init({
    'Cost' : Sequelize.FLOAT,
},
{ 
    sequelize, 
    modelName: 'TableCost',
    tableName: 'TableCost'
});

//10 TypeObject Entity
class TypeObject extends Model{}
TypeObject.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
    'TypeObjectName' : Sequelize.STRING
},
{ 
    sequelize, 
    modelName: 'TypeObject',
    tableName: 'TypeObject'
});

//11 Representative Entity
class Representative extends Model{}
Representative.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
    'Email' : Sequelize.STRING,
    'Phone' : Sequelize.STRING,
    'Passport' : Sequelize.STRING,
    'TotalCost' : Sequelize.FLOAT
},
{ 
    sequelize, 
    modelName: 'Representative',
    tableName: 'Representative'
});

//12 Customer Entity
class Customer extends Model{}
Customer.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
    'Name' : Sequelize.STRING,
    'Passport' : Sequelize.STRING,
},
{ 
    sequelize, 
    modelName: 'Customer',
    tableName: 'Customer'
});

Train.hasMany(Carriage,{foreignKey :"TrainID"});
Carriage.hasMany(Seat,{foreignKey :"CarriageID"});
Seat.hasMany(Ticket,{foreignKey:"SeatID"});
Seat.belongsTo(SeatType,{foreignKey:"SeatTypeID"});
Schedule.belongsTo(Train,{foreignKey:"TrainID"});
Schedule.hasMany(ScheduleDetail,{foreignKey:"ScheduleID"});
ScheduleDetail.belongsTo(Station,{foreignKey:"DepartureStationID"});
ScheduleDetail.belongsTo(Station,{foreignKey:"ArrivalStationID"});
ScheduleDetail.belongsTo(Schedule);
TableCost.belongsTo(SeatType,{primaryKey:"SeatTypeID"});
TableCost.belongsTo(ScheduleDetail,{primaryKey:"ScheduleDetailID"});
Representative.hasMany(Customer,{foreignKey:"RepresentativeID"});
Customer.belongsTo(TypeObject,{foreignKey:"TypeObjectID"});
Ticket.belongsTo(Customer,{foreignKey:"CustomerID"});
Ticket.belongsTo(Seat,{foreignKey: "SeatID"});

module.exports.Train = Train;
module.exports.Carriage = Carriage;
module.exports.Seat = Seat;
module.exports.Schedule = Schedule;
module.exports.ScheduleDetail = ScheduleDetail;
module.exports.TableCost = TableCost;
module.exports.Representative = Representative;
module.exports.Customer = Customer;
module.exports.Ticket = Ticket;
module.exports.TypeObject = TypeObject;
module.exports.Station = Station;
module.exports.SeatType = SeatType;

