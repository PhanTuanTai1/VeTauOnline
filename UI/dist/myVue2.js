new Vue({
    el: "#app",
    created: function(){
        this.result = JSON.parse(document.getElementById("myData").value);
        alert(JSON.stringify(this.result[0].ScheduleDetails));
    },
    data:{
        result: null
    }
})