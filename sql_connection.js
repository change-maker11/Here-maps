var mysql=require("mysql");

var con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'puneetj18', 
    database:'map'                           //change password here
});
con.connect((err)=>
{
    if(err)
    throw err;
    else console.log("sql connected");

});

module.exports=con;