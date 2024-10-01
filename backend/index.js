const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const mysql = require("mysql2");
//const connection = require("./connection")
const userRoute = require("./routes/user");
const dossierRoute = require("./routes/dossier");
const candidatRoute = require("./routes/candidat");
const masterRoute = require("./routes/master");
const scoreRoute = require("./routes/score")
const adminRoute = require("./routes/admin")
const app = express();





app.use(cors());
app.use(bodyparser.json());
app.use(express.urlencoded({extended : true}));
app.use('/user',userRoute);
app.use('/dossier',dossierRoute);
app.use('/candidat',candidatRoute);
app.use('/master',masterRoute)
app.use('/score',scoreRoute)
app.use('/admin',adminRoute)




module.exports = app;




//post data 






//