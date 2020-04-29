function select(element){
    vm.selectSeat(element);
}
function change(element){
    // diagram_cell train-block selectable selected
    // diagram_cell train-block available
    var carriageSelected = document.getElementsByName('carriageSelected')[0];
    var activeDiv = document.getElementsByName('activeDiv')[0];
    var parentSeatID = $(element).attr('data-parent');
    document.getElementById(parentSeatID).style['z-index'] = -1;
    carriageSelected.setAttribute('class', 'diagram_cell train-block available');    
    carriageSelected.removeAttribute('name');
    $(element).attr('class', 'diagram_cell train-block selectable selected')
    $(element).attr('name', 'carriageSelected')
    // $(element).attr('id', 'transform: translate3d(0px, -10px, 0px); transition: all 0.8s ease 0s;')
    activeDiv.setAttribute('style', 'transform: translate3d(0px, 300px, 0px); transition: all 0.8s ease 0s');
    activeDiv.removeAttribute('name');
    document.getElementById('carriage_' + $(element).attr('id')).setAttribute('style', 'transform: translate3d(0px, 0px, 0px); transition: all 0.8s ease 0s');
    document.getElementById('carriage_' + $(element).attr('id')).setAttribute('name', 'activeDiv');
    document.getElementById("parentSeat" + $(element).attr('id')).style['z-index'] = 99;
}

