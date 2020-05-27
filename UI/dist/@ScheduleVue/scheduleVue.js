
new Vue({
  el: "#app",
  created: function () {
    axios.get(window.origin + '/getAllSchedule').then(res => { this.Schedules = res.data })
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
    Schedules: null
  },
  watch: {
    Schedules: {
      handler(newData) {
        console.log(`Trains length is ${this.Schedules.length}`);
      },
      deep: true,
    }
  },
  methods: {

    async viewDetail(IDinput) {
      let detail = (await axios.get(window.origin + '/getAllScheduleDetail?ScheduleID=' + IDinput)).data;
      let sch = this.Schedules.find(x => x.ID == IDinput);
      Swal.fire({
        title: 'Schedule detail',
        html: `
        <style>
            #ticktab{
                padding:100px !important;
            }
        </style>
        <div>
        <h1>${sch.Train.Name}</h1>
            <p>Start date: <strong>${new Date(sch.DateDeparture).toLocaleDateString("vi-vn")}</strong></p>
            <p>Time: <strong>${moment(sch.TimeDeparture).add(-8, "hours").format("HH:mm")}</strong></p>
            <table id="ticktab" border="1" style="width:100%;">
                <thead>
                    <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Length (km)</th>
                        <th>Time (hour)</th>
                        <th>Start time</th>
                    </tr>
                </thead>
                <tbody>
                    ${detail.sort((a, b) => ((a.Length > b.Length) ? 1 : -1)).map(e => `<tr>
                            <td>${this.Stations.find(x => x.ID == e.DepartureStationID).Name}</td>
                            <td>${this.Stations.find(x => x.ID == e.ArrivalStationID).Name}</td>
                            <td>${e.Length}</td>
                            <td>${e.Time}</td>
                            <td>${moment(e.StartTime).add(-8, "hours").format("HH:mm")}</td>
                            </tr>` )}
                </tbody>
            </table>
        </div>
        `,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
        customClass: 'swal-detail',

        // onOpen: function test() {
        //     $("#ticktab").DataTable();
        // }

      })
    },
    async createSchedule() {
      const { value: schedule } = await Swal.fire({
        title: 'Create schedule',
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
            <label for="to">To</label>
            <select style="width: 100%; " id="to"  class="js" name="state">
                <option></option>
                ${this.Stations.map(sta => `<option value="${sta.ID}">${sta.Name}</option>`)}
            </select>
            <label for="date">Start date</label>
            <input id="date" type="date" style="width: 100%;">
            <label for="time">Start time</label>
            <input id="time" type="time" style="width: 100%;">
            <label for="station">Station</label>
            <select id="station" style="width:100%;" class="js-example-basic-multiple" name="states[]" multiple="multiple">
              
            </select>
          </form>`,
        focusConfirm: false,
        customClass: 'swal-schedule',
        onOpen: function () {
          $('.js').select2({
            placeholder: 'Select station ...',
            theme: "classic",
          });
          $('.js-example-basic-multiple').select2();
        },
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
      if (schedule) {
        let detailList = await $("#station").val();
        await detailList.push(schedule[1]);
        await detailList.push(schedule[2]);
        detailList.sort()
        let abc = await (await axios.post(window.origin + '/admin/schedule?TimeDeparture=' + schedule[4] + '&DateDeparture=' + schedule[3] + '&TrainID=' + schedule[0])).data;
        this.create(abc, detailList, schedule[3], schedule[4]);
        this.Schedules.push({
          "ID": abc.ID,
          "TimeDeparture": moment(abc.TimeDeparture).add(-8, "hours").format("HH:mm"),
          "DateDeparture": abc.DateDeparture,
          Train: {
            "Name": this.Trains.find(x => x.ID == abc.TrainID).Name
          }
        })
        // axios.post('/admin/train?Name=' + train[0]).then(res => {
        //   this.Trains.push({
        //     "ID": res.data.ID,
        //     "Name": res.data.Name
        //   });
        //   Toast.fire({
        //     icon: 'success',
        //     title: 'New train comes'
        //   })
        // })
      }
    },
    async create(abc, detailList, date, time) {
      for (let i = 0; i < (detailList.length - 1); i++) {
        for (let j = (i + 1); j < (detailList.length); j++) {
          await axios.post(window.origin + '/admin/scheduledetail?DepartureStationID=' + detailList[i] + '&ArrivalStationID=' + detailList[j] + '&DateDeparture=' + date + '&TimeDeparture=' + time + '&ScheduleID=' + abc.ID).then(async r => {
            this.createCost(abc.ID, r.data.ID)
          });
        }
      }
    },
    async createCost(scheID, DetailID) {
      axios.post(window.origin + '/admin/cost?&ID=' + scheID + '&ScheduleDetailID=' + DetailID)
    }
  },
  computed: {
    listStation() {
      return this.Stations;
    },
    listTrain() {
      return this.Trains;
    },
    listSchedule() {
      return this.Schedules;
    },

  },
  mounted: function () {
    $(document).on("change", "#to", async function () {
      let fromID = $("#from").val();
      let toID = $("#to").val();
      let list = (await axios.get("/getAllSta")).data;
      $("#station").find('option').remove().end().append(`${list.slice(fromID, (toID - 1)).map(sta => `<option value="${sta.ID}">${sta.Name}</option>`)}`)
    })
  },
  updated: function () {
    $("#myTable").DataTable();
  }
})