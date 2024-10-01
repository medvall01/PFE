

const connection = require("../connection")




function calculScore(req, res, next) {
    // longueur de la table candidature

    let qr = 'select cnadidacy.iduser,cnadidacy.codemaster,cnadidacy.MBAC,cnadidacy.ML1,cnadidacy.ML2,cnadidacy.ML3,cnadidacy.NBRED,cnadidacy.NBBRATT,cnadidacy.ADIP,users.fullname,master.titre from cnadidacy JOIN users ON cnadidacy.iduser = users.id JOIN master ON cnadidacy.codemaster = master.code';
    connection.query(qr, (err, result) => {
        if (!err) {
            console.log(result)
            for (i = 0; i < result.length; i++) {
                let candidature = result[i];
                let codemaster = candidature.codemaster;
                qr = `select CFL1,CFL2,CFL3,PRED,PRATT,RACH,PA from score where codemaster=${codemaster}`
                connection.query(qr, (err, result) => {
                    if(!err){
                        console.log(result)
                        let score = result[0];
                        let NA = new Date();
                        NA =  NA.getFullYear()
                        NA = NA - candidature.ADIP 
                        let noteScore = candidature.MBAC + candidature.ML1 * score.CFL1 + candidature.ML2 * score.CFL2 + candidature.ML3 * score.CFL3 - candidature.NBRED * score.PRED - candidature.NBBRATT * score.PRATT
                        if(NA!=0){
                            noteScore = noteScore - score.PA
                        }
                        
                            console.log(noteScore)                
                    let sttus = "attente"
                    let fullname = candidature.fullname
                    let TitreMaster = candidature.titre
                    if(noteScore>=score.RACH){
                        sttus = "admis"
                    }
                    qr = 'select * from admis where userFullname = ? AND TitreMaster = ?'
                    connection.query(qr,[fullname,TitreMaster],(err,result)=>{
                        console.log(result)
                        if(!err){
                            if(result.length<=0){
                                qr =  `insert into  admis(iduser,userFullname,TitreMaster,noteScore,action) values(?,?,?,?,?)`
                                connection.query(qr,[candidature.iduser,fullname,TitreMaster,noteScore,sttus],(err,result =>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log("touts les taches sont terminés")
                            
                        
                        }}))
                           

                            }
                            else{
                                console.log("cet admis existe")
                            }
                        }

                        else{
                            console.log(err);
                        }

                    })

                    
                    
                    
                    
                        }
                    
                           
                            
                        
                        
                                   
                            
                        


                    
            
                    else{
                        console.log(err);
                    }

                })
            }
            next()



            }

        else { console.log(err); }
    })

}
module.exports = { calculScore: calculScore }