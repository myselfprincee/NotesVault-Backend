var jwt = require('jsonwebtoken');
let sign = "hi!thisisprinceverifyingtheuser@69$12346978";

const fetchUser = (req, res, next) => {
    //Get the User from the JWT token and add ID to Request Object
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: 'Please Authenticate using a valid token'})
    }
    try {
        const data = jwt.verify(token, sign);
        req.user = data.user; 
        next();
        
    } catch (error) {
        res.status(401).send({error: 'Please Authenticate using a valid token'})
    }
     
}



module.exports = fetchUser;