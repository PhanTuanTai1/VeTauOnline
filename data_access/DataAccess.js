var { Sequelize, Model, DataTypes } = require('sequelize');
var moment = require('moment');
Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
    date = this._applyTimezone(date, options);
  
    // Z here means current timezone, _not_ UTC
    // return date.format('YYYY-MM-DD HH:mm:ss.SSS Z');
    return moment(date).format('YYYY-MM-DD');
  };

var sequelize = new Sequelize('TrainTicketDatabase', 'sa', '123456', {
    dialect: 'mssql',
    host: 'localhost',
    port: '57031'
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
    tableName: 'Train',
    timestamps: false,
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
    tableName: 'Carriage',
    timestamps: false,
});

//3 Seat Entity
class Seat extends Model{}
Seat.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
    'SeatNumber' : Sequelize.INTEGER
},
{ 
    sequelize, 
    modelName: 'Seat',
    tableName: 'Seat',
    timestamps: false,
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
    tableName: 'SeatType',
    timestamps: false,
});

//5 Schedule Entity
class Schedule extends Model{}
Schedule.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
    'DateDeparture' : Sequelize.DATE,
    'TimeDeparture' : Sequelize.STRING
},
{ 
    sequelize, 
    modelName: 'Schedule',
    tableName: 'Schedule',
    timestamps: false,
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
    timestamps: false,
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
    tableName: 'Station',
    timestamps: false,
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
    tableName: 'Ticket',
    timestamps: false,
});

//9 TableCost Entity
class TableCost extends Model{}
TableCost.init({
    'ScheduleID' : {type: Sequelize.INTEGER, primaryKey: true},
    'SeatTypeID' : {type: Sequelize.INTEGER, primaryKey: true},
    'Cost' : Sequelize.FLOAT,
},
{ 
    sequelize, 
    modelName: 'TableCost',
    tableName: 'TableCost',
    timestamps: false,
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
    tableName: 'TypeObject',
    timestamps: false,
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
    tableName: 'Representative',
    timestamps: false,
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
    tableName: 'Customer',
    timestamps: false,
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
TableCost.belongsTo(SeatType,{foreignKey:"ID"});
TableCost.belongsTo(ScheduleDetail,{foreignKey:"ID"});
Representative.hasMany(Customer,{foreignKey:"RepresentativeID"});
Customer.belongsTo(Representative,{foreignKey:"ID"});
Customer.belongsTo(TypeObject,{foreignKey:"TypeObjectID"});
Ticket.belongsTo(Customer,{foreignKey:"CustomerID"});
Ticket.belongsTo(Seat,{foreignKey: "SeatID"});
ScheduleDetail.hasMany(TableCost,{foreignKey:"ScheduleID"})

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

