Vue.use(VueLoading);
new Vue({
    el: "#app",
    created: function () {
        axios.get(window.origin + '/printTicket')
            .then(res => {
                this.Tickets = res.data;
            })
        axios.get("/getAllSta").then(res => {
            this.Station = res.data;
        });
    },
    data: {
        Tickets: null,
        Station: null,
    },
    methods: {
        formatDate(date) {
            return new Date(date).toDateString();
        },
        formatTime(time) {
            return moment(time).add(-8, "hours").format("HH:mm");
        },
        from(from) {
            if (this.Station != null) {
                return this.Station.find(x => x.ID == from).Name;
            }

        },
        to(to) {
            if (this.Station != null) {
                return this.Station.find(x => x.ID == to).Name;
            }

        },
        formatStatus(status) {
            if (status == 1) {
                return `<p class="badge badge-warning">Pending</p>`;
            }
            if (status == 2) {
                return `<p class="badge badge-success">Printed</p>`;
            }
            if (status == 3) {
                return `<p class="badge badge-danger">Canceled</p>`;
            }
        },

    },
    computed: {
        listSta() {
            return this.Station;
        },

    },
    updated: function () {
        $("#TicketTable").DataTable();
        $("#menudashboard").addClass("active");

    },
    mounted: async function () {
        let loader = this.$loading.show({
            loader: 'dots'
        });
        setTimeout(() => loader.hide(), 1.5 * 1000)
        const countTickByMonth = [];
        const countTickByStatus = [];
        const priceMonth = [];
        const priceYear = [];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const statusNames = ['Pending', 'Printed', 'Canceled'];
        let data = (await axios.get(window.origin + '/printTicket')).data;
        let monthlist = [...new Set(data.map(x => new Date(x.DepartureDate).getMonth()))];
        monthlist.map(x => {
            const value = {
                'x': monthNames[x],
                'y': data.filter(c => (new Date(c.DepartureDate).getMonth()) == x).length
            }
            countTickByMonth.push(value);
        })

        let statuslist = [...new Set(data.map(x => x.Status))];
        countTickByStatus.push(data.filter(x => x.Status == true).length,
            data.filter(x => x.Status == 2).length,
            data.filter(x => x.Status == 3).length);
        var lineTick = document.getElementById('lineChartTicket').getContext('2d');
        var pieTick = document.getElementById('pieChartTicket').getContext('2d');

        var chart = new Chart(lineTick, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: monthNames,
                datasets: [{
                    label: 'Sold tickets',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: countTickByMonth,
                    fontColor: 'white',
                    pointBorderColor: 'white',


                }]
            },

            // Configuration options go here
            options: {
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        fontColor: 'white'
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: 'white',
                            color: 'white',
                        },
                        gridLines: {
                            color: "rgba(255,255,255,0.5)",
                            zeroLineColor: "rgba(255,255,255,0.5)"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontColor: 'white',
                            color: 'white'
                        },
                        gridLines: {
                            color: "rgba(255,255,255,0.5)",
                            zeroLineColor: "rgba(255,255,255,0.5)"
                        }
                    }]
                },
                title: {
                    display: true,
                    text: 'Sold ticket by month',
                    fontColor: 'white'
                }
            }
        });

        var myPieChart = new Chart(pieTick, {
            type: 'pie',
            data: {
                datasets: [{
                    label: 'Sold tickets',
                    backgroundColor: [
                        'rgba(255,193,7)',
                        'green',
                        'red'
                    ],
                    borderColor: [
                        'white',
                        'white',
                        'white'
                    ],
                    data: countTickByStatus,
                }],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: [
                    'Pending',
                    'Printed',
                    'Canceled'
                ]
            },
            options: {
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        fontColor: 'white'
                    }
                },
                title: {
                    display: true,
                    text: 'Sole ticket status',
                    fontColor: 'white'
                }
            }
        });

        monthlist.map(x => {
            let sum = 0;
            data.filter(c => (new Date(c.DepartureDate).getMonth()) == x).map(x => {
                sum += x.Price
            })
            const value = {
                'x': monthNames[x],
                'sum': sum,
            }
            priceMonth.push(value);
        })
        let a = [];
        monthNames.forEach(e => {
            if (priceMonth.find(res => res.x == e) != null) {
                a.push(priceMonth.find(res => res.x == e).sum)
            }
            else {
                a.push(0);
            }
        })
        var barPriceMonth = document.getElementById('barPriceMonth').getContext('2d');
        var myBarChart = new Chart(barPriceMonth, {
            type: 'bar',
            data: {
                labels: monthNames,
                datasets: [{
                    label: 'Revenue',
                    backgroundColor: 'rgb(255,255,0,0.5)',
                    borderColor: 'rgb(255,255,0,0.5)',
                    data: a,
                }]
            },
            options: {
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        fontColor: 'white'
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: 'white',
                            color: 'white',
                        },
                        gridLines: {
                            color: "rgba(255,255,255,0.5)",
                            zeroLineColor: "rgba(255,255,255,0.5)"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontColor: 'white',
                            color: 'white'
                        },
                        gridLines: {
                            color: "rgba(255,255,255,0.5)",
                            zeroLineColor: "rgba(255,255,255,0.5)"
                        }
                    }]
                },
                title: {
                    display: true,
                    text: 'Revenue by month',
                    fontColor: 'yellow'
                }
            }
        });
        var barPriceYear = document.getElementById('barPriceYear').getContext('2d');
        var currYear = (new Date()).getFullYear();
        var listPrice = await this.Tickets;
        var sumCurr2 = 0;
        listPrice.filter(x => (new Date(x.DepartureDate).getFullYear()) == (currYear - 2)).map(x => {
            sumCurr2 += x.Price;
        });
        var sumCurr1 = 0;
        listPrice.filter(x => (new Date(x.DepartureDate).getFullYear()) == (currYear - 1)).map(x => {
            sumCurr1 += x.Price;
        });
        var sumCurr = 0;
        listPrice.filter(x => (new Date(x.DepartureDate).getFullYear()) == currYear).map(x => {
            sumCurr += x.Price;
        });
        var myBarChart = new Chart(barPriceYear, {
            type: 'horizontalBar',
            data: {
                labels: [currYear - 2, currYear - 1, currYear],
                datasets: [{
                    label: 'Revenue',
                    backgroundColor: 'rgb(255,255,0,0.5)',
                    borderColor: 'rgb(255,255,0,0.5)',
                    data: [sumCurr2, sumCurr1, sumCurr]
                }]
            },
            options: {
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        fontColor: 'white'
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: 'white',
                            color: 'white',
                        },
                        gridLines: {
                            color: "rgba(255,255,255,0.5)",
                            zeroLineColor: "rgba(255,255,255,0.5)"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontColor: 'white',
                            color: 'white'
                        },
                        gridLines: {
                            color: "rgba(255,255,255,0.5)",
                            zeroLineColor: "rgba(255,255,255,0.5)"
                        }
                    }]
                },
                title: {
                    display: true,
                    text: 'Revenue by year',
                    fontColor: 'yellow'
                }
            }
        });
    }
})