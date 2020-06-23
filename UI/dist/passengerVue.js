var socket = io();
var listBlock;
function changeStatus(data) {
    socket.emit('changeStatus', data);
}      

socket.on('response', data => {
    try {
        //alert(typeof(data.data));
        if(typeof(data.data) == "undefined"){
            listBlock = data;
            var filter = data.filter(seat => {
                return seat.session_id != document.cookie
            })
            
            filter.forEach(seat => {
                document.getElementById(seat.id).setAttribute('class', seat.class);              
            }) 
        }
        else if(data.data.check){
            //alert(JSON.stringify(data.data.listSeatBlock));
            listBlock = data.data.listSeatBlock;
            var filter = data.data.listSeatBlock.filter(seat => {
                return seat.session_id != document.cookie
            })
            
            filter.forEach(seat => {
                document.getElementById(seat.id).setAttribute('class', seat.class);              
            })
            //alert(data.data.id);
            //alert(data.split('_')[3]);
            
            vm.listSelected.forEach(seat => {
                //alert(data.split('_')[3]);
                if(seat.split('_')[3]  == data.data.id) {
                    vm.listSelected.pop();
                    //break;
                }
            })
            
            vm.listSelected2.forEach(data => {
                data.split('_')[3]
                if(data.split('_')[3]  == data.data.id) {
                    vm.listSelected2.pop();
                    //break;
                }
            })
        }
        
    }
    catch(err) {
        //alert("Error");
    }
})

