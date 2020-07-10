Vue.use(VueLoading);
new Vue({
  el: "#app",
  created: function () {
    axios.get(window.origin + '/getAllSchedule').then(res => { this.Schedules = res.data })
    axios.get('/getAllSta')
      .then(res => {
        this.Stations = res.data;
      })
    axios.get('/getAllTrain')
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
    formatTime(Time) {
      if (Time.toString().length <= 5) {
        return Time;
      }
      return moment(Time).subtract(7, 'hour').format('HH:mm');
    },

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
            <p>Time: <strong>${moment(sch.TimeDeparture).add(-7, "hours").format("HH:mm")}</strong></p>
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
                    ${detail.sort((a, b) => (a.Length > b.Length) ? 1 : -1).map(e => `<tr>
                            <td>${this.Stations.find(x => x.ID == e.DepartureStationID).Name}</td>
                            <td>${this.Stations.find(x => x.ID == e.ArrivalStationID).Name}</td>
                            <td>${e.Length}</td>
                            <td>${e.Time}</td>
                            <td>${moment(e.StartTime).add(-7, "hours").format("HH:mm")}</td>
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
    async delSchedule(IDinput, index) {
      const swalWithBootstrapButtons = await Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      const Toast = await Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        onOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          axios.delete(window.origin + '/admin/schedule?ScheduleID=' + IDinput);
          this.Schedules.splice(index, 1)
          Toast.fire({
            icon: 'success',
            title: `Schedule #${IDinput} deleted`
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          )
        }
      })
    },
    async createSchedule() {
      let detailList = (await axios('/getListDetail')).data;
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
        preConfirm: async () => {
          if (document.getElementById('train').value == "") {
            Swal.showValidationMessage('Train name can not be empty!');
            return;
          }
          if (document.getElementById('from').value == "") {
            Swal.showValidationMessage('Please select Departure station!');
            return;
          }
          if (document.getElementById('to').value == "") {
            Swal.showValidationMessage('Please select Arrival station!');
            return;
          }
          if (document.getElementById('date').value == "") {
            Swal.showValidationMessage('Date can not be empty!');
            return;
          }
          if ((new Date(document.getElementById('date').value).toDateString()) == (new Date().toDateString())) {
            Swal.showValidationMessage('Date can not be today!');
            return;
          }
          if ((new Date(document.getElementById('date').value).getTime()) < (new Date().getTime())) {
            Swal.showValidationMessage('Date can not be the past!');
            return;
          }
          let trainExistArr = this.Schedules.filter(x => x.TrainID == document.getElementById('train').value);
          await this.checkBusyTrain(trainExistArr, document.getElementById('date').value).then()
          if (document.getElementById('time').value == "") {
            Swal.showValidationMessage('Time can not be empty!');
            return;
          }

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
        console.log(new Date(schedule[3]))
        console.log()
        let detailList = await $("#station").val();
        await detailList.push(schedule[1]);
        await detailList.push(schedule[2]);
        if (schedule[1] > schedule[2])
          detailList.sort(function (a, b) { return b - a })
        else {
          detailList.sort()
        }
        let abc = await (await axios.post(window.origin + '/admin/schedule?TimeDeparture=' + schedule[4] + '&DateDeparture=' + schedule[3] + '&TrainID=' + schedule[0])).data;
        let time = abc.TimeDeparture;
        this.create(abc, detailList, schedule[3], schedule[4]);
        this.pustSche(abc.ID, time, abc.DateDeparture, this.Trains.find(x => x.ID == abc.TrainID).Name);
      }
    },
    async checkBusyTrain(train, date) {
      for (let item of train) {
        let start = (new Date(item.DateDeparture)).getTime();
        let a = await (await axios.get(window.origin + "/getAllScheduleDetail?ScheduleID=" + item.ID)).data;
        if (a != null) {
          for (let item1 of a) {
            if ((new Date(date).getTime()) >= start && (new Date(date).getTime()) <= (new Date((moment(start).add(item1.Time, "hours"))).getTime())) {
              await Swal.showValidationMessage(`This train ${$("#train option:selected").text()} is on duty this date`);
              return;
            }
          }
        }
      }
    },
    async pustSche(id, time, date, name) {
      const sche = await {
        "ID": id,
        "TimeDeparture": time,
        "DateDeparture": date,
        Train: {
          "Name": name,
        }
      }
      this.Schedules.push(sche);
    },
    async create(abc, detailList, date, time) {
      for (let i = 0; i < (detailList.length - 1); i++) {
        for (let j = (i + 1); j < (detailList.length); j++) {
          await axios.post(window.origin + '/admin/scheduledetail?DepartureStationID=' + detailList[i] + '&ArrivalStationID=' + detailList[j] + '&DateDeparture=' + date + '&TimeDeparture=' + time + '&ScheduleID=' + abc.ID + '&start=' + detailList[0] + '&end=' + detailList[detailList.length - 1]).then(async r => {
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
    let loader = this.$loading.show({
      loader: 'dots'
    });
    setTimeout(() => loader.hide(), 1.5 * 1000)
    $("#menuschedule").addClass("active");
    $(document).on("change", "#from", async function () {
      let fromID = $("#from").val();
      let toID = $("#to").val();
      let list = (await axios.get("/getAllSta")).data;
      if (fromID > toID) {
        $("#station").find('option').remove().end().append(`${list.slice(toID, (fromID - 1)).map(sta => `<option value="${sta.ID}">${sta.Name}</option>`)}`)
      }
      else {
        $("#station").find('option').remove().end().append(`${list.slice(fromID, (toID - 1)).map(sta => `<option value="${sta.ID}">${sta.Name}</option>`)}`)
      }

    })
    $(document).on("change", "#to", async function () {
      let fromID = $("#from").val();
      let toID = $("#to").val();
      let list = (await axios.get("/getAllSta")).data;
      if (fromID > toID) {
        $("#station").find('option').remove().end().append(`${list.slice(toID, (fromID - 1)).map(sta => `<option value="${sta.ID}">${sta.Name}</option>`)}`)
      }
      else {
        $("#station").find('option').remove().end().append(`${list.slice(fromID, (toID - 1)).map(sta => `<option value="${sta.ID}">${sta.Name}</option>`)}`)
      }

    })
  },
  updated: function () {
    $("#myTable").DataTable();
    this.Schedules.map(async sche => {
      let detail = (await axios.get(window.origin + '/getAllScheduleDetail?ScheduleID=' + sche.ID).then(res => { return res })).data;
      detail.map(async de => {
        let temp = await (await axios.get(window.origin + '/abc?scheID=' + de.ID)).data;
        if (temp.length != 0) {
          $(`#${sche.ID}`).prop('disabled', true);
        }
      })
    })
  }
})