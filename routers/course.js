const { Router } = require("express");

const courseRouter = Router();

courseRouter.post('/purchase', (req, res) => {
    res.json({
        msg: "course purchase successful"
    });
})

courseRouter.get('/preview', (req, res) => {
    res.json({
        msg: "courses retrieved"
    });
})

module.exports = {
    courseRouter : courseRouter
}