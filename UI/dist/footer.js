Vue.component('my-footer', {
    template: `<div><strong>Copyright &copy; 2020 <a href="http://localhost:3000/admin">Train booking</a>.</strong>
      All rights reserved.
      <div class="float-right d-none d-sm-inline-block">
          <b>Version</b> 1.0
      </div></div>`
})
new Vue({
    el: "#myfooter",
})