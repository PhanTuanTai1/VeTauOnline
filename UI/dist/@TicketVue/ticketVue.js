Vue.component('test', {
    template: `<div id="a"><div class="row">
    <div class="col-xs-12">
        <div class="invoice-title">
            <h2>Invoice</h2><h3 class="pull-right">Order # 12345</h3>
        </div>
        <hr>
        <div class="row">
            <div class="col-xs-6">
                <address>
                <strong>Billed To:</strong><br>
                    John Smith<br>
                    1234 Main<br>
                    Apt. 4B<br>
                    Springfield, ST 54321
                </address>
            </div>
            <div class="col-xs-6 text-right">
                <address>
                <strong>Shipped To:</strong><br>
                    Jane Smith<br>
                    1234 Main<br>
                    Apt. 4B<br>
                    Springfield, ST 54321
                </address>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-6">
                <address>
                    <strong>Payment Method:</strong><br>
                    Visa ending **** 4242<br>
                    jsmith@email.com
                </address>
            </div>
            <div class="col-xs-6 text-right">
                <address>
                    <strong>Order Date:</strong><br>
                    March 7, 2014<br><br>
                </address>
            </div>
        </div>
    </div>
</div></div>`,
})

new Vue({
    el: "#app",
    created: function () {
        axios.get(window.origin + '/test')
            .then(res => {
                this.Tickets = res.data;
            })
    },
    data: {
        Tickets: null,
    },
    methods: {
        print()
        {
        //   var divToPrint= this.
          var newWin= window.open("");
          newWin.document.write(document.getElementById("a").outerHTML);
          newWin.print();
          newWin.close();
        }
    }
})