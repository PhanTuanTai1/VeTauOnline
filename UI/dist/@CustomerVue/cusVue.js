

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
    $("#myTable").DataTable();
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
    $("#menucustomer").addClass("active");
  },
  methods: {
    abc() {
      let id = $("#select").val();
      axios.get(window.origin + '/abc?scheID=' + id).then(res => {
        if (res != null) {
          this.Customers = [];
          this.Customers = res.data;
        }
        else {
          this.Customers = null
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