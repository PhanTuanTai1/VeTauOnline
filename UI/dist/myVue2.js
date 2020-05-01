

new Vue({
    el: "#app",
    created: async function(){

        this.result = JSON.parse(document.getElementById("myData").value);
        document.getElementById("myData").replaceWith("");
        this.query = JSON.parse(document.getElementById("query").value);

        if(typeof(document.getElementById('step_trip')) != "undefined" && document.getElementById('step_trip') != null) 
            this.step = document.getElementById('step_trip').value;
        axios.get('/getAllStation')
        .then(res => {
          this.Stations = res.data;
          this.round_trip = true;
        })

        await axios.get('/getAllTrain')
        .then(res => {                 
            this.train = res.data;
        })

        await axios.get('/getAllStation')
        .then(res => {
            this.Stations = res.data;
        }) 

        this.departure = this.getStationName(this.result[0].ScheduleDetails[0].DepartureStationID);
        this.arrival = this.getStationName(this.result[0].ScheduleDetails[0].ArrivalStationID);
        this.listTrain = this.loadListTrain();       
    },
    data:{
        result: null,
        train: null,
        departure: null,
        arrival: null,  
        Stations: null,
        listTrain: [],
        seatType: null,
        query: null,
        step: null,
        FROM: '',
        TO: '',
        Stations: null,
        Trains: null,
        SearchFrom: null,
        SearchTo: null,
        depart_date: new Date(),
        return_date: new Date(),
        departureStationID: null,
        arrivalStationID: null,
        round_trip: true,
        one_way: false,   
        passengers: 1,
        errors: null,
    },

    methods:{
        getStationName(stationID) {
            var result = this.Stations.filter(station =>{
                return station.ID == stationID
            })
            return result[0].Name
        },
        loadListTrain(){
            var result = this.result.map(result => {return result.TrainID});
            var listTrain = [];
            result.forEach(id => {
                var filter = this.train.filter(train => {
                    return train.ID == id;
                })
                listTrain.push(filter[0]);
            })
            return listTrain;
        },

        loadScheduleDetail: function(index,trainID){
            if(document.getElementById('collapse_' + trainID).innerHTML.trim() != "") {
                return;
            }
            // obj.setAttribute("class", "result clickable_tr train vr clicked checking");
            var tr = document.getElementById('parent' + trainID).childNodes.item(0);
            tr.setAttribute("class","result clickable_tr train vr clicked checking");

            var train = this.getScheduleDetailByTrainID(trainID);
            var url;

            if(typeof(this.query.ONE_WAY) != "undefined")
            {
                url = "/scheduleDetail?TRAINID=" 
                        + train[0].TrainID + "&SCHEDULEID=" + train[0].ID + "&DepartID=" 
                        + train[0].ScheduleDetails[0].DepartureStationID
                        + "&ArrivalID=" + train[0].ScheduleDetails[0].ArrivalStationID
                        + "&ONE_WAY=" + this.query.ONE_WAY
                        + "&PASSENGERS=" + this.query.PASSENGERS
                        + "&Query=" + JSON.stringify(this.query);     
            }
            else if(typeof(this.query.ROUND_TRIP) != "undefined"){
                alert(this.step);
                url = "/scheduleDetail?TRAINID=" 
                        + train[0].TrainID + "&SCHEDULEID=" + train[0].ID + "&DepartID=" 
                        + train[0].ScheduleDetails[0].DepartureStationID
                        + "&ArrivalID=" + train[0].ScheduleDetails[0].ArrivalStationID
                        + "&ROUND_TRIP=" + this.query.ROUND_TRIP
                        + "&PASSENGERS=" + this.query.PASSENGERS
                        + "&Query=" + JSON.stringify(this.query)
                        + "&STEP=" + this.step;
            }

            axios.get(url)
            .then( resp => {
                // document.getElementById('icon_1').setAttribute("style" , "vi.sibility: hidden;");
                // document.getElementById('icon_2').removeAttribute("hidden");

                this.displaySchedule(resp.data, trainID);
                $("#collapse_" + trainID).collapse('show');
                // document.getElementById('collapse_' + trainID).setAttribute("style", "border-bottom: 1px solid rgb(232, 232, 232);display: table-row;");
            })
            .then(() => {
                tr.setAttribute("class","result clickable_tr train vr clicked");
                
                // document.getElementById('icon_1').removeAttribute("style");
                // document.getElementById('icon_2').setAttribute("hidden" , "");
            })
        },
        
        getScheduleID: function(trainID){
            var single_result =  this.result.filter(result => {
                return result.TrainID == trainID;
            })
            return single_result.ID;
        },

        displaySchedule: function(html, trainID){
            var tableRef = document.getElementById('collapse_' + trainID);
            tableRef.innerHTML = html;
        },

        createElementFromHTML: function(htmlString){
            var table = document.createElement('table');
            table.innerHTML = htmlString.trim();
            // Change this to div.childNodes to support multiple top-level nodes
            return table.firstChild.firstChild; 
        },

        getScheduleDetailByTrainID: function(trainID){
            return this.result.filter(result => {
                return result.TrainID == trainID;
            })
        },

        formatDate: function(date){
            return moment(date).format('DD-MM-YYYY');
        },

        formatTime: function(dateTime){
            return moment(dateTime).format("LT");
        },

        getFirstCost: function(scheduleDetailID){
            
            axios.get('/getFirstCost?ScheduleID=' + scheduleDetailID)
            .then(res =>{
                //alert(JSON.stringify(res.data.Cost).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + " VND");
                document.getElementById('cost' + scheduleDetailID).innerHTML = JSON.stringify(res.data.Cost).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + " VND";
            })
        },
        setDataDepart: function(){
            var data = this.getStationID(document.getElementById('Depart').value);
            if(typeof(data[0]) != "undefined"){
                this.departureStationID = data[0].ID
                return true;
            }
            return false;
          },
          setDataArrive: function(){
            var data = this.getStationID(document.getElementById('Arrival').value);
            if(typeof(data[0]) != "undefined"){
              this.arrivalStationID = data[0].ID;
              return true;
            }
            return false;
          },
          searchFromStation(){
            if(this.FROM.trim() == "") {
              this.SearchFrom = [];
              return;
            }    
            var result = this.Stations.filter(station => {
              return station.Name.toLowerCase().startsWith(this.FROM.toLowerCase().trim());
            });
            this.SearchFrom = result;
          },
      
          searchToStation(){
            if(this.TO.trim() == "") {
              this.SearchTo = [];
              return;
            }
            var result = this.Stations.filter(station => {
              return station.Name.toLowerCase().startsWith(this.TO.toLowerCase().trim());
            });
            this.SearchTo = result;
          },
      
          selectStationFrom: function(station){
            this.FROM = station;
            this.SearchFrom = [];
            this.departureStationID = this.getStationID(station)[0].ID;
            //alert(this.departureStationID);
          },
          
          getStationID(stationName){
            return this.Stations.filter(station => {
              return tvkd.c(station.Name) == tvkd.c(stationName);
            });
          },
      
          selectStationTo: function(station){
            this.TO = station;
            this.SearchTo = [];
            this.arrivalStationID = this.getStationID(station)[0].ID;
          },
      
          disabledReturnDay: function(){
            this.round_trip = false;
            this.one_way = true;
            document.getElementById("dateTimePicker_2").setAttribute("disabled","");
          },
      
          enabledReturnDay: function(){
            this.round_trip = true;
            this.one_way = false;
            document.getElementById("dateTimePicker_2").removeAttribute("disabled");
          },
      
          increasePassager: function(){
            if(this.passengers < 6) this.passengers += 1;
          },
      
          validateData: function(){
            if(document.getElementById('Depart').value == "" ){
              this.errors = "Please enter departure station";
              return false;
            }
            if(this.departureStationID == null) {
              if(!this.setDataDepart()){
                this.errors = "Departure station invalid";
                return false;
              }       
            }
            if(document.getElementById('Arrival').value == "" ){
              this.errors = "Please enter arrival station";
              return false;
            } 
            if(this.arrivalStationID == null) {
              if(!this.setDataArrive()){
                this.errors = "Arrival station invalid";
                return false;
              }
            }
            if(this.departureStationID == this.arrivalStationID) {
              this.errors = "Departure and destination station aren't the same";
              return false;
            }
            return true;
          },
      
          Search: function(){    
            if(this.validateData())
            {
              location.href = this.setParamQuery();  
            }
            else {
              $("#errors").modal({
                fadeDuration: 100
              });
            }
          },
          
          setParamQuery: function(){
            var url = '/searchSchedule?';
            url += "FROM=" + this.departureStationID + "&";
            url += "TO=" + this.arrivalStationID + "&";
            
            if(this.round_trip == true){     
              url += "DEPART=" + this.depart_date + "&";      
              url += "RETURN=" + this.return_date + "&"; 
              url += "ROUND_TRIP=" + this.round_trip + "&"; 
            }
            
            if(this.one_way == true) {
              url += "DEPART=" + this.depart_date + "&";     
              url += "ONE_WAY=" + this.one_way + "&"; 
            }
            
            if(this.passengers >= 6) this.passengers = 5;
      
            url += "PASSENGERS=" + this.passengers; 
      
            return url;
          }
    },
    components: {
        vuejsDatepicker,
      }
})


  
  

