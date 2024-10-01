const express = require('express');
const connection = require("../connection");
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer")
require('dotenv').config();
const authentification = require("../services/authentification");
const checkRole = require("../services/checkRole");
const checkRoleuser = require('../services/checkRoleuser');


/*router.post('/deposer',authentification.authentificationToken,checkRoleuser.checkRoleUSER, (req, res) => {
    let depot = req.body;
    const token = req.headers.authorization.split(' ')[1];
    let decodetoken = jwt.verify(token, `${process.env.ACEESS_TOKEN}`);
    let identifiant = decodetoken.id ;
    qr = 'select iduser from candidat where iduser =?';
    connection.query(qr, identifiant, (err, result) => {
        if (!err) {

            if (result.length<=0) {
                
                qr = 'insert into candidat(iduser,fullname, cin, naissance,addrpost, codepost, email, phone,noteScore,status) values(?,?,?,?,?,?,?,?,0,"null")'
                connection.query(qr, [ identifiant,depot.fullname, depot.cin, depot.naissance, depot.addrpost
                    , depot.codepost, depot.email, depot.phone,], (err, result) => {
                        if (!err) {
                            qr = 'select id from candidat where iduser=?'
                            connection.query(qr, [identifiant], (err, result) => {
                                if (!err) {
                                    let variable = result[0].id;
                                    qr = 'insert into candidature(idcandidat,codemaster,ABAC,MBAC, SBAC, AL1,ML1, SL1,AL2,ML2, SL2, AL3,ML3, SL3,NBRED,TDIP,ADIP,ETAB,SIT) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
                                    connection.query(qr, [variable,depot.codemaster, depot.ABAC, depot.MBAC, depot.SBAC, depot.AL1, depot.ML1, depot.SL1,
                                        depot.AL2, depot.ML2, depot.SL2, depot.AL3, depot.ML3, depot.SL3, depot.NBRED, depot.TDIP, depot.ADIP,
                                        depot.ETAB, depot.SIT], (err, result) => {
                                            if (!err) {
                                                return res.status(200).json({ message: "votre dépot à été effectué avec succée" })
                                            }


                                            else {

                                                return res.status(500).json(err);
                                            }


                                        })
                                }
                                else {

                                    return res.status(500).json(err);
                                }
                            
                            })
                        }
                    else {

                                return res.status(500).json(err);
                            }
                        })
                    }
                    else {
                        return res.status(200).json({ message: "vous avez déja deposé" })
                    }
                }
                        


                
            

            else {
                return res.status(500).json(err);
            }


        })
    })   */


    


    router.post('/deposer', (req, res) => {
        let depot = req.body;
        const token = req.headers.authorization.split(' ')[1];
        let decodetoken = jwt.verify(token, `${process.env.ACEESS_TOKEN}`);
        let identifiant = decodetoken.id ;
       
        
        qr = 'select codemaster from cnadidacy where iduser =?';
        connection.query(qr, identifiant, (err, result) => {
       //     console.log(identifiant);
       //     console.log(result[0].codemaster);
            let existe = "false"
            let codemaster = result
            if(!err){
                for(i=0; i<result.length;i++){
                     codemaster = result[i]
                    console.log(codemaster)
                    console.log(codemaster.codemaster)
                    if(codemaster.codemaster==depot.codemaster){
                        existe = "true";
                    }
                }
                    if(existe=="false") {
                        qr = 'insert into cnadidacy(codemaster,iduser,MBAC,ML1,ML2,ML3,NBRED,NBBRATT,ADIP) values(?,?,?,?,?,?,?,?,?)'
                        connection.query(qr,[depot.codemaster, identifiant, depot.MBAC, depot.ML1, depot.ML2, depot.ML3, depot.NBRED, depot.NBBRATT, depot.ADIP]
                            ,(err, result) =>{
                                if(!err){
                                  return  res.status(200).json({message : "vous avez déposeés avec succés"})
                                }
                                else {
                                    console.log(err);
                                   return res.status(500).json(err);
                                }
                            })
                    }
                    else{
                        return res.status(200).json({message : "vous avez déja déposé pour ce master"})
                    }
                
            
            }
            else{
                return res.status(500).json(err);
            }
    
    
                    
                
    
               
    
    
            })
        })



        




router.get('/get', (req, res) => {
    let qr = 'select * from candidature where id !=1000';
    qr = 'SELECT cnadidacy.id , cnadidacy.MBAC, cnadidacy.ML1, cnadidacy.ML2, cnadidacy.ML3, master.titre, users.fullname FROM cnadidacy JOIN master ON cnadidacy.codemaster = master.code JOIN users ON cnadidacy.iduser = users.id'
    connection.query(qr, (err, result) => {
        if (!err)
           { console.log(result)
            return res.status(200).json(result)}
           
        else
            return res.status(500).json(err)
    })

})

router.get('/get/:id', (req, res) => {
    let gID = req.params.id;
    let qr = `select * from candidature where id = ${gID}`
    connection.query(qr, (err, result) => {
        if (!err) {
            return res.status(200).json(result);
        }
        else {

            return res.status(500).json(err);
        }

    })

});



router.delete('/delete/:id',(req,res)=>{
    const id = req.params.id;
    var qr ='delete from cnadidacy where id=?'
    connection.query(qr,[id],(err,result)=>{
        if(!err){
            if(result.affectedRows>0){
                return res.status(200).json({message : ' candidat  supprimé'})
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












module.exports = router;
