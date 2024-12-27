const { Router } = require("express");
const { z } = require("zod");
const {userModel} = require("../db")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASS } = require("../config");

const userRouter = Router();

userRouter.post('/signup', async (req, res) => {
    let requireBody = z.object({
            email: z.string().min(6).email(),
            password: z.string().min(6),
            firstName: z.string().max(30),
            lastName: z.string().max(40)
        })
    
        let parseBody = requireBody.safeParse(req.body);
        if (parseBody.error) {
            res.status(403).json({
                msg : parseBody.error.message
            })
        }
        const {email, password, firstName, lastName} = req.body;
        try {
            let hashPass = await bcrypt.hash(password, 5);
            await userModel.create({
                email: email,
                password: hashPass,
                firstName: firstName,
                lastName: lastName
            });
        } catch (e) {
            res.json({
                msg: "Signup Failed"
            });
            return;
        }
    
        res.json({
            msg :"user signup successful"
        })
});

userRouter.post('/signin', async (req, res) => {
    let requireBody = z.object({
        email: z.string().min(6).email(),
        password: z.string().min(6)
    });

    let parseBody = requireBody.safeParse(req.body);

    if (parseBody.error) {
        res.status(403).json({
            msg : parseBody.error.message
        })
        return;
    }
    const { email, password } = req.body;
        let user = await userModel.findOne({
            email
        });
        if (!user) {
            res.status(403).json({
                msg: "user not Found"
            });
            return;
        }
        const passMatch = await bcrypt.compare(password, user.password);
        if (!passMatch) {
            res.status(403).json({
                msg: "Invalid Password"
            });
            return;
        }
        let token = jwt.sign({
            id: user._id
        }, JWT_USER_PASS);
        res.json({
            msg: "Signin Successful",
            token
        });

    

})

userRouter.get('/purchases', (req, res) => {
    res.json({
        msg: "user purchases retrieved"
    });
})

module.exports = {
    userRouter: userRouter
}