var vm = new Vue({
    el: "#app",
    created: async function(){
       this.total = document.getElementById('number').value;
       this.result = await JSON.parse(document.getElementById('result').value);
       if(typeof(document.getElementById('result2')) != "undefined" && document.getElementById('result2') != null)
            this.result2 = JSON.parse(document.getElementById('result2').value);
       await axios.get('/getAllTrain').then(res => {
           this.train = res.data;
       })
       
       
       await axios.get('/getListCarriage').then(res =>{
           this.listCarriage = res.data;
       })
       await axios.get('/getListSeat').then(res =>{
           this.listSeat = res.data;
       })
       await axios.get('/getAllStation').then(res =>{
           this.station = res.data;
       })
       
       axios.get('/getAllSeatType').then(res =>{
           this.seatType = res.data;
       })
       axios.get('/getAllTypeObject').then(res =>{
           this.typeObject = res.data;
       })
       await axios.get('/getListSeatSold?dateDepart=' + document.getElementById('dateDepart').value).then(res => {          
           this.seatSold = res.data;
       })

       await this.setCarriageDisplay();
       this.numberPass = new Array();
       
       for(var i = 0; i < this.total;i++){
           this.numberPass.push({'index': i + 1});
       }
       this.setTrainName(this.result, 1);
       if(typeof(this.result2)  != "undefined" && this.result2 != null) this.setTrainName(this.result2, 2);
       this.setStationName(this.result, 1);
       if(typeof(this.result2)  != "undefined" && this.result2 != null) this.setStationName(this.result2, 2);
       this.loadSeat();
       this.listSelected = new Array();
    },
    data:{
        train: [],
        seatType: [],
        typeObject: [],
        seatSold: [],
        listCarriage: [],
        station: [],
        listSeat: [],
        numberPass: null,
        total: null,
        result: null,
        result2: null,
        carriageDisplay: null,
        listSelected: null
    },

    methods:{
        setTrainName:async function(result, index){
            var train = this.train.filter(train => {
                return train.ID == result.TrainID
            })
            document.getElementById('trainName'+ index).innerHTML = train[0].Name;

            var object = document.getElementsByClassName('hiddenTrain' + index);
            for(var i = 0; i < object.length; i++){
                object[i].innerHTML = train[0].Name;
            }
        },

        setStationName: function(result, index){
            var depart = this.station.filter(station => {
                return station.ID == result.ScheduleDetails[0].DepartureStationID
            })
            var arrival = this.station.filter(station => {
                return station.ID == result.ScheduleDetails[0].ArrivalStationID
            })
                document.getElementById('parentDepart' + index).innerHTML = depart[0].Name;
                document.getElementById('subDepart' + index).innerHTML = depart[0].Name;
                document.getElementById('hiddenDepart' + index).innerHTML = depart[0].Name;
                document.getElementById('summaryDepart' + index).innerHTML = depart[0].Name;
                document.getElementById('parentArrival' + index).innerHTML = arrival[0].Name;
                document.getElementById('subArrival' + index).innerHTML = arrival[0].Name;
                document.getElementById('hiddenArrival' + index).innerHTML = arrival[0].Name;
                document.getElementById('summaryArrival' + index).innerHTML = arrival[0].Name;
            
        },
        selectedType: function(object, object2, id, typeName){
            document.getElementById(object).innerHTML = typeName;
            document.getElementById(object2).value = id;
        },
        setCarriageDisplay : function(){
            this.result = JSON.parse(document.getElementById('result').value);
            var result = this.listCarriage.filter(data => {
                return data.TrainID == this.result.TrainID && data.Seats[0].SeatTypeID == this.result.ScheduleDetails[0].TableCosts[0].SeatTypeID
            })
            this.carriageDisplay = result;
        },

        loadSeat: function(){
            this.listCarriage.forEach(element => {
                var object = document.getElementsByName('carriage_' + element.ID);
                for(var i = 0; i < object.length - 1;i++){
                    var seat =  this.listSeat.filter(seat => {
                        return seat.SeatNumber == object[i].firstChild.innerHTML && seat.CarriageID == element.ID;
                    })
                    var result = this.seatSold.filter(data => {
                        return data.SeatID == seat[0].ID;
                    })

                    if(result.length > 0){
                        object[i].setAttribute('class','train_cell seat can_block soft_seat_right sold_out');
                        object[i].setAttribute('style','pointer-events: none;');
                    }
                    object[i].setAttribute('id' , seat[0].ID);
                }
            });
        },
        getListSeatByCarriageID: function(carriageID){
            var result = this.listSeat.filter(seat => {
                return seat.CarriageID === carriageID;
            })
        },

        selectSeat: function(element){
            if($(element).attr('class') == 'train_cell seat can_block soft_seat_right sold_out') return;

            if($(element).attr('class') == "train_cell seat can_block soft_seat_right available"){
                if(this.numberPass.length > this.listSelected.length){
                    $(element).attr('class','train_cell seat can_block soft_seat_right selected');
                    // alert($(element).attr('name') + "_" + $(element).children().html());
                    this.listSelected.push($(element).attr('name') + "_" + $(element).children().html() + '_' +  $(element).attr('id'));
                }else {
                    alert("Vượt quá số lượng");
                }
            }
            else {
                $(element).attr('class','train_cell seat can_block soft_seat_right available');
                var filteredItems  = this.listSelected.filter(data => {
                    return data != ($(element).attr('name') + "_" + $(element).children().html() + '_' +  $(element).attr('id'));
                })
                this.listSelected = filteredItems;
            }
        },

        submitForm: function(){
            var formData = new FormData();
            
            var ListPassenger = new Array();
            for(var i = 0; i < this.numberPass.length;i++){
                var fullName = document.getElementById('passenger_' + (i + 1) + '_first_name').value + " "
                                + document.getElementById('passenger_' + (i + 1) + '_last_name').value

                var Passenger = {
                    "Name" : fullName,
                    "Passport" : document.getElementById('passenger_' + (i + 1) + '_passport').value,
                    "TypeObject" : document.getElementById('TypeObjectID' + (i + 1)).value
                }

                ListPassenger.push(Passenger);
            }
            
            var Representative = {
                "FullName" : document.getElementById('book_full_name').value,
                "Passport" : document.getElementById('book_passport').value,
                "Email" : document.getElementById('book_email').value,
                "Phone": document.getElementById('book_phone').value
            }    

            var ListSeat = new Array();
            for(var i = 0; i < this.listSelected.length; i++){
                var object = this.listSelected[i].split("_");
                ListSeat.push({
                    "CarriageID" : object[1],
                    "SeatNumber": object[2],
                    'ID' : object[3]
                })
            }
            var train = this.train.filter(train => {
                return train.ID == this.result.TrainID
            })
            var TicketInfo = {
                "DepartureDate" : this.result.DateDeparture,
                "DepartureTime" : this.result.TimeDeparture,
                "Price" : this.result.ScheduleDetails[0].TableCosts[0].Cost,
                "DepartureStationID" : this.result.ScheduleDetails[0].DepartureStationID,
                "ArrivalStationID" : this.result.ScheduleDetails[0].ArrivalStationID,
                "TrainName" : train[0].Name,
            }
            
            var data = {
                'ListPassenger' : ListPassenger,
                'Representative' : Representative,
                'ListSeat' : ListSeat,
                'TicketInfo': TicketInfo
            }

            axios.post('/createInfomation', {
                data: data,
                header: {'Content-Type' : 'application/json'}
            }).then(res => {
                location.href  = res.data;
            })
        }
    }
})