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

    },
    updated: function () {
        $("#myTable").DataTable();

        console.log(this.Seats.find(x => x.CarriageID == null))
    },
    mounted: function () {
        $("#menuseat").addClass("active");
    }

})