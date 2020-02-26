var Sequelize = require('sequelize');
var sequelize = new Sequelize('TrainTicketDatabase', 'sa', '79495291', {
    dialect: 'mssql',
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
    modelName: 'Train'
});

//2 Carriage Entity
class Carriage extends Model{}
Carriage.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
    'Name' : Sequelize.STRING
},
{ 
    sequelize, 
    modelName: 'Carriage'
});

//3 Seat Entity
class Seat extends Model{}
Seat.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
},
{ 
    sequelize, 
    modelName: 'Seat'
});

//4 SeatType Entity
class SeatType extends Model{}
SeatType.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
    'TypeName' : Sequelize.STRING
},
{ 
    sequelize, 
    modelName: 'SeatType'
});

//5 Schedule Entity
class Schedule extends Model{}
SeatType.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
    'DateDeparture' : Sequelize.DATE,
    'TimeDeparture' : Sequelize.TIME
},
{ 
    sequelize, 
    modelName: 'Schedule'
});

//6 ScheduleDetail Entity
class ScheduleDetail extends Model{}
SeatType.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
    'Length' : Sequelize.INTEGER,
    'Time' : Sequelize.Time,
},
{ 
    sequelize, 
    modelName: 'ScheduleDetail'
});

//7 Station Entity
class Station extends Model{}
SeatType.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
    'Name' : Sequelize.STRING,
},
{ 
    sequelize, 
    modelName: 'Station'
});

//8 Ticket Entity
class Ticket extends Model{}
SeatType.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
    'Price' : Sequelize.FLOAT,
    'DepartureDate' : Sequelize.DATE,
    'DepartureTime' : Sequelize.TIME,
    'TrainName' : Sequelize.STRING,
    'Status' : Sequelize.BOOLEAN
},
{ 
    sequelize, 
    modelName: 'Ticket'
});

//9 TableCost Entity
class TableCost extends Model{}
SeatType.init({
    'Cost' : Sequelize.FLOAT,
},
{ 
    sequelize, 
    modelName: 'TableCost'
});

//10 TypeObject Entity
class TypeObject extends Model{}
SeatType.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
    'TypeObjectName' : Sequelize.STRING
},
{ 
    sequelize, 
    modelName: 'TypeObject'
});

//11 Representative Entity
class Representative extends Model{}
SeatType.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
    'Email' : Sequelize.STRING,
    'Phone' : Sequelize.STRING,
    'Passport' : Sequelize.STRING,
    'TotalCost' : Sequelize.FLOAT
},
{ 
    sequelize, 
    modelName: 'Representative'
});

//12 Customer Entity
class Customer extends Model{}
SeatType.init({
    'ID' : {type: Sequelize.INTEGER,primaryKey: true},
    'Name' : Sequelize.STRING,
    'Passport' : Sequelize.STRING,
},
{ 
    sequelize, 
    modelName: 'Customer'
});

Train.hasMany(Carriage,{foreignKey :"TrainID"});
Carriage.hasMany(Seat,{foreignKey :"CarriageID"});
Seat.hasMany(Ticket,{foreignKey:"SeatID"});
Seat.belongsTo(SeatType,{foreignKey:"SeatTypeID"});
Schedule.belongsTo(Train,{foreignKey:"TrainID"});
Schedule.hasMany(ScheduleDetail,{foreignKey:"ScheduleID"});
ScheduleDetail.belongsTo(Station,{foreignKey:"DepartureStationID"});
ScheduleDetail.belongsTo(Station,{foreignKey:"ArrivalStationID"});
TableCost.belongsTo(SeatType,{primaryKey:"SeatTypeID"});
TableCost.belongsTo(ScheduleDetail,{primaryKey:"ScheduleDetailID"});
Representative.hasMany(Customer,{foreignKey:"RepresentativeID"});
Customer.belongsTo(TypeObject,{foreignKey:"TypeObjectID"});
Ticket.belongsTo(Customer,{foreignKey:"CustomerID"});


