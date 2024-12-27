require("dotenv").config();
const { Router } = require('express');
const { adminModel,courseModel } = require("../db")
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const { JWT_ADMIN_PASS } = require("../config");
const { authenticateAdmin } = require("../Middlewares/admin");
const adminRouter = Router();


adminRouter.post('/signup', async (req, res) => {
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
            await adminModel.create({
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
            msg :"admin signup successful"
        })
});

adminRouter.post('/signin', async (req, res) => {
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
        let admin = await adminModel.findOne({
            email
        });
        if (!admin) {
            res.status(403).json({
                msg: "admin not Found"
            });
            return;
        }
        const passMatch = await bcrypt.compare(password, admin.password);
        if (!passMatch) {
            res.status(403).json({
                msg: "Invalid Password"
            });
            return;
        }
        let token = jwt.sign({
            id: admin._id
        },process.env.JWT_ADMIN_PASS);
        res.json({
            msg: "Admin Signin Successful",
            token
        });
})

adminRouter.post('/course',authenticateAdmin,async (req, res) => {
    const adminId = req.adminId;
    let requireBody = z.object({
        title: z.string(),
        description: z.string(),
        price: z.number(),
        imageUrl: z.string()
    })
    
    let parseBody = requireBody.safeParse(req.body);

    if (parseBody.error) {
        res.status(403).json({
            msg : parseBody.error.message
        })
        return;
    }

    const { title, description, price, imageUrl, } = req.body;
    try {
        const course = await courseModel.create({
            title,
            description,
            price,
            imageUrl,
            creatorId: adminId
        });
        res.json({
            msg: "Course Created Successfully",
            courseId: course._id
        })
    } catch (e) {
        res.status(404).json({
            msg: "Failed to create course"
        });
    }





})

adminRouter.post('/course/update', authenticateAdmin,async (req, res) => {
    const adminId = req.adminId;
    let requireBody = z.object({
        title: z.string().min(5).max(30),
        description: z.string().min(20).max(1000),
        price: z.number(),
        imageUrl: z.string()
    })
    
    let parseBody = requireBody.safeParse(req.body);

    if (parseBody.error) {
        res.status(403).json({
            msg: parseBody.error.message
        })
        return;
    }

    const { title, description, price, imageUrl, courseId } = req.body;
    try {
        const course = await courseModel.updateOne({
            _id: courseId,
            creatorId: adminId
        }, {
            title,
            description,
            price,
            imageUrl
        });
        res.status(200).json({
            msg: "Course Updated Successfully"
        })
    } catch (e) {
        res.status(404).json({
            msg: "Failed to update course"
        });
    }
});

adminRouter.get('/course/bulk',authenticateAdmin, async (req, res) => {
    const adminId = req.adminId;
    const courses = await courseModel.find({
        creatorId: adminId
    })
    res.status(200).json({
        msg: "Courses Retrieved Successfully",
        courses
    })
})

module.exports = {
    adminRouter: adminRouter
}