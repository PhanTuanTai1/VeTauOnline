function select(element){
    vm.selectSeat(element);
}
function change(element){
    // $(element).attr('id', 'transform: translate3d(0px, -10px, 0px); transition: all 0.8s ease 0s;')
    document.getElementsByName('activeDiv')[0].setAttribute('style', 'transform: translate3d(0px, 300px, 0px); transition: all 0.8s ease 0s');
    document.getElementsByName('activeDiv')[0].removeAttribute('name');
    document.getElementById('carriage_' + $(element).attr('id')).setAttribute('style', 'transform: translate3d(0px, -30px, 0px); transition: all 0.8s ease 0s');
    document.getElementById('carriage_' + $(element).attr('id')).setAttribute('name', 'activeDiv');
}
var vm = new Vue({
    el: "#app",
    created: async function(){
       this.total = document.getElementById('number').value;
       this.result = JSON.parse(document.getElementById('result').value);
       
       await axios.get('http://localhost:3000/getAllTrain').then(res => {
           this.train = res.data;
       })
       this.setTrainName();
       
       await axios.get('http://localhost:3000/getListCarriage').then(res =>{
           this.listCarriage = res.data;
       })
       await axios.get('http://localhost:3000/getListSeat').then(res =>{
           this.listSeat = res.data;
       })
       await axios.get('http://localhost:3000/getAllStation').then(res =>{
           this.station = res.data;
       })
       this.setStationName();
       axios.get('http://localhost:3000/getAllSeatType').then(res =>{
           this.seatType = res.data;
       })
       axios.get('http://localhost:3000/getAllTypeObject').then(res =>{
           this.typeObject = res.data;
       })
       await axios.get('http://localhost:3000/getListSeatSold?dateDepart=' + document.getElementById('dateDepart').value).then(res => {          
           this.seatSold = res.data;
       })

       await this.setCarriageDisplay();
       this.numberPass = new Array();
       
       for(var i = 0; i < this.total;i++){
           this.numberPass.push({'index': i + 1});
       }
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
        carriageDisplay: null,
        listSelected: null
    },

    methods:{
        setTrainName:async function(){
            var train = this.train.filter(train => {
                return train.ID == this.result.TrainID
            })
            document.getElementById('trainName').innerHTML = train[0].Name;
            var object = document.getElementsByClassName('hiddenTrain');
            for(var i = 0; i < object.length; i++){
                object[i].innerHTML = train[0].Name;
            }
        },

        setStationName: function(){
            var depart = this.station.filter(station => {
                return station.ID == this.result.ScheduleDetails[0].DepartureStationID
            })
            var arrival = this.station.filter(station => {
                return station.ID == this.result.ScheduleDetails[0].ArrivalStationID
            })
            
            document.getElementById('parentDepart').innerHTML = depart[0].Name;
            document.getElementById('subDepart').innerHTML = depart[0].Name;
            document.getElementById('hiddenDepart').innerHTML = depart[0].Name;
            document.getElementById('summaryDepart').innerHTML = depart[0].Name;
            document.getElementById('parentArrival').innerHTML = arrival[0].Name;
            document.getElementById('subArrival').innerHTML = arrival[0].Name;
            document.getElementById('hiddenArrival').innerHTML = arrival[0].Name;
            document.getElementById('summaryArrival').innerHTML = arrival[0].Name;
        },
        selectedType: function(object, object2, id, typeName){
            document.getElementById(object).innerHTML = typeName;
            document.getElementById(object2).value = id;
        },
        setCarriageDisplay : function(){
            var result = this.listCarriage.filter(data => {
                return data.TrainID == this.result.TrainID;
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
                    this.listSelected.push($(element).attr('name') + $(element).children().html());
                }else {
                    alert("Vượt quá số lượng");
                }
            }
            else {
                $(element).attr('class','train_cell seat can_block soft_seat_right available');
                var filteredItems  = this.listSelected.filter(data => {
                    return data != $(element).attr('name') + $(element).children().html();
                })
                this.listSelected = filteredItems;
            }
        }
    }
})




