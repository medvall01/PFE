require('dotenv').config();



function checkRoleADMIN(req, res, next) {
    if (res.locals.role == process.env.USER)
        {
            res.sendStatus(401)
            
        }
    else
        {next()}
}

module.exports = { checkRoleADMIN : checkRoleADMIN}