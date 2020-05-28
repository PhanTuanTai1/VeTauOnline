new Vue({
    el: "#app",
    created: function () {
        axios.get(window.origin + '/printTicket')
            .then(res => {
                this.Tickets = res.data;
            })
        axios.get("/getAllSta").then(res => {
            this.Station = res.data;
        });
    },
    data: {
        Tickets: null,
        Station: null,
    },
    methods: {
        formatDate(date) {
            return new Date(date).toDateString();
        },
        formatTime(time) {
            return moment(time).add(-8, "hours").format("HH:mm");
        },
        from(from) {
            return this.Station.find(x => x.ID == from).Name;
        },
        to(to) {
            return this.Station.find(x => x.ID == to).Name;
        },
        formatStatus(status) {
            if (status == 1) {
                $("#status").attr('color', "green");
                return "Ready";
            }
            if (status == 2) {
                return "Printed";
            }
            if (status == 3) {
                return "Cancel";
            }
        },

    },
})