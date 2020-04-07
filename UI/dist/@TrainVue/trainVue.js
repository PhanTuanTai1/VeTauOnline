new Vue({
    el: "#app",
    created: function () {
      axios.get('http://localhost:3000/getAllTrain')
        .then(res => {
          this.Trains = res.data;
        })
    },
    data: {
      Trains: null,
    },
    methods: {
  
    },
  
  })