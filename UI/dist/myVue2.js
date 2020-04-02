new Vue({
    el: "#app",
    created: async function(){
        this.result = JSON.parse(document.getElementById("myData").value);

        await axios.get('http://localhost:3000/getAllTrain')
        .then(res => {                 
        this.train = res.data;
        })
        await axios.get('http://localhost:3000/getAllStation')
        .then(res => {
        this.Stations = res.data;
        }) 
        this.departure = this.getStationName(this.result[0].ScheduleDetails[0].DepartureStationID);
        this.arrival = this.getStationName(this.result[0].ScheduleDetails[0].ArrivalStationID);
        this.listTrain = await this.loadListTrain();
        
    },
    
    data:{
        result: null,
        train: null,
        departure: null,
        arrival: null,  
        Stations: null,
        listTrain: [],
        listScheduleDetail: new Set()
    },

    methods:{
        getStationName(stationID) {
            var result = this.Stations.filter(station =>{
                return station.ID == stationID
            })
            return result[0].Name
        },
        loadListTrain(){
            var result = this.result.map(result => {return result.TrainID});
            var filter = this.train.filter(train => {
                return train.ID == result;
            })
            return filter;
        },

        loadScheduleDetail: function(index, trainID){
            var train = this.result.filter(result => {
                return result.TrainID == trainID;
            })

            var url = "http://localhost:3000/scheduleDetail?TRAINID=" 
                        + train[0].TrainID + "&SCHEDULEID=" + train[0].ID + "&DepartID=" 
                        + train[0].ScheduleDetails[0].DepartureStationID
                        + "&ArrivalID=" + train[0].ScheduleDetails[0].ArrivalStationID;

            axios.get(url)
            .then( resp => {
                // document.getElementById('icon_1').setAttribute("style" , "vi.sibility: hidden;");
                // document.getElementById('icon_2').removeAttribute("hidden");

                localStorage.setItem(trainID, resp.data);
            })
            .then(() => {
                this.displaySchedule(index, trainID);
                // document.getElementById('icon_1').removeAttribute("style");
                // document.getElementById('icon_2').setAttribute("hidden" , "");
            })
        },
        
        getScheduleID: function(trainID){
            var single_result =  this.result.filter(result => {
                return result.TrainID == trainID;
            })
            return single_result.ID;
        },

        displaySchedule: function(index, trainID){
            var html = this.createElementFromHTML(localStorage.getItem(trainID));
            var tableRef = document.getElementById('parent');
            var row = tableRef.insertRow(index + 1);
            row.replaceWith(html);
        },

        createElementFromHTML: function(htmlString){
            var table = document.createElement('table');
            table.innerHTML = htmlString.trim();
            // Change this to div.childNodes to support multiple top-level nodes
            return table.firstChild.firstChild; 
          },
    },
})