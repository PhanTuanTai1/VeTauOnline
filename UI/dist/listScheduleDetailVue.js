new Vue({
    el: "#app",
    created: async function(){
        
        await axios.get('/getAllSeatType').then(res => {
            this.seatType = res.data;
        })
        await axios.get('/getAllStation').then(res => {
            
            this.station = res.data;
            this.result = JSON.parse(document.getElementById('result').value);
            this.schedule = JSON.parse(document.getElementById('scheduleParent').value);
            this.tempData = this.result;
        })
        this.SetSeatType();
    },
    updated: function() {
        
        if(this.listStation) {
            //alert(JSON.stringify(this.listStation))
            $("#table_id").DataTable();
        }
        document.getElementById('waiting_overlay').style['display'] = "none";
    },
    data: {
        seatType: [],
        result: null,
        station: null,
        tempData: [],
        schedule: null,
    },
    methods: {
        StationName: function(ID){ 
            var result = this.listStation.filter(data => {
                return data.ID == ID;
            })
            
            return result[0].Name;
        },
        SetHref: function(){

        },
        SelectType: function(typeID, typeName) {
            //alert(JSON.stringify(this.result));
            document.getElementById("typeID").value = typeID;
            document.getElementById('typeSelected').innerHTML = typeName;
            this.result.forEach((data,index,array) => {
                var tableCostTemp = data.TableCosts.filter(cost => {
                    return cost.SeatTypeID == typeID;
                })
                
                this.tempData[index].TableCosts = tableCostTemp;
            })
            
            this.result = JSON.parse(document.getElementById('result').value);
            //alert(JSON.stringify(this.result))
        },
        SetSeatType: function(){
            this.result[0].TableCosts.forEach((cost,index,array) => {
                if(cost.SeatTypeID != this.seatType[index].ID) {
                    this.seatType.splice(index,1);
                }
            })
        },
        FormatTime: function(Time) {
            return moment(Time).subtract(7, 'hour').format('LT');
        },
        GetDateDeparture: function(StartTime, DepartureStationID) {
            var beforeSchedule = this.result.filter(scheduleDetail => {
                return scheduleDetail.ArrivalStationID == DepartureStationID;
            }) 

            if(StartTime == this.schedule.TimeDeparture){
                //alert(this.schedule.DateDeparture);
                return moment(this.schedule.DateDeparture).format('DD-MM-YYYY');
            }
            else {
                //return "";
                var hour = parseInt(moment(this.schedule.TimeDeparture).subtract(7, 'hour').format('HH'));
                var min = parseInt(moment(this.schedule.TimeDeparture).format('mm'));
                return moment(this.schedule.DateDeparture).add(60 * beforeSchedule.Time + min, 'minutes').add(hour, 'hour').format('DD-MM-YYYY');
            }
        },
        GetDateDepartureQuery: function(StartTime, DepartureStationID) {
            var beforeSchedule = this.result.filter(scheduleDetail => {
                return scheduleDetail.ArrivalStationID == DepartureStationID;
            }) 

            if(StartTime == this.schedule.TimeDeparture){
                //alert(this.schedule.DateDeparture);
                return new Date(moment(this.schedule.DateDeparture));
            }
            else {
                //return "";
                var hour = parseInt(moment(this.schedule.TimeDeparture).subtract(7, 'hour').format('HH'));
                var min = parseInt(moment(this.schedule.TimeDeparture).format('mm'));
                return new Date(moment(this.schedule.DateDeparture).add(60 * beforeSchedule.Time + min, 'minutes').add(hour, 'hour'));
            }
        },
        increasePassager: function(ID){
            //alert(ID);
            if(document.getElementById(ID).value < 6) {
                var bookingOnline = document.getElementById('bookingOnline')
                var href = bookingOnline.getAttribute('data-href') + document.getElementById(ID).value;
                bookingOnline.setAttribute('href', href);
            }
        },
    },
    computed: {
        listScheduleDetail(){
            return this.tempData
        },
        listStation() {
            return this.station
        }
    }
})