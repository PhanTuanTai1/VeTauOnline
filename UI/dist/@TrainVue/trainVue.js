new Vue({
  el: "#app",
  created: function () {
    axios.get('http://localhost:3000/getAllTrain')
      .then(res => {
        this.Trains = res.data;
      })
  },
  data: {
    Trains: null,
  },
  methods: {
    async createTrain() {
      const { value: train } = await Swal.fire({
        title: 'Create train',
        html:
          '<label for="fname">ID:</label><br>' +
          '<input type="text" id="ID""><br>' +
          '<label for="fname">Name:</label><br>' +
          '<input type="text" id="Name""><br>' ,
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById('ID').value,
            document.getElementById('Name').value,
          ]
        }
      })

      if (train) {
        axios.post('http://localhost:3000/TrainManager?ID=' + train[0] + '&Name=' + train[1]);
        swal.fire(
          'Created!',
          'New train can be on duty.',
          'success',

        ).then(function () {
          location.reload();
        });
      }
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
          axios.delete('http://localhost:3000/TrainManager?ID=' + IDinput);

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

})