var express=require('express');
var con=require('./sql_connection');
var routes=require('./route/routescopy');
var app=express();
var cookieParser=require('cookie-parser');
var socket=require("socket.io");
var maproutes=require("./route/mapback");
//view engine
app.set("view engine",'ejs');

//static folder
app.use(express.static('public'));

//routes files
app.use(cookieParser());
app.use('/',routes);
app.use('/map',maproutes);


var server=app.listen(1000,()=>{
console.log("server up at 1000");});

var io=socket(server);
io.on("connection",function(socket){
    console.log("Socket Connection made");

    socket.on('position',function(data){
        if(data.user!="")
        {
            console.log(data);
            var user=data.user.slice(9);
            user= decodeURIComponent(user);
            var query='insert into position values("'+user+'",'+data.lon+','+data.lat+','+data.time+');';
            console.log(query);
            con.query(query,(err,res)=>
            {
                if(err)
                throw err;
            })
        }
        else
        console.log("Not Logged In");
    })
});

module.exports=server;
