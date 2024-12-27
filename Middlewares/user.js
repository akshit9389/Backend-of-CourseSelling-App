const { JWT_USER_PASS } = require("../config");
const jwt = require("jsonwebtoken");

function authenticateUser(req, res, next) {
    const token = req.headers.token;
    const decode = jwt.verify(token, JWT_USER_PASS);
    if (decode) {
        req.adminId = decode.id;
        next();
    }
    else{
        res.json({
            msg: "You are not Signed In"
        });
    }
}
module.exports = {
     authenticateUser
 }
