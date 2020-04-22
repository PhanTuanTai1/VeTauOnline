new Vue({
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
       axios.get('http://localhost:3000/getListSeatSold?dateDepart=' + document.getElementById('dateDepart').value).then(res => {          
           this.seatSold = res.data;
       })
       this.setCarriageDisplay();
       this.numberPass = new Array();
       this.loadSeat();
       for(var i = 0; i < this.total;i++){
           this.numberPass.push({'index': i + 1});
       }
    },
    data:{
        train: [],
        seatType: [],
        typeObject: [],
        seatSold: [],
        listCarriageAndSeat: [],
        station: [],
        listSeat: [],
        numberPass: null,
        total: null,
        result: null,
        carriageDisplay: null,
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
            // var obj = document.getElementsByClassName("seat");
            // for(var i = 0; i < obj.length; i++){
            //     if(obj)
            // }
        }
    }
})