socket.on('response_unblock', (data)=> {
    try {
            document.getElementById(data.id).setAttribute('class', data.class.replace("reserved", "available"));                   
    }
    catch(err) {

    }
})

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
           this.setSeatTypeDisplay();
       })
       axios.get('/getAllTypeObject').then(res =>{
           //alert(JSON.stringify(res.data));
           this.typeObject = res.data;
       })
       
       if(typeof(this.result2) != "undefined" && this.result2 != null) {
            await axios.get('/getListSeatSold?Schedule=' + JSON.stringify(this.result2)).then(res => {          
                    this.seatSold2 = res.data;
            })
        }

       await axios.get('/getListSeatSold?Schedule=' + JSON.stringify(this.result)).then(res => {          
           this.seatSold = res.data;
       })

        
       await this.setCarriageDisplay();
       if(typeof(this.result2)  != "undefined" && this.result2 != null) await this.setCarriageDisplay2();

       this.numberPass = new Array();
       
       for(var i = 0; i < this.total;i++){
           this.numberPass.push({'index': i + 1});
       }
      
       localStorage.setItem('passenger', location.href);
       
    },
    beforeUpdate: function(){
        this.setTrainName(this.result, 1);
        if(typeof(this.result2)  != "undefined" && this.result2 != null){
             this.setTrainName(this.result2, 2);
        }
 
        this.setStationName(this.result, 1);
 
        if(typeof(this.result2)  != "undefined" && this.result2 != null){
             this.setStationName(this.result2, 2);
        }
        
        this.listSelected = new Array();
        this.listSelected2 = new Array();
    },
    updated: function(){
        this.loadSeat(this.carriageDisplay, this.seatSold);
       
        if(typeof(this.result2) != "undefined" && this.result2 != null) {
         this.loadSeat(this.carriageDisplay2, this.seatSold2);
        }
        document.body.style['overflow'] = "scroll";
        document.getElementById('waiting_overlay').style['display'] = "none";
        this.hrefDeparture = localStorage.getItem('departure');
        this.hrefReturn = localStorage.getItem('return');
        var data = this.createElementFromHTML(document.getElementById("tableResult_1").innerHTML);
        localStorage.setItem("tableResult", data.innerHTML);    

        var listFilterBlock = listBlock.filter(data => {
            return data.session_id != document.cookie
        })

        var listFilterSelected = listBlock.filter(data => {
            return data.session_id == document.cookie && data.number == 1;
        })
        listFilterBlock.forEach(data => {
            document.getElementById(data.id).setAttribute('class',data.class);
        })   
        listFilterSelected.forEach(data => {
            //document.getElementById(data.id).setAttribute('class',data.class);
            this.SelectedSeat(1, document.getElementById(data.id))
        })

        if(typeof(this.result2) != "undefined" && this.result2 != null) {
            var listFilterSelected2 = listBlock.filter(data => {
                return data.session_id == document.cookie && data.number == 2;
            })
            listFilterSelected2.forEach(data => {
                //document.getElementById(data.id).setAttribute('class',data.class);
                this.SelectedSeat(2, document.getElementById(data.id))
            })
        }
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
        hrefDeparture: null,
        hrefReturn: null,
        error: null,
        seatTypeDisplay: null,
        seatTypeDisplay1: null,
        DepartName1: null,
        ArrivalName1: null,
        TrainName1: null,
        DepartName2: null,
        ArrivalName2: null,
        TrainName2: null,
    },

    methods:{
        setTrainName: function(result, index){
            var train = this.train.filter(train => {
                return train.ID == result.TrainID
            })
            if(index == 1) {
                this.TrainName1 = train[0].Name;
            }
            else if(index == 2) {
                this.TrainName2 = train[0].Name;
            }
        },

        setStationName: function(result, index){
            var depart = this.station.filter(station => {
                return station.ID == result.ScheduleDetails[0].DepartureStationID
            })
            var arrival = this.station.filter(station => {
                return station.ID == result.ScheduleDetails[0].ArrivalStationID
            })
            if(index == 1) {
                this.DepartName1 = depart[0].Name;
                this.ArrivalName1 = arrival[0].Name;
            }
            else if(index == 2) {
                this.DepartName2 = depart[0].Name;
                this.ArrivalName2 = arrival[0].Name;
            }             
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

                for(var i = 0; i < object.length;i++){
                    var seat =  this.listSeat.filter(seat => {
                        return seat.SeatNumber == object[i].firstChild.innerHTML && seat.CarriageID == element.ID;
                    })
                   
                    var result = seatSold.filter(data => {
                        return data.SeatID == seat[0].ID;
                    })

                    if(result.length > 0){
                        if(this.seatTypeDisplay[0].ID == 1 || this.seatTypeDisplay[0].ID == 6){
                            
                            if(object[i].getAttribute('class').search("soft_bed_left") != -1){
                                object[i].setAttribute('class','train_bed_cell bed can_block soft_bed_left sold_out');
                                object[i].setAttribute('style','pointer-events: none;');
                            }
                            else if(object[i].getAttribute('class').search("soft_bed_right") != -1) {
                                object[i].setAttribute('class','train_bed_cell bed can_block soft_bed_right sold_out');
                                object[i].setAttribute('style','pointer-events: none;');
                            }
                        }
                        else {
                            object[i].setAttribute('class','train_cell seat can_block soft_seat_right sold_out');
                            object[i].setAttribute('style','pointer-events: none;');
                        }
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
        SelectedSeat: function(number, element){
            if(number == 1 && this.numberPass.length > this.listSelected.length){
                if(element.getAttribute('class').search("soft_bed_left") != -1){
                    element.setAttribute('class','train_bed_cell bed can_block soft_bed_left selected');
                    //changeStatus({id: $(element).attr('id'), class: $(element).attr('class'), block: true, session_id: document.cookie});
                }
                else if(element.getAttribute('class').search("soft_bed_right") != -1) {
                    element.setAttribute('class','train_bed_cell bed can_block soft_bed_right selected');
                    //changeStatus({id: $(element).attr('id'), class: $(element).attr('class'), block: true, session_id: document.cookie});
                }
                //alert(element.children().html());
                this.listSelected.push(element.getAttribute('name') + "_" + element.children[0].innerHTML + '_' +  element.getAttribute('id'));
            }
            else if(number == 2 && this.numberPass.length > this.listSelected2.length){
                if(element.getAttribute('class').search("soft_bed_left") != -1){
                    element.setAttribute('class','train_bed_cell bed can_block soft_bed_left selected');
                }
                else if(element.getAttribute('class').search("soft_bed_right") != -1) {
                    element.setAttribute('class','train_bed_cell bed can_block soft_bed_right selected');
                }

                this.listSelected2.push(element.getAttribute('name') + "_" + element.children[0].innerHTML + '_' +  element.getAttribute('id'));
            }
        },
        selectSeat: function(element, number){
            if(this.seatTypeDisplay[0].ID == 1 || this.seatTypeDisplay[0].ID == 6) {
                if($(element).attr('class') == 'train_bed_cell bed can_block hard_bed_left sold_out' || $(element).attr('class').search('reserved') != -1) return;
                
                if($(element).attr('class').search("available") != -1)
                {
                    if(number == 1 && this.numberPass.length > this.listSelected.length){
                        if($(element).attr('class').search("soft_bed_left") != -1){
                            $(element).attr('class','train_bed_cell bed can_block soft_bed_left selected');
                            changeStatus({id: $(element).attr('id'), class: $(element).attr('class'), block: true, session_id: document.cookie, number: number});
                        }
                        else if($(element).attr('class').search("soft_bed_right") != -1) {
                            $(element).attr('class','train_bed_cell bed can_block soft_bed_right selected');
                            changeStatus({id: $(element).attr('id'), class: $(element).attr('class'), block: true, session_id: document.cookie, number: number});
                        }
                        //alert($(element).children().html());
                        this.listSelected.push($(element).attr('name') + "_" + $(element).children().html() + '_' +  $(element).attr('id'));
                    }
                    else if(number == 2 && this.numberPass.length > this.listSelected2.length){
                        if($(element).attr('class').search("soft_bed_left") != -1){
                            $(element).attr('class','train_bed_cell bed can_block soft_bed_left selected');
                            changeStatus({id: $(element).attr('id'), class: $(element).attr('class'), block: true, session_id: document.cookie, number: number});
                        }
                        else if($(element).attr('class').search("soft_bed_right") != -1) {
                            $(element).attr('class','train_bed_cell bed can_block soft_bed_right selected');
                            changeStatus({id: $(element).attr('id'), class: $(element).attr('class'), block: true, session_id: document.cookie, number: number});
                        }

                        this.listSelected2.push($(element).attr('name') + "_" + $(element).children().html() + '_' +  $(element).attr('id'));
                    }
                    else 
                    {
                        alert("Vượt quá số lượng");
                    }
                }
                else {
                    if(number == 1) {
                        if($(element).attr('class').search("soft_bed_left") != -1){
                            $(element).attr('class','train_bed_cell bed can_block soft_bed_left available');
                        }
                        else if($(element).attr('class').search("soft_bed_right ") != -1){
                            $(element).attr('class','train_bed_cell bed can_block soft_bed_right available');
                        }

                        //$(element).attr('class','train_cell seat can_block soft_seat_right available');
                    var filteredItems  = this.listSelected.filter(data => {
                        return data != ($(element).attr('name') + "_" + $(element).children().html() + '_' +  $(element).attr('id'));
                    })
                    this.listSelected = filteredItems;
                    changeStatus({id: $(element).attr('id'), class: $(element).attr('class'), unblock: true, session_id: document.cookie, number: number});
                    }
                    else if(number == 2){
                        if($(element).attr('class').search("soft_bed_left") != -1){
                            $(element).attr('class','train_bed_cell bed can_block soft_bed_left available');
                        }
                        else if($(element).attr('class').search("soft_bed_right") != -1) {
                            $(element).attr('class','train_bed_cell bed can_block soft_bed_right available');
                        }
                        var filteredItems  = this.listSelected2.filter(data => {
                            return data != ($(element).attr('name') + "_" + $(element).children().html() + '_' +  $(element).attr('id'));
                        })
                        this.listSelected2 = filteredItems;
                        changeStatus({id: $(element).attr('id'), class: $(element).attr('class'), unblock: true, session_id: document.cookie, number: number});
                    }
                }
            }
            else {
                if($(element).attr('class') == 'train_cell seat can_block soft_seat_right sold_out') return;
                
                if($(element).attr('class') == "train_cell seat can_block soft_seat_right available")
                {
                    if(number == 1 && this.numberPass.length > this.listSelected.length){
                        $(element).attr('class','train_cell seat can_block soft_seat_right selected');
                        changeStatus($(element));
                        this.listSelected.push($(element).attr('name') + "_" + $(element).children().html() + '_' +  $(element).attr('id'));
                    }
                    else if(number == 2 && this.numberPass.length > this.listSelected2.length){
                        $(element).attr('class','train_cell seat can_block soft_seat_right selected');
                        changeStatus($(element));
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
                    changeStatus($(element));
                    }
                    else if(number == 2){
                        $(element).attr('class','train_cell seat can_block soft_seat_right available');
                        var filteredItems  = this.listSelected2.filter(data => {
                            return data != ($(element).attr('name') + "_" + $(element).children().html() + '_' +  $(element).attr('id'));
                        })
                        this.listSelected2 = filteredItems;
                        changeStatus($(element));
                    }
                }
            }
        },

        validatePassenger: function(firstName, lastName, passport,typeobject, index){
            if(typeobject == "") {
                this.error = "Please choose type object for passenger " + index;
                return false;
            }

            if(lastName.trim() == "") {
                this.error = "Please enter last name for passenger " + index;
                return false;
            }

            if(firstName.trim() == "") {
                this.error = "Please enter first & middle name for passenger " + index;
                return false;
            }
            
            var regex = /^\d{9,11}$/;

            if(!regex.test(passport)) {
                this.error = "Please enter passport for passenger " + index + " (9 to 11 number character)"
                return false;
            }

            return true;
        },
        validateRepresentative: function(Representative){
            var regex = /^\d{9,11}$/;
            var regex2 = /^\d{10,11}$/;
            if(Representative.FullName.trim() == "" ){
                this.error = "Please enter name for representative";
                return false;
            }
            if(!regex.test(Representative.Passport)){
                this.error = "Please enter passport for representative (9 to 11 number character)";
                return false;
            }
            if(Representative.Email.trim() == ""){
                this.error = "Please enter email for representative";
                return false;
            }
            var verify_email = document.getElementById('verify_email').value;
            if(Representative.Email != verify_email) {
                this.error = "Email and verify email not correct";
                return false;
            }
            if(!regex2.test(Representative.Phone)){
                this.error = "Please enter phone number for representative";
                return false;
            }
            
            return true;
        },
        checkSeat: function(){
            
            if(this.listSelected.length < this.numberPass.length) {
                this.error = "Please choose seat for passenger";
                return false;
            }

            if(typeof(this.result2)  != "undefined" && this.result2 != null){
                if(this.listSelected2.length < this.numberPass.length) {
                    this.error = "Please choose seat for passenger";
                    return false;
                }
           }
            
            return true;
        },
        submitForm: function(){
            var formData = new FormData();
            var data;
            var ListPassenger = new Array();
            
            for(var i = 0; i < this.numberPass.length;i++){
                var fullName = document.getElementById('passenger_' + (i + 1) + '_first_name').value + " "
                                + document.getElementById('passenger_' + (i + 1) + '_last_name').value

                var check = this.validatePassenger(document.getElementById('passenger_' + (i + 1) + '_first_name').value, 
                            document.getElementById('passenger_' + (i + 1) + '_last_name').value,
                            document.getElementById('passenger_' + (i + 1) + '_passport').value,
                            document.getElementById('TypeObjectID' + (i + 1)).value,
                            i + 1);
                            
                if(check){
                    var Passenger = {
                        "Name" : fullName,
                        "Passport" : document.getElementById('passenger_' + (i + 1) + '_passport').value,
                        "TypeObject" : document.getElementById('TypeObjectID' + (i + 1)).value
                    }
                    ListPassenger.push(Passenger);
                }
                else {
                    $("#errors").modal({
                        fadeDuration: 100
                    });
                    return;
                }
            }
            
            var Representative = {
                "FullName" : document.getElementById('book_full_name').value,
                "Passport" : document.getElementById('book_passport').value,
                "Email" : document.getElementById('book_email').value,
                "Phone": document.getElementById('book_phone').value
            }    
            if(!this.validateRepresentative(Representative)) {
                $("#errors").modal({
                    fadeDuration: 100
                });
                return;
            }
            if(!this.checkSeat()){
                $("#errors").modal({
                    fadeDuration: 100
                });
                return;
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

        },
        
        setSeatTypeDisplay: function(){
            var result = this.seatType.filter(data => {
                return data.ID == this.result.ScheduleDetails[0].TableCosts[0].SeatTypeID;
            })

            this.seatTypeDisplay = result;

            if(typeof(this.result2) != "undefined" && this.result2 != null) {
                var result2 = this.seatType.filter(data => {
                    return data.ID == this.result2.ScheduleDetails[0].TableCosts[0].SeatTypeID;
                })
    
                this.seatTypeDisplay1 = result2;
           }
        },

        createElementFromHTML: function(htmlString){
            var div = document.createElement('div');
            div.innerHTML = htmlString.trim();

            // Change this to div.childNodes to support multiple top-level nodes
            return div; 
        }
        
    },
    computed:{
        SeatTypeName() {
            return typeof(this.seatTypeDisplay[0]) != "undefined" ?  this.seatTypeDisplay[0].TypeName : "undefined";
        },
        SeatTypeID(){
            return typeof(this.seatTypeDisplay[0]) != "undefined" ? this.seatTypeDisplay[0].ID : "undefined";
        },
        SeatTypeName1() {
            return typeof(this.seatTypeDisplay1[0]) != "undefined" ?  this.seatTypeDisplay1[0].TypeName : "undefined";
        },
        SeatTypeID1(){
            return typeof(this.seatTypeDisplay1[0]) != "undefined" ? this.seatTypeDisplay1[0].ID : "undefined";
        },
        Depart1() {
            return this.DepartName1;
        },
        Arrival1() {
            return this.ArrivalName1;
        },
        Train1() {
            return this.TrainName1;
        },
        Depart2() {
            return this.DepartName2;
        },
        Arrival2() {
            return this.ArrivalName2;
        },
        Train2() {
            return this.TrainName2;
        },
    }
})