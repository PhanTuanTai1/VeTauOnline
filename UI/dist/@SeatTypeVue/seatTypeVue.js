new Vue({
    el: "#app",
    created: function () {
        axios.get(window.origin + "/getAllTypeOfSeat").then(res => {
            this.SeatTypes = res.data;
        })
    },
    data: {
        SeatTypes: null
    },
    methods: {

    },
    updated: function () {
        $("#myTable").DataTable();
    },
    mounted: function () {
        $("#menuseattype").addClass("active");
    }
})