function select(element, number){
    vm.selectSeat(element, number);
}
function change(element, number){
    // diagram_cell train-block selectable selected
    // diagram_cell train-block available
    var carriageSelected = document.getElementsByName('carriageSelected' + number)[0];
    var activeDiv = document.getElementsByName('activeDiv' + number)[0];
    var parentSeatID = $(element).attr('data-parent');
    document.getElementById(parentSeatID).style['z-index'] = -1;
    carriageSelected.setAttribute('class', 'diagram_cell train-block available');    
    carriageSelected.removeAttribute('name');
    $(element).attr('class', 'diagram_cell train-block selectable selected')
    $(element).attr('name', 'carriageSelected' + number)
    // $(element).attr('id', 'transform: translate3d(0px, -10px, 0px); transition: all 0.8s ease 0s;')
    activeDiv.setAttribute('style', 'transform: translate3d(0px, 300px, 0px); transition: all 0.8s ease 0s');
    activeDiv.removeAttribute('name');
    document.getElementById('carriage_' + $(element).attr('id')).setAttribute('style', 'transform: translate3d(0px, 0px, 0px); transition: all 0.8s ease 0s');
    document.getElementById('carriage_' + $(element).attr('id')).setAttribute('name', 'activeDiv' + number);
    document.getElementById("parentSeat" + $(element).attr('id')).style['z-index'] = 99;
}

