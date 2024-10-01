const express = require('express');
const connection = require("../connection");
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer")
require('dotenv').config();
const authentification = require("../services/authentification");
const checkRole = require("../services/checkRole");
const calculScore = require('../services/calculScore');
let ejs = require("ejs");
let path = require("path");
let pdf = require("html-pdf");
var fs = require("fs");
const { json } = require('body-parser');




router.get('/get',(req, res) => {
    let qr = 'select id,fullname,cin,naissance,addrpost,codepost,email,phone,noteScore from candidat where id !=1000';
    connection.query(qr, (err, result) => {
        if (!err)
            return res.status(200).json(result)
        else
            return res.status(500).json(err)
    })

})
router.get('/get/:id', (req, res) => {
    let gID = req.params.id;
    let qr = `select id,fullname,cin,naissance,addrpost,codepost,email,phone,noteScore from candidat where id = ${gID}`
    connection.query(qr, (err, result) => {
        if (!err) {
            return res.status(200).json(result);
        }
        else {

            return res.status(500).json(err);
        }

    })

});




router.get('/getadmis',calculScore.calculScore,(req, res) => {

    
     let qr = 'select admis.userFullname,admis.TitreMaster,admis.noteScore,admis.action,users.CINcandidat  from admis JOIN users ON admis.iduser = users.id order by admis.noteScore';
    connection.query(qr, (err, result) => {
        if (!err)
            {return res.status(200).json(result)}
        else
            {return res.status(500).json(err)}
    })

}) 


/*router.post('/pdf', (req, res) =>{
    let qr = 'select userFullname,TitreMaster,noteScore,action from admis';
    connection.query(qr,(err, result)=>{
        
        if(!err) {
           // result = JSON.parse(result);
           console.log(result)
            ejs.renderFile(path.join(__dirname,'',"report.ejs"),{result},(err,res)=> {
                if(err){
                    return res.status(500).json(err);
                }
                else{
                    
                    pdf.create(result).toFile('../services/admis.pdf',function(err,res){
                        if(err){
                            console.log(err)
                            return res.status(500).json(err)
                        }
                        else{
                            
                            return res.status(200).json({messge :"y"})
                        }
                    })
                }
            })
        }
        else{
            return res.status(500).json(err)
        }
    })
}) */










module.exports = router;