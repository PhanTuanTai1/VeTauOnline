new Vue({
  el: "#app", 
  created: function(){
    axios.get('http://localhost:3000/getAllStation')
      .then(res => {
        this.Stations = res.data;
      })
      //alert(JSON.stringify(this.Stations))
  },
  data: {   
    FROM: '',
    TO: '',
    Stations: null,
    SearchFrom: null,
    SearchTo: null,
    depart_date: Date.now(),
    return_date: Date.now(),
    departureStationID: null,
    arrivalStationID: null
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

    loadStation(){
      axios.get('http://localhost:3000/getAllStation')
      .then(function(res){
        this.Stations = res.data;
        //this.SearchTos = res.data;
      })
    },

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
    }
  },
  components: {
  	vuejsDatepicker
  }
})

