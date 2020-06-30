Vue.use(VueLoading);
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
        let loader = this.$loading.show({
            loader: 'dots'
        });
        setTimeout(() => loader.hide(), 1.5 * 1000)
        $("#myTable").DataTable();

    },
    mounted: function () {

        $("#menuseat").addClass("active");
    }

})