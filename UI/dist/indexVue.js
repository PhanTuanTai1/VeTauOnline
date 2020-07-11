new Vue({
  el: "#app", 
  created: function(){
    axios.get('/getAllStation')
      .then(res => {
        this.Stations = res.data;
        this.round_trip = true;
      })
      localStorage.clear();
  },
  mounted: function(){
      document.body.style['overflow'] = "scroll";
      document.getElementById('waiting_overlay').style['display'] = "none";
  },
  data: {   
    FROM: '',
    TO: '',
    Stations: null,
    Trains: null,
    SearchFrom: null,
    SearchTo: null,
    depart_date: new Date(),
    return_date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1),
    departureStationID: null,
    arrivalStationID: null,
    round_trip: true,
    one_way: false,   
    passengers: 1,
    errors: null,
},

  methods: {
    setDataDepart: function(){
      var data = this.getStationID(this.FROM);
      if(typeof(data[0]) != "undefined"){
          this.departureStationID = data[0].ID
          return true;
      }
      return false;
    },
    setDataArrive: function(){
      var data = this.getStationID(this.TO);
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
        return tvkd.c(station.Name.toLowerCase()).replace(/\s/g, '') == tvkd.c(stationName.toLowerCase()).replace(/\s/g, '');
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
      //return true;
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

      if(this.round_trip) {
        if(this.depart_date > this.return_date) {
          this.errors = "Departure date cannot be greater than return date";
          return false;
        }
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
  computed: {
    disabledDates_To() {
      return {       
        to: new Date(new Date() - 86400000)
      };
    },
    disabledDates_From() {
      return {       
        to: new Date()
      };
    }
  },
  components: {
    vuejsDatepicker,
  }
})

