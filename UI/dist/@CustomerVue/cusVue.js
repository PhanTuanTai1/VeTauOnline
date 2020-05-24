

new Vue({
  el: "#app",
  created: function () {
    axios.get(window.origin + '/getAllCus')
      .then(res => {
        this.Customers = res.data;
      })
  },
  data: {
    Customers: null,
  },
  updated: function () {
    $("#myTable").DataTable();
  },
  watch: {
    Customers: {
      handler(newData) {
        console.log(`Trains length is ${this.Customers.length}`);
      },
      deep: true,
    }
  },
  methods: {
    //Test toast
    // show() {
    //   const Toast = Swal.mixin({
    //     toast: true,
    //     position: 'top-end',
    //     showConfirmButton: false,
    //     timer: 3000,
    //     timerProgressBar: true,
    //     onOpen: (toast) => {
    //       toast.addEventListener('mouseenter', Swal.stopTimer)
    //       toast.addEventListener('mouseleave', Swal.resumeTimer)
    //     }
    //   })
    //   Toast.fire({
    //     icon: 'success',
    //     title: 'Signed in successfully'
    //   })
    // },
    async updateCus(IDinput, index) {
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
      });
      let cusByID = await this.Customers.find(x => x.ID == IDinput)
      const { value: temp } = await Swal.fire({
        title: 'Update customer',
        html:
          '<label for="fname">ID:</label><br>' +
          `<input type="text" id="ID" value="${cusByID.ID}" disabled><br>` +
          '<label for="fname">Name:</label><br>' +
          `<input type="text" value="${cusByID.Name}" id="Name""><br>` +
          '<label for="fPassport">Passport:</label><br>' +
          `<input type="number" value="${cusByID.Passport}" id="Passport""><br>`,
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById('ID').value,
            document.getElementById('Name').value,
            document.getElementById('Passport').value,
          ]
        }
      })
      if (temp) {
        axios.put(window.origin + '/admin/customer?ID=' + temp[0] + '&Name=' + temp[1] + '&Passport=' + temp[2]).then(
          res => {
            this.$set(this.Customers, index, { "ID": temp[0], "Name": temp[1], "Passport": temp[2] })
          }
        ).then(
          Toast.fire({
            icon: 'success',
            title: `Customer #${temp[0]} updated`
          }));

      }
    },
    // async createCus() {
    //   const { value: cus } = await Swal.fire({
    //     title: 'Multiple inputs',
    //     html:
    //       '<label for="fname">ID:</label><br>' +
    //       '<input type="text" id="ID""><br>' +
    //       '<label for="fname">Name:</label><br>' +
    //       '<input type="text" id="Name""><br>' +
    //       '<label for="lname">Passport:</label><br>' +
    //       '<input type="text" id="Passport"><br><br>' +
    //       '<label for="lname">Repre:</label><br>' +
    //       '<input type="text" id="Repre" value="1"><br><br>',
    //     focusConfirm: false,
    //     preConfirm: () => {
    //       return [
    //         document.getElementById('ID').value,
    //         document.getElementById('Name').value,
    //         document.getElementById('Passport').value,
    //         document.getElementById('Repre').value,
    //       ]
    //     }
    //   })

    //   if (cus) {
    //     axios.post(window.origin+'/admin/customer?ID=' + cus[0] + '&Name=' + cus[1] + '&Passport=' + cus[2] + '&RepresentativeID=' + cus[3]);
    //     swal.fire(
    //       'Created!',
    //       'New customer arrived.',
    //       'success',

    //     ).then(function () {
    //       location.reload();
    //     });
    //   }
    // },
    // delCus(IDinput) {
    //   const swalWithBootstrapButtons = Swal.mixin({
    //     customClass: {
    //       confirmButton: 'btn btn-success',
    //       cancelButton: 'btn btn-danger'
    //     },
    //     buttonsStyling: false
    //   })

    //   swalWithBootstrapButtons.fire({
    //     title: 'Are you sure?',
    //     text: "You won't be able to revert this!",
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonText: 'Yes, delete it!',
    //     cancelButtonText: 'No, cancel!',
    //     reverseButtons: true
    //   }).then((result) => {
    //     if (result.value) {
    //       axios.delete(window.origin + '/admin/customer?ID=' + IDinput);

    //       swalWithBootstrapButtons.fire(
    //         'Deleted!',
    //         'Your file has been deleted.',
    //         'success',

    //       ).then(function () {
    //         location.reload();
    //       });
    //     } else if (
    //       /* Read more about handling dismissals below */
    //       result.dismiss === Swal.DismissReason.cancel
    //     ) {
    //       swalWithBootstrapButtons.fire(
    //         'Cancelled',
    //         'Your imaginary file is safe :)',
    //         'error'
    //       )
    //     }
    //   })
    // },
  },

})