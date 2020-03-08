new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: () => ({ 
    departDate: new Date().toISOString().substr(0, 10),
    returnDate: new Date().toISOString().substr(0, 10),
    menu2: false,
    menu: false,
  }),
})