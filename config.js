require("dotenv").config();
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASS;
const JWT_USER_PASSWORD = process.env.JWT_USER_PASS;

module.exports = {
    JWT_ADMIN_PASSWORD,
    JWT_USER_PASSWORD
}