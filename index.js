const express = require('express');
const mongoose = require("mongoose");


const { userRouter } = require("./routers/user");
const { courseRouter } = require("./routers/course");
const { adminRouter } = require("./routers/admin");
const app = express();
app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/course', courseRouter);

async function main() {
    await mongoose.connect(process.env.MONGO_URL).then(() => console.log("Databse connected"))
    app.listen(4000);
}

main();

