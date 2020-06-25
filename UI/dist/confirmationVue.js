function Cancel(object, TicketID, index){
    vm.changeStatus(object, TicketID, index);
}

function CancelTicket(){
    vm.CancelTicket();
}

function ClearData(){
    vm.ClearData();
}

var vm = new Vue({
    el: '#app',
    created: async function(){
        await axios.get('/getAllStation').then(res => {
            this.station = res.data; 
        })
        await axios.get('/getAllTypeObject').then(res => {
            this.typeObject = res.data;
            
        })
        this.loadData();
    },
    mounted: function(){
        
        document.body.style['overflow'] = "scroll";
        document.getElementById('waiting_overlay').style['display'] = "none";
        // document.getElementById("tableResult_1").innerHTML = localStorage.getItem("tableResult");
    
    },
    data: {
        station: null,
        typeObject: null,
        status: {
            1: "NOT PRINT",
            2: "PRINTED",
            3: "CANCEL",
            4: "WAITING CANCEL"
        },
        tempData: null
    },
    methods: {
        loadData: function(){
            var DepartGroup = document.getElementsByName("DepartureStationID");
            var ArriveGroup = document.getElementsByName("ArrivalStationID");
            var TypeObjectGroup = document.getElementsByName("TypeObjectID");
            var StatusTicketGroup = document.getElementsByName("StatusTicket");

            for(var i = 0; i < DepartGroup.length; i++){
                DepartGroup[i].innerHTML = this.getStationByID(DepartGroup[i].getAttribute('data-id'));
            }

            for(var i = 0; i < ArriveGroup.length; i++){
                ArriveGroup[i].innerHTML = this.getStationByID(ArriveGroup[i].getAttribute('data-id'));
            }

            for(var i = 0; i < TypeObjectGroup.length; i++){
                TypeObjectGroup[i].innerHTML = this.getTypeObject(TypeObjectGroup[i].getAttribute('data-id'));
            }

            for(var i = 0; i < StatusTicketGroup.length; i++){
                StatusTicketGroup[i].innerHTML = this.status[StatusTicketGroup[i].getAttribute('data-status')]
            }
        },

        getStationByID: function(ID){
            //alert(JSON.stringify(this.station));
            var result = this.station.filter(data => {
                return data.ID == ID;
            })
            //alert(JSON.stringify(result));
            return result[0].Name
        },

        getTypeObject: function(ID){
            //alert(JSON.stringify(this.typeObject));
            var result = this.typeObject.filter(data => {
                return data.ID == ID;
            })
            //alert(JSON.stringify(result));
            return result[0].TypeObjectName;
        },

        changeStatus(object, TicketID, index){
            $("#confirm").modal({
                fadeDuration: 100
            });
            
            //alert(JSON.stringify(DOM));
            var data = {
                TicketID: TicketID,
                index: index

            }
            
            this.tempData = data;
        },

        CancelTicket(){
            var lstBtn = document.getElementsByName('btnCancel');
            var parent = document.getElementById("parent" + this.tempData.index);
            axios.get('/changeStatus?TicketID=' + this.tempData.TicketID).then(res => {
                parent.removeChild(lstBtn[this.tempData.index]);
                var StatusTicketGroup = document.getElementsByName("StatusTicket");
                StatusTicketGroup[this.tempData.index].innerHTML = this.status[4];
                $('#confirm').modal('hide');
            })
        },

        ClearData(){
            this.tempData = null;
            $('#confirm').modal('hide');
        }
    }
})