new Vue({
  el: "#app",
  created: function () {
    axios.get('http://localhost:3000/getAllSta')
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