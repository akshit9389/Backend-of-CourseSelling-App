require("dotenv").config();
const { JWT_ADMIN_PASS } = require("../config");
const jwt = require("jsonwebtoken");

function authenticateAdmin(req, res, next) {
    const token = req.headers.token;
    const decode = jwt.verify(token,process.env.JWT_ADMIN_PASS);
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
module.exports = ({
     authenticateAdmin
 })
