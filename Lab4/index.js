const express = require('express');
require('./db_connection');

const todoRouter = require('./routers/todo');
const postRouter = require('./routers/post');

const userRouter = require('./routers/user');
const RequestLog = require('./models/requestLog');



const app = express();



app.use((req, res, next) => {
    const  request_url  =req.originalUrl;
    const { method } = req;    
    RequestLog.create({  request_url, method }, (err, request) => {

        if (err) {


            return res.send('something went wrong');

        }
        next();
    })
})

app.use(express.static('public'));
app.use(express.json());

app.use('/api/todo', todoRouter);
app.use('/api/post', postRouter);
app.use('/api/user', userRouter);

app.use((req, res, next) => {
    res.statusCode= 500;
    res.send({ error: "internal server error" });
})

const port=process.env.PORT || 4000
app.listen(port, () => {
    console.info(`server listening on port ${port}`)
})
