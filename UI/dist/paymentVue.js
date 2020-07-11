new Vue({
    el: '#app',
    created: async function(){
        if(document.getElementById('SeatID2') != null){
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
    mounted: function(){
        document.body.style['overflow'] = "scroll";
        document.getElementById('waiting_overlay').style['display'] = "none";
    },
    data: {
        station: null,
        seatType: null,
        seatType2: null,
        hrefDeparture: localStorage.getItem('departure'),
        hrefPassengers: localStorage.getItem('passenger'),
        checkbox: null,
        checkbox1: null
    },
    methods: {
        displaySeatTypeName: function(){
            document.getElementById('seatType').innerHTML = this.seatType.SeatType.TypeName;
            if(this.seatType2 != null){
                document.getElementById('seatType2').innerHTML = this.seatType2.SeatType.TypeName;
            }
        },
        displayArrivalStation: function(){
            var data = this.station.filter(data => {
                return data.ID == document.getElementById('ArrivalStationID').value;
            })
            var data2;
            if(document.getElementById('ArrivalStationID2') != null){
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
            if(document.getElementById('DepartureStationID2') != null){
                data2 = this.station.filter(data => {
                    return data.ID == document.getElementById('DepartureStationID2').value;
                })
                document.getElementById('DepartureID2').innerHTML = data2[0].Name
            }
            document.getElementById('DepartureID').innerHTML = data[0].Name
        },
        Redirect: function() {
            //alert(document.getElementById("checkbox"));
            if(document.getElementById("check-confirm-termofuse").checked && document.getElementById("check-confirm-cancellation").checked) {
                location.href = '/RedirectToNganLuong';
            }
            else {
                $("#errors").modal({
                    fadeDuration: 100
                });
            }
        }
    }
})