const mysql = require("mysql2");
require('dotenv').config();


var connection = mysql.createConnection({
    
    host: process.env.db_host,
    port : process.env.db_port,
    user:  process.env.db_user,
    database: process.env.db_name,
    password: process.env.db_password
   
});

connection.connect(err=>{
    if(err){console.log(err,'error data base');}
    else{ 
    console.log("database connnected ");
    }
});
module.exports = connection;