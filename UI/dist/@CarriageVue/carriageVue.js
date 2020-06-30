Vue.use(VueLoading);
new Vue({
  el: "#app",
  created: function () {
    axios.get(window.origin + '/getAllCarriage')
      .then(res => {
        this.Carriages = res.data;
      })
  },
  data: {
    Carriages: null,
    TrainByID: null,
  },

  updated: function () {
    $("#myTable").DataTable();
    $("#menucarriage").addClass("active");
  },
  watch: {
    Carriages: {
      handler(newData) {
        console.log(`Trains length is ${this.Carriages.length}`);
      },
      deep: true,
    }
  },
  mounted: function () {
    let loader = this.$loading.show({
      loader: 'dots'
    });
    setTimeout(() => loader.hide(), 1.5 * 1000)
  },
  methods: {
    async createCarriage() {
      let listTrain = await axios.get(window.origin + '/getAllTrain');
      let listSeatType = await axios.get(window.origin + '/getAllTypeOfSeat');
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
      const { value: carriage } = await Swal.fire({
        title: 'Create carriage',
        html: `<form>
                <div class="form-group">
                  <label for="fname">Name:</label><br>
                  <input type="text" id="Name"" required><br>
                  <label for="ftrain">Train:</label><br>
                  <select style="width:207px;" id="Train" required>
                      ${listTrain.data.map(train => `<option value="${train.ID}">${train.Name}</option>`)}
                  </select><br>
                  <label for="fseattype">Seat type:</label><br>
                  <select style="width:207px;" id="SeatType" required>
                      ${listSeatType.data.map(seat => `<option value="${seat.ID}">${seat.TypeName}</option>`)}
                  </select><br>
                </div>
              </form>`,
        focusConfirm: false,
        preConfirm: () => {
          if (document.getElementById('Name').value == "") {
            Swal.showValidationMessage('Name can not be empty!');
            return;
          }
          if (document.getElementById('Train').value == "") {
            Swal.showValidationMessage('Train can not be empty!');
            return;
          }
          if (document.getElementById('SeatType').value == "") {
            Swal.showValidationMessage('Seat type can not be empty!');
            return;
          }
          return [
            document.getElementById('Name').value,
            document.getElementById('Train').value,
            document.getElementById('SeatType').value,
            document.getElementById('Train')[0].innerText
          ]
        }
      })

      if (carriage) {
        axios.post('/admin/carriage?Name=' + carriage[0] + '&TrainID=' + carriage[1] + '&SeatTypeID=' + carriage[2]).then(res => {
          this.Carriages.push({
            "ID": res.data.ID,
            "Name": res.data.Name,
            "TrainID": res.data.TrainID,
            "Train": { "Name": carriage[3] }
          });
        })
        Toast.fire({
          icon: 'success',
          title: 'New carriage comes'
        })
      }
    },
    async updateCarriage(IDinput, index) {
      let listTrain = await axios.get(window.origin + '/getAllTrain');
      let listSeatType = await axios.get(window.origin + '/getAllTypeOfSeat');
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
      let carriagebyID = await this.Carriages.find(x => x.ID == IDinput);
      let currentSeattype = (await axios.get(window.origin + '/getallseat')).data.find(x => x.CarriageID == carriagebyID.ID).SeatTypeID;
      const { value: temp } = await Swal.fire({
        title: 'Update carriage',
        html:
          `<form>
        <div class="form-group">
          <label for="fID">ID:</label><br>
          <input type="text" value="${carriagebyID.ID}" id="ID"" disabled><br>
          <label for="fname">Name:</label><br>
          <input type="text" value="${carriagebyID.Name}" id="Name"" required><br>
          <label for="ftrain">Train:</label><br>
          <select style="width:207px;" id="Train" required>
            <option value="${carriagebyID.TrainID}">${carriagebyID.Train.Name}</option>
              ${listTrain.data.filter(x => x.ID != carriagebyID.TrainID).map(train => `<option value="${train.ID}">${train.Name}</option>`)}
          </select><br>
          <label for="fseattype">Seat type:</label><br>
          <select style="width:207px;" id="SeatType" required>
              <option value="${currentSeattype}">${listSeatType.data.find(x => x.ID == currentSeattype).TypeName}</option>
              ${listSeatType.data.filter(x => x.ID != currentSeattype).map(seat => `<option value="${seat.ID}">${seat.TypeName}</option>`)}
          </select><br>
        </div>
      </form>`,
        focusConfirm: false,
        preConfirm: () => {
          if (document.getElementById('Name').value == "") {
            Swal.showValidationMessage('Name can not be empty!');
            return;
          }
          if (document.getElementById('Train').value == "") {
            Swal.showValidationMessage('Train can not be empty!');
            return;
          }
          if (document.getElementById('SeatType').value == "") {
            Swal.showValidationMessage('Seat type can not be empty!');
            return;
          }
          return [
            document.getElementById('ID').value,
            document.getElementById('Name').value,
            document.getElementById('Train').value,
            document.getElementById('SeatType').value,
            document.getElementById('Train')[0].innerText,
            document.getElementById('SeatType')[0].innerText,
          ]
        }
      })
      if (temp) {
        axios.put(window.origin + '/admin/carriage?Name=' + temp[1] + '&TrainID=' + temp[2] + '&SeatTypeID=' + temp[3] + '&ID=' + temp[0]).then(
          res => {
            this.$set(this.Carriages, index, { "ID": temp[0], "Name": temp[1], Train: { "Name": temp[4], SeatType: { "TypeName": temp[5] } } })
          }
        ).then(
          Toast.fire({
            icon: 'success',
            title: `Carriage #${temp[0]} updated`
          }));

      }

    },
    async delCarriage(IDinput, index) {
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
          axios.delete(window.origin + '/admin/carriage?ID=' + IDinput);
          this.Carriages.splice(index, 1)
          Toast.fire({
            icon: 'success',
            title: `Carriage #${IDinput} deleted`
          });
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          )
        }
      })
    },
  },
  computed: {
    listCarriages() {
      return this.Carriages;
    }
  }
})