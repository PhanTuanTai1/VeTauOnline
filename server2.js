var express = require('express');
var cors = require('cors');
const app = express();
var cookieParser = require('cookie-parser')
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var port = process.env.PORT || 4000;
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var scheduleApi = require("./ApiController/scheduleApi");

app.use(cors())
app.use(urlencodedParser);
app.use(jsonParser);
app.use(express.static('UI'));


app.get('/Schedule/GetAllSchedule', (req,res) => {
    scheduleApi.GetAllSchedule(req,res);
})

app.listen(port, () => {
    console.log("Example app listening at http://localhost:${port}");
})