
new Vue({
    el: "#app",
    created: async function(){

        this.result = JSON.parse(document.getElementById("myData").value);
        document.getElementById("myData").replaceWith("");
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
        this.listTrain = this.loadListTrain();
        alert(JSON.stringify(this.result));
        
    },
    data:{
        result: null,
        train: null,
        departure: null,
        arrival: null,  
        Stations: null,
        listTrain: [],
        listScheduleDetail: new Set(),
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
            var listTrain = [];
            result.forEach(id => {
                var filter = this.train.filter(train => {
                    return train.ID == id;
                })
                listTrain.push(filter[0]);
            })
            return listTrain;
        },

        loadScheduleDetail: function(index,trainID){
            
            // obj.setAttribute("class", "result clickable_tr train vr clicked checking");
            var tr = document.getElementById('parent' + trainID).childNodes.item(0);
            tr.setAttribute("class","result clickable_tr train vr clicked checking");

            var train = this.getScheduleDetailByTrainID(trainID);
            
            var url = "http://localhost:3000/scheduleDetail?TRAINID=" 
                        + train[0].TrainID + "&SCHEDULEID=" + train[0].ID + "&DepartID=" 
                        + train[0].ScheduleDetails[0].DepartureStationID
                        + "&ArrivalID=" + train[0].ScheduleDetails[0].ArrivalStationID;

            axios.get(url)
            .then( resp => {
                // document.getElementById('icon_1').setAttribute("style" , "vi.sibility: hidden;");
                // document.getElementById('icon_2').removeAttribute("hidden");

                this.displaySchedule(resp.data, trainID);
                document.getElementById('collapse_' + trainID).setAttribute("style", "border-bottom: 1px solid rgb(232, 232, 232);display: table-row;");
            })
            .then(() => {
                tr.setAttribute("class","result clickable_tr train vr clicked");
                
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

        displaySchedule: function(html, trainID){
            var tableRef = document.getElementById('collapse_' + trainID);
            tableRef.innerHTML = html;
        },

        createElementFromHTML: function(htmlString){
            var table = document.createElement('table');
            table.innerHTML = htmlString.trim();
            // Change this to div.childNodes to support multiple top-level nodes
            return table.firstChild.firstChild; 
        },

        getScheduleDetailByTrainID: function(trainID){
            return this.result.filter(result => {
                return result.TrainID == trainID;
            })
        },

        formatDate: function(date){
            return moment(date).format('DD-MM-YYYY');
        }
    },
    components: {
        vuejsDatepicker,
      }
})