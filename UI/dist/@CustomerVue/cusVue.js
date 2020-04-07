Vue.component("test-modal", {

  template: `
  <div id="modaltest" class="modal is-active">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Modal title</p>
      <button class="delete" aria-label="close"></button>
    </header>
    <section class="modal-card-body">
      <!-- Content ... -->
    </section>
    <footer class="modal-card-foot">
      <button class="button is-success">Save changes</button>
      <button class="button">Cancel</button>
    </footer>
  </div>
</div>`
});
Vue.component("abc",{
  template: `<h1>abc</h1>`
})


new Vue({
  el: "#app",
  created: function () {
    axios.get('http://localhost:3000/getAllCus')
      .then(res => {
        this.Customers = res.data;
      })
  },
  data: {
    Customers: null,
  },
  methods: {

  },

})