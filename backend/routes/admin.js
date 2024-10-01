const express = require('express');
const connection = require("../connection");
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer")
require('dotenv').config();
const authentification = require("../services/authentification");
const checkRole = require("../services/checkRole");
const calculScore = require('../services/calculScore');


router.delete('/delete/:id',(req,res)=>{
    const code = req.params.id;
    var qr ='delete from users where id=?'
    connection.query(qr,[code],(err,result)=>{
        if(!err){
            if(result.affectedRows>0){
                return res.status(200).json({message : ' utilisateur supprimé'})
            }
            else{
                return res.status(400).json({message : 'id ne correspond à  aucun utilisateur'});
            }
        }
        else {
            return res.status(500).json(err)
        }
    })


})


router.get('/get',(req,res)=>{
    let qr = 'select id,fullname,email,password,role from users where role="enseignant"';
    connection.query(qr, (err, result) => {
        if (!err)
            return res.status(200).json(result)
        else
            return res.status(500).json(err)
    })
})


router.post('/update',(req, res) => {
    let editedenseignant = req.body
    
   
    

    let qr = `UPDATE users SET fullname=?, email =? , password = ?, role = ? WHERE users.id =? `
    connection.query(qr,[editedenseignant.fullname, editedenseignant.email ,editedenseignant.password , editedenseignant.role,editedenseignant.id],(err, result) => {
        if (!err)
            return res.status(200).json({message : "modification affecté"})
        else
        return res.status(500).json(err)
    })
    
   
    

   })


   
   router.post('/add', (req, res) => {
    let newone = req.body;

    let qr = 'select fullname,email,password,status,role from users where email =?';
    connection.query(qr, [newone.email], (err, result) => {
        if (!err) {
            console.log(result)
            if (result.length <= 0){
                
             
                qr = 'insert into users(CINcandidat,fullname,email,password,status,role) values("false",?,?,?,"true","enseignant")';
                connection.query(qr, [newone.fullname, newone.email, newone.password], (err, result) => {
                          
                   if (!err) {
                    return res.status(500).json({message:"enseignant ajouté avec succés"})
                   }
                    
                 
                        
                    
                     else{
                        return res.status(500).json(err);
            }})
                }
                   
                  
            




            
            else {
                return res.status(400).json({ message: "Enseignant existe" });
            }
        }   
        else {
            return res.status(500).json(err);
        } 

    
    }); 


});   


module.exports = router;