const express = require('express');
const connection = require("../connection");
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer")
require('dotenv').config();
const authentification = require("../services/authentification");
const checkRole = require("../services/checkRole");
const { checkRoleADMIN } = require('../services/checkRole');
const calculScore = require('../services/calculScore');
const { json } = require('body-parser');
const bcrypt = require("bcrypt"); 



/*  router.post('/signup', (req, res, next) => {
    let newone = req.body;
    let qr = 'select fullname,email,password,status,role from users where email=?';
    connection.query(
        qr, [newone.email],
      (err, result) => {
        if (result.length) {
          return res.status(409).send({
            msg: 'This user is already in use!'
          });
        } 

          
             else {
                 qr = 'insert into users(fullname,email,password,status,role) values(?,?,?,"false","user")';
      
              connection.query(
                 qr,[newone.fullname, newone.email, newone.password],(err, result) => {
                    
                  if (err) {
               //     throw err
                    return res.status(400).send({
                      msg: err
                    });
                  }
                  else{
                  return res.status(201).send({
                    msg: 'The user has been registerd with us!'
                  });
                }
                });
            
            }
          });
        }); */
      




    router.post('/signup', async (req, res) => {
    let newone = req.body;
    var salt = await  bcrypt.genSalt();
    newone.password = await  bcrypt.hash(newone.password,salt);
    console.log(salt)
    console.log(newone.password)
    let qr = 'select fullname,email,password,status,role from users where CINcandidat =?';
    connection.query(qr, [newone.CIN], (err, result) => {
        if (!err) {
            
            if (result.length <= 0){
                qr = 'insert into users(CINcandidat,fullname,email,password,status,role) values(?,?,?,?,"true","user")';
                connection.query(qr, [newone.CIN,newone.fullname, newone.email, newone.password], (err, result) => {
                          
                   if (!err) {
                        return res.status(200).json({ message: "succesfully registred" });
                    
                    } else{
                        return res.status(500).json(err);
                    }
                   
                });  
            




            }
            else {
                return res.status(400).json({ message: "CIN existe pour un autre utilisateur" });
            }
        }   
        else {
            return res.status(500).json(err);
        } 

    
    }); 


});   




router.post('/login', async (req, res) => {
    let newone = req.body;
    
    //result[0].password != newone.password

    let qr = 'select id,email,fullname,password,status,role from users where email=?';
    connection.query(qr, [newone.email], async (err, result) => {
        if (!err) {
            if (result.length <= 0) {
                return res.status(401).json({
                    message: "incorrect email or "
                });
            }
            else if (result[0].status === 'false') {
                res.status(401).json({ message: "wait for admin approval" });
            }
     //       else if (result[0].password == newone.password) {
                
              else if(await bcrypt.compare(newone.password,result[0].password)||result[0].password == newone.password){
                
                const response = { id: result[0].id,fullname: result[0].fullname, email: result[0].email,password: result[0].password, role: result[0].role };
                const accesstoken = jwt.sign(response, process.env.ACEESS_TOKEN, { expiresIn: '8h' });
                res.status(200).json({ token: accesstoken });
            }
            else {
                return res.status(401).json({
                    message: "password incorrect"
                });
            }

        }
        else {
            return res.status(401).json(err);
        }




    });


});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})


router.post('/forgotPassword', (req, res) => {
    let newone = req.body;

    let qr = 'select email,password from users where email=?';
    connection.query(qr, [newone.email], (err, result) => {
        if (!err) {
            if (result.length <= 0) {
                return res.status(200).json({ message: "cet email ne correspon à aucun compte" });
            }

            else {
                var mailltiOPtions = {
                    from: process.env.EMAIL,
                    to: result[0].email,
                    subject: "voici tonmot de passe pur la connexion à app-candidate",
                    html: "<p><b>your login details</b><br><b>your mail :" + result[0].email + "</b><br><byour password :</b>" + result[0].password + "<br><a  href='http://localhost:4200/'>click here to login</a></p>"
                }

                transporter.sendMail(mailltiOPtions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("email sent " + info.response);
                    }
                });
                return res.status(200).json({ message: "mot de passe sent to your mail" });


            }
        }
        else {
            return res.status(401).json(err);
        }




    });


});




router.get('/get',authentification.authentificationToken,checkRoleADMIN, (req, res) => {
    let qr = 'select id,fullname,email,password,status,role from users where role="user"';
    connection.query(qr, (err, result) => {
        if (!err)
            return res.status(401).json(result)
        else
            return res.status(500).json(err)
    })

})
router.post('/changepassword',(req,res)=>{
    let newpassword = req.body;
    let qr = 'select id from user password '
})

module.exports = router;



router.get('get/:id',(req,res)=>{
    let gID = req.params.id ;
    let qr = `select fullname,email,password from users where id = ${gID}`
    connection.query(qr,(err,result)=>{
        if(err){
            return res.status(500).json(err)
        }
        else{
            return res.status(200).json(result)
            
        }
    });

});  

router.post('/update/:id',async (req,res)=>{
    gid = req.params.id
    console.log(gid)
    newone = req.body
    var salt = await  bcrypt.genSalt();
    newone.password = await  bcrypt.hash(newone.password,salt);
    let qr = `UPDATE users SET email = ? , password = ? WHERE users.id = ?`;
    console.log(req.body)
    connection.query(qr,[req.body.email,req.body.password,gid],(err,result)=>{
        if(!err){
            return res.status(200).json({message : "informations modifiés avec succés"})
        }
        else{

            console.log(err)
            return res.status(500).json(err)
            
        }
    })
    
})