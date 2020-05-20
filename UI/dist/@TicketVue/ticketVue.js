// Vue.component('test', {
//     template: `
//         <div id="app"><div id="a" v-for="item in Tickets">{{item.ID}}</div></div>
//     `,
// })



new Vue({
    el: "#app",
    created: async function () {
        await axios.get(window.origin + '/printTicket')
            .then(res => {
                this.Tickets = res.data;
            })
        await axios.get(window.origin + '/getAllSta').then(res => {
            this.Staions = res.data;
        })

    },
    data: {
        Tickets: null,
        Staions: null,

    },
    methods: {
        async SearchForTicket() {
            let input = await $("#repreID").val();
            if (input == "") {
                Swal.fire({
                    icon: 'error',
                    text: 'Please input representative ID!'
                })
            }
            else {
                let repre = await axios.get(window.origin + '/getAllRepre?repreID=' + input);
                if (repre.data.length == 0) {
                    Swal.fire({
                        icon: 'error',
                        text: 'Invalid representative ID!'
                    })
                }
                else {
                    let cus = await axios.get(window.origin + '/getAllCus');
                    let ticketList = [];
                    cus.data.filter(x => x.RepresentativeID == repre.data[0].ID).forEach(c => {
                        var tick = this.Tickets.find(t => t.CustomerID == c.ID && t.Status == 1);
                        if (tick != null) {
                            ticketList.push(tick);
                        }
                    });
                    if (ticketList.length == 0) {
                        Swal.fire({
                            icon: 'error',
                            text: 'Tickets are not available!'
                        })
                    }
                    else {
                        Swal.fire({
                            title: 'Ticket information',
                            html: `
                            <div>
                                <p>Name: <strong>${repre.data[0].Name}</strong></p>
                                <p>Email: ${repre.data[0].Email}</p>
                                <p>Passport: ${repre.data[0].Passport}</p>
                                <p>Phone: ${repre.data[0].Phone}</p>
                                <p>Ticket amount: ${ticketList.length}</p>
                                <p>Date booking: ${new Date(repre.data[0].DateBooking).toDateString()}</p>
                            </div>
                            `,
                            icon: 'success',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Print'
                        }).then((result) => {
                            if (result.value) {
                                this.editStatus(ticketList);
                            }
                        })

                    }
                }
            }
        },
        async editStatus(ticketList) {
            await ticketList.forEach(ticket => {
                axios.put(window.origin + '/admin/ticket?cusID=' + ticket.CustomerID + '&request=print')
            });
            this.printTicket(ticketList);
        },
        printTicket(arr) {
            var newWin = window.open("", "");
            newWin.document.write(`<html><head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style type="text/css">
                @import url('https://fonts.googleapis.com/css?family=Oswald');

                @media print {
                * {
                    margin: 0;
                    padding: 0;
                    border: 0;
                    box-sizing: border-box
                }

                body {
                    background-color: #dadde6;
                    font-family: arial;
                    display: inline-block;
                }

                .fl-left {

                    float: left;
                }

                .fl-right {
                    float: right
                }

                .container {
                    width: 100%;
                    margin: 100px auto;

                }
                .row{
                    margin-top:20px;
                    margin-bottom:10px;
                }
                .row .card {
                    width:100%;
                    display: table-row;
                    background-color: #96C8E8;
                    color: #989898;
                    margin-bottom: 10px;
                    font-family: 'Oswald', sans-serif;
                    text-transform: uppercase;
                    border-radius: 4px;
                    position: relative;
                    border: 1px solid black;
                }


                .date {
                    display: table-cell;
                    width: 25%;
                    position: relative;
                    text-align: center;
                    border-right: 2px dashed #dadde6
                }

                .date:before,
                .date:after {
                    content: "";
                    display: block;
                    width: 30px;
                    height: 30px;
                    background-color: #DADDE6;
                    position: absolute;
                    top: -15px;
                    right: -15px;
                    z-index: 1;
                    border-radius: 50%
                }

                .date:after {
                    top: auto;
                    bottom: -15px
                }

                .date time {
                    display: block;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    -webkit-transform: translate(-50%, -50%);
                    -ms-transform: translate(-50%, -50%);
                    transform: translate(-50%, -50%)
                }

                .date time span {
                    display: block
                }

                .date time span:first-child {
                    color: #2b2b2b;
                    font-weight: 600;
                    font-size: 250%
                }

                .date time span:last-child {
                    text-transform: uppercase;
                    font-weight: 600;
                    margin-top: -10px
                }

                .card-cont {
                    display: table-cell;
                    width: 75%;
                    font-size: 85%;
                    padding: 10px 10px 30px 50px
                }

                .card-cont h3 {
                    color: #3C3C3C;
                    font-size: 130%
                }

                .card-cont>div {
                    display: table-row
                }

                .card-cont .even-date i,
                .card-cont .even-info i,
                .card-cont .even-date time,
                .card-cont .even-info p {
                    display: table-cell
                }

                .card-cont .even-date i,
                .card-cont .even-info i {
                    padding: 5% 5% 0 0
                }

                .card-cont .even-info p {
                    padding: 30px 50px 0 0
                }

                .card-cont .even-date time span {
                    display: block
                }

                .card-cont .seat {
                    display: block;
                    text-decoration: none;
                    width: 80px;
                    font-size:48px;
                    background-color: #037FDD;
                    color: red;
                    text-align: center;
                    border-radius: 2px;
                    position: absolute;
                    right: 10px;
                    bottom: 10px
                }

                .row:last-child .card:first-child .card-cont a {
                    background-color: #037FDD
                }

                .row:last-child .card:last-child .card-cont a {
                    background-color: #037FDD
                }
                }
            </style><body><section class="ticket"> 
            `);
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            newWin.document.write(`${arr.map(t => {
                newWin.document.write(`<div class="row">
                    <article class="card fl-left" style="">
                    <section class="date">
                        <time datetime="23th feb">
                        <span>${new Date(t.DepartureDate).getDate()} </span> <span>${months[new Date(t.DepartureDate).getMonth()]}</span>
                        </time>
                    </section>
                    <section class="card-cont">
                        <p style="font-size:1em;">${t.Customer.Name}</p>
                        <h3>${this.Staions.find(x => x.ID == t.DepartureStationID).Name} to ${this.Staions.find(x => x.ID == t.ArrivalStationID).Name}</h3 >
                    <div class="even-date">
                        <i class="fa fa-calendar"></i>
                        <time>
                            <span>${new Date(t.DepartureDate).toDateString()}</span>
                            <span>${new Date(t.DepartureTime).toLocaleTimeString()}</span>
                        </time>
                    </div>
                    <div class="even-info">
                        <i class="fa fa-map-marker"></i>
                        <h3 style="color:red;">${t.TrainName}</h3>
                        <p>${t.Price}</p>
                    </div>
                    <h1 class="seat" style="color:red;">${t.Seat.SeatNumber}</h1>
                    </section >
                    </article >
                        <hr style="width: 100%;border-top: 1px dashed black;">
                        </hr>

                </div > `)
            })}`)
            newWin.document.write(`</section></body></html>`)
            newWin.print();
            newWin.close();
        }


        //   var divToPrint= this.
    },
    updated: function () {
        $("#myTable").DataTable();
    }
})