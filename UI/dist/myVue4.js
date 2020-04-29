new Vue({
    el: '#app',
    created: async function(){
        if(typeof(document.getElementById('SeatID2')) != "undefined"){
            await axios.get('/getSeatTypeBySeatID?SeatID=' + document.getElementById('SeatID2').value).then(res => {
                this.seatType2 = res.data;              
            })
        }

        await axios.get('/getSeatTypeBySeatID?SeatID=' + document.getElementById('SeatID').value).then(res => {
            this.seatType = res.data;
            
        })

        await axios.get('/getAllStation').then(res => {
            this.station = res.data;
        })
        
        this.displaySeatTypeName();
        this.displayArrivalStation();
        this.displayDepartureStation();
    },
    data: {
        station: null,
        seatType: null,
        seatType2: null
    },
    methods: {
        displaySeatTypeName: function(){
            document.getElementById('seatType').innerHTML = this.seatType.SeatType.TypeName;
            alert(JSON.stringify(this.seatType2))
            if(this.seatType2 != null){
                document.getElementById('seatType2').innerHTML = this.seatType2.SeatType.TypeName;
            }
        },
        displayArrivalStation: function(){
            var data = this.station.filter(data => {
                return data.ID == document.getElementById('ArrivalStationID').value;
            })
            var data2;
            if(typeof(document.getElementById('ArrivalStationID2')) != "undefined"){
                data2 = this.station.filter(data => {
                    return data.ID == document.getElementById('ArrivalStationID2').value;
                })
                document.getElementById('ArrivalID2').innerHTML = data2[0].Name
            }
            document.getElementById('ArrivalID').innerHTML = data[0].Name
        },
        displayDepartureStation: function(){
            var data = this.station.filter(data => {
                return data.ID == document.getElementById('DepartureStationID').value;
            })
            var data2;
            if(typeof(document.getElementById('DepartureStationID2')) != "undefined"){
                data2 = this.station.filter(data => {
                    return data.ID == document.getElementById('DepartureStationID2').value;
                })
                document.getElementById('DepartureID2').innerHTML = data2[0].Name
            }
            document.getElementById('DepartureID').innerHTML = data[0].Name
        }
    }
})