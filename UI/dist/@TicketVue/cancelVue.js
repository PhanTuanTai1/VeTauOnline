Vue.use(VueLoading);
new Vue({
    el: "#app",
    created: function () {
        axios.get(window.origin + '/printTicket')
            .then(res => {
                this.Ticket = (res.data).filter(x => x.Status == 4);
            })
        axios.get("/getAllSta").then(res => {
            this.Station = res.data;
        });
    },
    data: {
        Ticket: null,
        Station: null
    },

    updated: function () {
        let loader = this.$loading.show({
            loader: 'dots'
        });
        setTimeout(() => loader.hide(), 1.5 * 1000)
        $("#myTable").DataTable();
        $("#menucancelticket").addClass("active");
    },
    methods: {
        formatDate(date) {
            return new Date(date).toDateString();
        },
        formatTime(time) {
            return moment(time).add(-8, "hours").format("HH:mm");
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
        async cancelAllTicket() {
            var mail = null;

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
                    (this.Ticket.map(async x => {
                        var ticket = await this.Ticket.find(t => t.ID == x.ID);
                        console.log(ticket);
                        var from = await this.Station.find(t => t.ID == ticket.DepartureStationID).Name;
                        var to = await this.Station.find(t => t.ID == ticket.ArrivalStationID).Name;
                        let item = this.Ticket.find(t => t.ID == x.ID)
                        mail = (await axios.get("/getAllCus")).data.find(p => p.ID == this.Ticket.find(t => t.ID == x.ID).CustomerID).Representative.Email;
                        axios.put("/cancelTicketWithMail?id=" + x.ID + "&mail=" + mail + "&from=" + from + "&to=" + to);
                        this.Ticket.splice(this.Ticket.indexOf(item), 1)
                    }));

                    Toast.fire({
                        icon: 'success',
                        title: `All pending ticket are canceled`
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
        async cancelOneTicket(IDinput, index) {
            var ticket = await this.Ticket.find(x => x.ID == IDinput);
            console.log(ticket);
            var from = await this.Station.find(x => x.ID == ticket.DepartureStationID).Name;
            var to = await this.Station.find(x => x.ID == ticket.ArrivalStationID).Name;
            var mail = (await axios.get("/getAllCus")).data.find(x => x.ID == this.Ticket.find(t => t.ID == IDinput).CustomerID).Representative.Email;
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
                    axios.put("/cancelTicketWithMail?id=" + IDinput + "&mail=" + mail + "&from=" + from + "&to=" + to);
                    this.Ticket.splice(index, 1)
                    Toast.fire({
                        icon: 'success',
                        title: `Ticket #${IDinput} deleted`
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
        listTicket() {
            return this.Ticket;
        }
    },
    mounted: function () {

    }
})