new Vue({
  el: "#app",
  created: function () {
    axios.get('/getAllSta')
      .then(res => {
        this.Stations = res.data;
      })
  },
  data: {
    Stations: null,
  },
  methods: {

  },
  updated: function () {
    $("#myTable").DataTable();
  }

})