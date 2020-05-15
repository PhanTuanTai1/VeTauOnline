new Vue({
    el: "#app",
    created: function () {
        axios.get(window.origin + "/getAllSeat").then(res => {
            this.Seats = res.data;
        })
    },
    data: {
        Seats: null
    },
    methods: {

    }
})