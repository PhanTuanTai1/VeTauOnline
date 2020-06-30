Vue.use(VueLoading);
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
        let loader = this.$loading.show({
            loader: 'dots'
        });
        setTimeout(() => loader.hide(), 1.5 * 1000)
        $("#menuseattype").addClass("active");
    }
})