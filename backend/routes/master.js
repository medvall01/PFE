const express = require('express');
const connection = require("../connection");
const router = express.Router();
const jwt = require('jsonwebtoken');
const checkRole = require("../services/checkRole");
const { checkRoleADMIN } = require('../services/checkRole');
const calculScore = require('../services/calculScore');
const { json } = require('body-parser');



router.post('/add', (req, res) => {
    let newone = req.body;

    let qr = 'select * from master where titre=?';
    connection.query(qr, [newone.titre], (err, result) => {
        if (!err) {
            
            if (result.length <= 0){

             
                qr = 'insert into master(titre,delai,description,cap) values(?,?,?,?)';
                connection.query(qr, [newone.titre, newone.delai, newone.description, newone.cap], (err, result) => {
                          
                   if (!err) {
                        return res.status(200).json({ message: "master à été ajouté avec succés" });
                    
                    } else{
                        return res.status(500).json(err);
                    }
                   
                });  
            




            }
            else {
                return res.status(400).json({ message: "ce titre de master éxiste" });
            }
        }   
        else {
            return res.status(500).json(err);
        } 

    
    }); 


});   









router.post('/update',(req, res) => {
    let editedmaster = req.body
    
   
    

    let qr = `UPDATE master SET titre=?, delai =? , description = ?, cap = ? WHERE master.code =? `
    connection.query(qr,[editedmaster.titre, editedmaster.delai ,editedmaster.description , editedmaster.cap,editedmaster.code],(err, result) => {
        if (!err)
            return res.status(200).json({message : "vous avez mis à jour ce master"})
        else
        return res.status(500).json(err)
    })
    
   
    

   })
   router.delete('/delete/:code',(req,res,next)=>{
    const code = req.params.code;
    var qr ='delete from master where code=?'
    connection.query(qr,[code],(err,result)=>{
        if(!err){
            if(result.affectedRows>0){
                return res.status(200).json({message : ' master supprimé avec succés'})
            }
            else{
                return res.status(400).json({message : 'ce code ne correspond à aucun master'});
            }
        }
        else {
            return res.status(500).json(err)
        }
    })

   })

   router.get('/get',(req, res) => {
    let qr = 'select * from master ORDER BY code';
    connection.query(qr, (err, result) => {
        if (!err)
            return res.status(200).json(result)
        else
            return res.status(500).json(err)
    })

})
   







module.exports = router;