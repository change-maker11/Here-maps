var express=require("express");
var app=express();
var route=express.Router();
var mysql=require('mysql');
var bodyparser=require('body-parser');
var multer  = require('multer');
//mysql connection
var con=require("./../sql_connection")

//app.use(express.static("public"));
//bodyparser initialization
var parser=bodyparser.urlencoded({extended:false});

//multer initialization
var storage=multer.diskStorage({
    destination:'public/uploads',
    filename :function(req,file,callback)
    {
        callback(null,file.fieldname+Date.now()+file.originalname);
    }
});
var upload=multer({storage:storage});

//routes

//main index route
route.get("/",(req,res)=>{
    if(req.cookies.username!=undefined)
    res.render('index',{data:"",check:"",values:"",sucess:"",login:req.cookies.username,logout:"logout"});
    else
    res.render('index',{data:"",check:"",values:"",sucess:"",login:"Goto Map",logout:""});
});

//login route to profile
route.post("/login",parser,(req,res)=>{ 
    res.cookie('username',req.body.email);       //add passport authencitate
    console.log("created cookie");
    check_id(req.body.email,(result)=>{
    if(result==req.body.pass)               //function to check if user id already exist or not
    {
        var myquery='select * from info where username ="'+req.body.email+'";';
        con.query(myquery,(err,queryres)=>{
            if(err) throw err;
            else 
            {
                res.cookie('username',req.body.email);
            res.render("profile",{data:queryres[0]});
            }
        });
    }

    else 
    res.render('index',{data:"Wrong Email or password",check:"",values:"",sucess:"",login:"Goto Map",logout:""});
    })
});

//signup route
route.post("/new",upload.array("pic",[,3]),(req,res)=>{
    check_id(req.body.newemail,(result)=>{
    if(result==1)               //function to check if user id already exist or not
    {
    create_account(req.body,req.files);
    res.render('index',{data:"",check:"",values:"",sucess:"Account Created Sucessfully",login:"Goto Map",logout:""});
    }
    else
    res.render('index',{data:"",check:"User Already Exist",values:req.body,sucess:"",login:"Goto Map",logout:""});

    });
});  


//edit details route
route.post("/edit",parser,(req,res)=>{        //add passport authencitate
        var myquery='select * from info where username ="'+req.body.email+'";';
        console.log(myquery);
        con.query(myquery,(err,queryres)=>{
            if(err) throw err;
            else
            {console.log(queryres[0]);
            res.render("edit",{data:queryres[0]});
            }
        });
    }
);

route.post("/newdetails",upload.fields([{name:"pic"},{name:"pic1"},{name:"pic2"}]),(req,res)=>{        //add passport authencitate
    details_update(req,()=>{
        res.clearCookie('username')
        res.render('index',{data:"",check:"",values:"",sucess:"Login Again to Continue",login:"Goto Map",logout:""});
    });
});


//logout route

route.get('/logout',(req,res)=>{
    res.clearCookie('username');
    res.render('index',{data:"",check:"",values:"",sucess:"",login:"Goto Map",logout:""});
})
function check_id(user,callback)
{
    var myquery='select username,password from info where username ="'+user+'";';
    con.query(myquery,(err,res)=>{
        if(err) throw err;
        else
        {
            if(res[0]==undefined)
                return callback(1);
            else
            return callback(res[0].password);
        }
    })
}
//function to create new account in database
function create_account(data,files)
{var f=[];
   for(var i=0;i<3;i++)
    {
        if(files[i]==undefined)
        f[i]=null;
        else
        f[i]=files[i].filename;

    }
    var query='insert into info values ("'+data.newemail+'","'+data.pass+'","'
    +data.firstname+'","'+data.date+'","'+data.month+'","'+data.year+'","'+data.address+'","'+f[0]+'","'+f[1]+'","'+f[2]+'")';

    con.query(query,function(err,response,feilds){
        if(err)
        throw err;
        return;
    });

}

function details_update(req,callback)
{
    var p=[];
    if(req.files.pic==undefined)
    p[0]=req.body.oldprofile;
    else
    p[0]=req.files.pic[0].filename;
    
    if(req.files.pic1==undefined)
    p[1]=req.body.oldliscense;
    else
    p[1]=req.files.pic1[0].filename;
    
    if(req.files.pic2==undefined)
    p[2]=req.body.oldadhaar;
    else
    p[2]=req.files.pic2[0].filename;
    console.log(p[1]);
    var data=req.body;
    var query='delete from info where username="'+req.body.newemail+'";';
    console.log(req.body);
    sql_query(query,(res)=>{
        console.log("inside second query");
        query1='insert into info values("'+data.newemail+'","'+data.pass+'","'
        +data.firstname+'","'+data.date+'","'+data.month+'","'+data.year+'","'+data.address+'","'+p[0]+'","'+p[1]+'","'+p[2]+'");';
    sql_query(query1,(res)=>{
        return callback();
    });
    });

}

function sql_query(query,callback)
{
    
    con.query(query,function(err,response,feilds){
        if(err)
        throw err;});
    return callback(0);

}

module.exports=route