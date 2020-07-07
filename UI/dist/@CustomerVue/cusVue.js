Vue.use(VueLoading);

new Vue({
  el: "#app",
  created: function () {
    axios.get("/getAllSta").then(res => {
      this.Station = res.data;
    });
    axios.get("/getAllSchedule").then(res => {
      this.mainSchedule = res.data;
    })
    axios.get(window.origin + '/getAllScheNoCond').then(res => {
      this.Schedule = res.data
    })

  },
  data: {
    Customers: null,
    test: null,
    Schedule: null,
    Station: null,
    mainSchedule: null,
  },
  updated: function () {
    $("#myTable").DataTable({
      "retrieve": true,
      "info": false
    });
    $("#select").select2({
      theme: "classic",
    });
  },
  computed: {
    listCus() {
      return this.Customers;
    }
  },
  mounted: function () {
    let loader = this.$loading.show({
      loader: 'dots'
    });
    setTimeout(() => loader.hide(), 1.5 * 1000)
    $("#menucustomer").addClass("active");
  },
  methods: {
    abc() {
      let id = $("#select").val();
      axios.get(window.origin + '/abc?scheID=' + id).then(res => {
        if (res.data.length != 0) {
          this.Customers = [];
          this.Customers = res.data;
          $("#count p").text('');
          $("#count p").text(`Total ${(res.data).length} customer(s) on this schedule...`);
        }
        else {
          this.Customers = [];
          $("#count p").text('');
          $("#count p").text("No customers on this schedule");
        }
      })
    },
    from(from) {
      if (this.Station != null) {
        return this.Station.find(x => x.ID == from).Name;
      }
    },
    to(to) {
      if (this.Station != null) {
        return this.Station.find(x => x.ID == to).Name;
      }
    },
    format(id) {
      return moment(this.mainSchedule.find(x => x.ID == id).DateDeparture).format("DD/MM/YYYY");
    },
    async updateCus(IDinput, index) {
      console.log(this.Schedule)
    },
  },

})