
new Vue({
  el: "#app",
  created: function () {
    axios.get('http://localhost:3000/getAllSta')
      .then(res => {
        this.Stations = res.data;
      })
    axios.get('http://localhost:3000/getAllTrain')
      .then(res => {
        this.Trains = res.data;
      })
  },
  data: {
    Stations: null,
    Trains: null,
  },
  methods: {
    async testdialog() {
      const { value: schedule } = await Swal.fire({
        title: 'Create train',
        html:
          `<form>
            <label for="train">Train</label>
            <select style="width: 100%; " id="train" class="js-example-basic-single" name="state"
                required>
                <option></option>
                ${this.Trains.map(train => `<option value="${train.ID}">${train.Name}</option>`)}
            </select>
            <label for="from">From</label>
            <select style="width: 100%; " id="from" class="js" name="state">
                <option></option>
                ${this.Stations.map(sta => `<option value="${sta.ID}">${sta.Name}</option>`)}
            </select>
            <label for="from">To</label>
            <select style="width: 100%; " id="to" class="js-example-basic-single" name="state">
                <option></option>
                ${this.Stations.map(sta => `<option value="${sta.ID}">${sta.Name}</option>`)}
            </select>
            <label for="date">Start date</label>
            <input id="date" type="date" style="width: 100%;">
            <label for="time">Start time</label>
            <input id="time" type="time" style="width: 100%;">
          </form>`,
        focusConfirm: false,
        // onOpen: function () {
        //   $('.js').select2({
        //     placeholder: 'Select station ...',
        //     theme: "classic",
        //   });
        // },
        preConfirm: () => {
          return [
            document.getElementById('train').value,
            document.getElementById('from').value,
            document.getElementById('to').value,
            document.getElementById('date').value,
            document.getElementById('time').value,
          ]
        }
      })
      console.log()
    }
  },
  computed: {
    listStation() {
      return this.Stations;
    },
    listTrain() {
      return this.Trains;
    },
    updated: function () {
      $("#myTable").DataTable();
    }
  },
})