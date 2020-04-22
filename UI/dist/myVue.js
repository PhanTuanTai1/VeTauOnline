Vue.component()
new Vue({
  el: "#app", 
  created: function(){
    axios.get('http://localhost:3000/getAllStation')
      .then(res => {
        this.Stations = res.data;
        this.round_trip = true;
      })
  },
  data: {   
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
    round_trip: null,
    one_way: null,   
    passengers: 1,
},

  methods: {
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

    // loadStation(){
    //   axios.get('http://localhost:3000/getAllStation')
    //   .then(function(res){
    //     this.Stations = res.data;
    //     //this.SearchTos = res.data;
    //   })
    // },

    selectStationFrom: function(station){
      this.FROM = station;
      this.SearchFrom = [];
      this.departureStationID = this.getStationID(station)[0].ID;
      //alert(this.departureStationID);
    },
    
    getStationID(stationName){
      return this.Stations.filter(station => {
        return station.Name == stationName;
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

    Search: function(){       
      location.href = this.setParamQuery();  
      // axios.post(this.setParamQuery())
      // .then(res => {
      //   alert(res.data.redirect);
      // })
    },
    
    setParamQuery: function(){
      var url = 'http://localhost:3000/searchSchedule?';
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

      url += "PASSENGERS=" + this.passengers; 

      return url;
    }
  },
  components: {
    vuejsDatepicker,
  }
})

