var express = require("express");
var config = require("./config/connectionString");
var app = express();

app.use(express.static('node_modules'));
app.set('view engine',"ejs");



app.get("/",function(req,res){
    config.ConnectDB.authenticate().then(()=>{
        console.log("Connect Success");
        res.end("Connect Success");
    })
    
    //res.render("index");
})




var server = app.listen(3000,function(){
    console.log("Run");
});