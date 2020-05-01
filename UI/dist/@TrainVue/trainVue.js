new Vue({
  el: "#app",
  created: function () {
    axios.get(window.origin + '/getAllTrain')
      .then(res => {
        this.Trains = res.data;
      })
  },
  data: {
    Trains: null,
    TrainByID: null
  },
  methods: {
    async createTrain() {
      const { value: train } = await Swal.fire({
        title: 'Create train',
        html:
          '<label for="fname">ID:</label><br>' +
          '<input type="text" id="ID""><br>' +
          '<label for="fname">Name:</label><br>' +
          '<input type="text" id="Name""><br>',
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById('ID').value,
            document.getElementById('Name').value,
          ]
        }
      })
      if (train) {
        axios.post(window.origin + '/TrainManager?ID=' + train[0] + '&Name=' + train[1]);
        swal.fire(
          'Created!',
          'New train can be on duty.',
          'success',
        )
        this.Trains.push({
              "ID" : train[0],
              "Name" : train[1]
        })
      }
    },
    async updateTrain(IDinput) {
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
          console.log(temp);
          if (temp) {
            axios.put(window.origin + '/TrainManager?ID=' + trainId + '&Name=' + temp[1]).then(
              function () {
                swal.fire(
                  'Updated!',
                  `Your train is updated.`,
                  'success',

                ).then(function () {
                  location.reload();
                });
              }
            )

          }
        })
    },
    delTrain(IDinput) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
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
          axios.delete(window.origin + '/TrainManager?ID=' + IDinput);

          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your train has been deleted.',
            'success',

          ).then(function () {
            location.reload();
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
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
      return this.Trains;
    }
  }
})