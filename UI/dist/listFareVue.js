new Vue({
    el: "#app",
    created:async function(){
        await axios.get('/getAllScheduleClient').then(res => {
            //alert(JSON.stringify(res.data))  
            this.listSchedule = res.data;           
        })

        await axios.get('/getAllStation').then(res => {   
            //alert(JSON.stringify(res.data))  
            this.Station = res.data;
        })

        await axios.get('/getAllTrain').then(res => {
            //alert(JSON.stringify(res.data)) 
            this.Train = res.data;
        })
        this.Convert();
    },
    updated: function() {
        if(!this.listScheduleConverted) $("#table_id").DataTable();
    },
    data: {
        listSchedule: [],
        Station: [],
        Train: [],
    },
    methods: {
        TrainName: function(TrainID) {
            var train = this.Train.filter(train => {
                return train.ID == TrainID;
            })

            return train[0].Name; 
        },
        Convert: function(){
            this.listSchedule.forEach(data => {
                //alert(this.TrainName(data.TrainID));
                data.TrainName = this.TrainName(data.TrainID)
            })    
            $("#table_id").DataTable();
        }
    },
    computed: {
        listScheduleConverted() {
            return this.listSchedule;
        }
    }
})