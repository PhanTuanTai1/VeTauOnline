Vue.use(VueLoading);
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
  },
  mounted: function () {
    let loader = this.$loading.show({
      loader: 'dots'
    });
    setTimeout(() => loader.hide(), 1.5 * 1000)
    $("#menustation").addClass("active");
  }

})