var vm = new Vue({
    el: "#app",
    created: async function(){
       this.total = document.getElementById('number').value;
       this.result = JSON.parse(document.getElementById('result').value);

       if(typeof(document.getElementById('result2')) != "undefined" && document.getElementById('result2') != null){
            this.result2 = JSON.parse(document.getElementById('result2').value);
       }
            
            
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
       
       await axios.get('/getListSeatSold?dateDepart=' + JSON.stringify(this.result.DateDeparture)).then(res => {          
           this.seatSold = res.data;
       })
    
       if(typeof(this.result2) != "undefined" && this.result2 != null) {
            await axios.get('/getListSeatSold?dateDepart=' + JSON.stringify(this.result2.DateDeparture)).then(res => {          
                this.seatSold2 = res.data;
            })
       }

       await this.setCarriageDisplay();
       if(typeof(this.result2)  != "undefined" && this.result2 != null) await this.setCarriageDisplay2();
       this.numberPass = new Array();
       
       for(var i = 0; i < this.total;i++){
           this.numberPass.push({'index': i + 1});
       }
       this.setTrainName(this.result, 1);
       if(typeof(this.result2)  != "undefined" && this.result2 != null){
            this.setTrainName(this.result2, 2);
       }

       this.setStationName(this.result, 1);

       if(typeof(this.result2)  != "undefined" && this.result2 != null){
            this.setStationName(this.result2, 2);
       }

       this.loadSeat(this.carriageDisplay, this.seatSold);
      
       if(typeof(this.result2) != "undefined" && this.result2 != null) {
        this.loadSeat(this.carriageDisplay2, this.seatSold2);
       }
       
       this.listSelected = new Array();
       this.listSelected2 = new Array();
       localStorage.setItem('passenger', location.href)
    },
    data:{
        train: [],
        seatType: [],
        typeObject: [],
        seatSold: [],
        seatSold2: [],
        listCarriage: [],
        station: [],
        listSeat: [],
        numberPass: null,
        total: null,
        result: null,
        result2: null,
        carriageDisplay: null,
        carriageDisplay2: null,
        listSelected: null,
        listSelected2: null,
        hrefDeparture: localStorage.getItem('departure'),
        hrefReturn: localStorage.getItem('return')
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
            var result = this.listCarriage.filter(data => {
                return data.TrainID == this.result.TrainID && data.Seats[0].SeatTypeID == this.result.ScheduleDetails[0].TableCosts[0].SeatTypeID
            })

            this.carriageDisplay = result;
        },

        setCarriageDisplay2 : function(){
            var result = this.listCarriage.filter(data => {
                return data.TrainID == this.result2.TrainID && data.Seats[0].SeatTypeID == this.result2.ScheduleDetails[0].TableCosts[0].SeatTypeID
            })

            this.carriageDisplay2 = result;
        },

        loadSeat: function(listCarriage, seatSold){
            listCarriage.forEach(element => {
                var object = document.getElementsByName('carriage_' + element.ID);

                for(var i = 0; i < object.length - 1;i++){
                    var seat =  this.listSeat.filter(seat => {
                        return seat.SeatNumber == object[i].firstChild.innerHTML && seat.CarriageID == element.ID;
                    })
                    var result = seatSold.filter(data => {
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

        selectSeat: function(element, number){
            if($(element).attr('class') == 'train_cell seat can_block soft_seat_right sold_out') return;

            if($(element).attr('class') == "train_cell seat can_block soft_seat_right available")
            {
                if(number == 1 && this.numberPass.length > this.listSelected.length){
                    $(element).attr('class','train_cell seat can_block soft_seat_right selected');

                    this.listSelected.push($(element).attr('name') + "_" + $(element).children().html() + '_' +  $(element).attr('id'));
                }
                else if(number == 2 && this.numberPass.length > this.listSelected2.length){
                    $(element).attr('class','train_cell seat can_block soft_seat_right selected');

                    this.listSelected2.push($(element).attr('name') + "_" + $(element).children().html() + '_' +  $(element).attr('id'));
                }
                else 
                {
                    alert("Vượt quá số lượng");
                }
            }
            else {
                if(number == 1) {
                    $(element).attr('class','train_cell seat can_block soft_seat_right available');
                var filteredItems  = this.listSelected.filter(data => {
                    return data != ($(element).attr('name') + "_" + $(element).children().html() + '_' +  $(element).attr('id'));
                })
                this.listSelected = filteredItems;
                }
                else if(number == 2){
                    $(element).attr('class','train_cell seat can_block soft_seat_right available');
                    var filteredItems  = this.listSelected2.filter(data => {
                        return data != ($(element).attr('name') + "_" + $(element).children().html() + '_' +  $(element).attr('id'));
                    })
                    this.listSelected2 = filteredItems;
                }
            }
        },

        submitForm: function(){
            var formData = new FormData();
            var data;
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

            var ListSeat2 = new Array();
            if(typeof(this.result2) != "undefined" && this.result2 != null){
                for(var i = 0; i < this.listSelected2.length; i++){
                    var object = this.listSelected2[i].split("_");
                    ListSeat2.push({
                        "CarriageID" : object[1],
                        "SeatNumber": object[2],
                        'ID' : object[3]
                    })
                }
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
            var TicketInfo2;
            if(typeof(this.result2) != "undefined" && this.result2 != null){
                var train2 = this.train.filter(train => {
                    return train.ID == this.result2.TrainID
                })
                
                TicketInfo2 = {
                    "DepartureDate" : this.result2.DateDeparture,
                    "DepartureTime" : this.result2.TimeDeparture,
                    "Price" : this.result2.ScheduleDetails[0].TableCosts[0].Cost,
                    "DepartureStationID" : this.result2.ScheduleDetails[0].DepartureStationID,
                    "ArrivalStationID" : this.result2.ScheduleDetails[0].ArrivalStationID,
                    "TrainName" : train2[0].Name,
                }
                data = {
                    'ListPassenger' : ListPassenger,
                    'Representative' : Representative,
                    'ListSeat' : ListSeat,
                    'ListSeat2' : ListSeat2,
                    'TicketInfo': TicketInfo,
                    'TicketInfo2' : TicketInfo2
                }
            }
            else 
            {
                data = {
                    'ListPassenger' : ListPassenger,
                    'Representative' : Representative,
                    'ListSeat' : ListSeat,
                    'TicketInfo': TicketInfo,
                }
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