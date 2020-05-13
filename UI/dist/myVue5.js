new Vue({
    el: '#app',
    created: async function(){
        
    },
    mounted: function(){
        document.body.style['overflow'] = "scroll";
        document.getElementById('waiting_overlay').style['display'] = "none";
        document.getElementById("tableResult_1").innerHTML = localStorage.getItem("tableResult");
    },
    data: {
        
    },
    methods: {
        
    }
})