var express = require("express");
var config = require("./config/connectionString");
var controller = require("./controller/indexController");
var app = express();

app.use(express.static('node_modules'));
app.set('view engine',"ejs");



app.get("/",function(req,res){
    controller.index(req,res);
})




var server = app.listen(3000,function(){
    console.log("Run");
});