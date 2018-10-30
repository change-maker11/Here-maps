var express=require("express");
var socket=require("socket.io");
var server=require("./../startcopy");
var app=express.Router();
var con=require("./../sql_connection.js");
app.use(express.static("public"));
app.get("/",(req,res)=>{
    console.log("cookie ",req.cookies)
    if(req.cookies.username!=undefined)
    res.render("maps",{login:req.cookies.username,report:"See Report",logout:"logout",link:"map"});
    else
    res.render("maps",{login:"login",report:"",logout:"",link:""});
})
app.get("/report",(req,res)=>{
    console.log("cookie ",req.cookies)
    if(req.cookies.username!=undefined)
    {
        query='select lon ,lat from position where user="'+req.cookies.username+'"order by time;';
        con.query(query,(err,result)=>{
            if(err) throw err;
            else
            {
                console.log(result);
                res.render("map_report",{data:result,login:req.cookies.username});
            }
        })

    }
    else
    res.redirect("/");
})


module.exports=app;