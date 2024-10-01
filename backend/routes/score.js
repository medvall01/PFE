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

    let qr = 'select * from score where codemaster=?';
    connection.query(qr, [newone.codemaster], (err, result) => {
        if (!err) {
            
            if (result.length > 0){
                return res.status(400).json({message : 'il éxiste une équetion de score pour ce master voulez vous le modifier ?'})
            }
                else
                {
                    qr = 'insert into score(codemaster,CFL1,CFL2,CFL3,PRED,PRATT,RACH,PA) values(?,?,?,?,?,?,?,?)'
                connection.query(qr, [newone.codemaster, newone.CFL1, newone.CFL2,newone.CFL3,newone.PRED,newone.PRATT,newone.RACH,newone.PA], (err, result) => {
                          
                   if (!err) {
                        return res.status(200).json({ message: "score ajouté avec succés" });
                    
                    } else{
                        return res.status(500).json(err);
                    }
                   
                });  }
            




        }
        else
       { 
        return res.status(400).json({message : 'un score doit etre atrribué à un master éxistant'})
    }
            
        
       

    
    }); 


});   


router.post('/update',(req, res) => {
    let editedscore = req.body

     let qr = `UPDATE score SET CFL1=?, CFL2 =? , CFL3 = ?, PRED = ?, PRATT=?, RACH=? ,PA=? WHERE score.codemaster =? `
    connection.query(qr,[editedscore.CFL1, editedscore.CFL2 ,editedscore.CFL3 , editedscore.PRED,editedscore.PRATT,
        editedscore.RACH,editedscore.PA,editedscore.codemaster],(err, result) => {
        if (!err){
        if(result.affectedRows>0){
            return res.status(200).json({message : "vous avez mis ajour ce score de master"})
        }
        else{
            return res.status(400).json({message : "score inexistant, actualiser la page"})
        }
       }
        else
        {
            return res.status(500).json(err)
        }
    })
})

router.delete('/delete/:id',(req,res,next)=>{
    const gID = req.params.id;
    var qr ='delete from score where id=?'
    connection.query(qr,[gID],(err,result)=>{
        if(!err){
            if(result.affectedRows>0){
                return res.status(200).json({message : ' score supprimé avec succés'})
            }
            else{
                return res.status(400).json({message : 'cet id ne correspond à aucun score'});
            }
        }
        else {
            return res.status(500).json(err)
        }
    })

   })


   router.get('/get',(req, res) => {
    let qr = 'select * from score where id !=0';
    connection.query(qr, (err, result) => {
        if (!err)
            return res.status(200).json(result)
        else
            return res.status(500).json(err)
    })

})

module.exports = router