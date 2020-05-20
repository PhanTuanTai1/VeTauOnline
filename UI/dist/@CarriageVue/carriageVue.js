new Vue({
  el: "#app",
  created: function () {
    axios.get(window.origin + '/getAllCarriage')
      .then(res => {
        console.log(res.data);
        this.Carriages = res.data;
      })
  },
  data: {
    Carriages: null,
    TrainByID: null,
  },

  updated: function () {
    $("#myTable").DataTable();
  },
  watch: {
    Trains: {
      handler(newData) {
        console.log(`Trains length is ${this.Carriages.length}`);
      },
      deep: true,
    }
  },
  methods: {
    async createCarriage() {
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
      const { value: train } = await Swal.fire({
        title: 'Create train',
        html:
          `<form>
            <div class="form-group">
              <label for="fname">Name:</label><br>
              <input type="text" id="Name"" required><br>
            </div>
          </form>`,
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById('Name').value,
          ]
        }
      })

      if (train) {
        axios.post('/admin/train?Name=' + train[0]).then(res => {
          this.Trains.push({
            "ID": res.data.ID,
            "Name": res.data.Name
          });
          Toast.fire({
            icon: 'success',
            title: 'New train comes'
          })
        })
      }
    },
    async updateCarriage(IDinput, index) {
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
      axios.get(window.origin + '/getTrain?ID=' + IDinput)
        .then(async res => {
          var trainId = res.data.ID;
          var trainName = res.data.Name;
          const { value: temp } = await Swal.fire({
            title: 'Update train',
            html:
              '<label for="fname">ID:</label><br>' +
              `<input type="text" id="ID" value="${trainId}" disabled><br>` +
              '<label for="fname">Name:</label><br>' +
              `<input type="text" value="${trainName}" id="Name""><br>`,
            focusConfirm: false,
            preConfirm: () => {
              return [
                document.getElementById('ID').value,
                document.getElementById('Name').value,
              ]
            }
          })
          if (temp) {
            axios.put(window.origin + '/admin/train?ID=' + temp[0] + '&Name=' + temp[1]).then(
              res => {
                this.$set(this.Trains, index, { "ID": temp[0], "Name": temp[1] })
              }
            ).then(
              Toast.fire({
                icon: 'success',
                title: `Train #${temp[0]} updated`
              }));

          }
        })
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
          axios.delete(window.origin + '/admin/train?ID=' + IDinput);
          this.Trains.splice(index, 1)
          Toast.fire({
            icon: 'success',
            title: `Train #${IDinput} deleted`
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
  },
  computed: {
    listTrain() {
      return this.Carriages;
    }
  }
})