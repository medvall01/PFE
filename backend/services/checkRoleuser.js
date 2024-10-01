
require('dotenv').config();




function checkRoleUSER(req, res, next) {
    if (res.locals.role == process.env.USER)
        {
            next()
        }
    else
        {
            
            res.sendStatus(401)
        }
}
module.exports = { checkRoleUSER : checkRoleUSER}