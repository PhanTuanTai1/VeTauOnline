new Vue({
    el: '#app',
    created: async function(){
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
    },
    methods: {
        displaySeatTypeName: function(){
            document.getElementById('seatType').innerHTML = this.seatType.SeatType.TypeName;
        },
        displayArrivalStation: function(){
            var data = this.station.filter(data => {
                return data.ID == document.getElementById('ArrivalStationID').value;
            })
            document.getElementById('ArrivalID').innerHTML = data[0].Name
        },
        displayDepartureStation: function(){
            var data = this.station.filter(data => {
                return data.ID == document.getElementById('DepartureStationID').value;
            })
            document.getElementById('DepartureID').innerHTML = data[0].Name
        }
    }
})