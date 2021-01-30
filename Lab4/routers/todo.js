const express = require('express')
const Todo = require('../models/todo');
const authinticationMiddleware = require('../middlewares/authentication');

//BASE PATH /api/todo
const todoRouter = new express.Router();



todoRouter.post('/', authinticationMiddleware, async (req, res, next) => {
    const tokenId = req.tokenId.id;
    const {title,body,tags}=req.body;
    Todo.create({ userId: tokenId, title, body, tags }, (err, todo) => {

        if (err) {

            // res.statusCode = 422;
            // res.send('something went wrong');
            return next();
        }
        res.statusCode = 201;
        res.send(todo);
    })


})

todoRouter.get('/:userId', authinticationMiddleware, async (req, res, next) => {

    try {
        const { userId } = req.params;
        const todos = Todo.find({ _id: userId }).populate('userId', 'username').
            exec((err, data) => {

                res.send(data);
            });
    } catch (err) {

        // res.json({ message: "somthing went wrong" });
        next();

    }

})


todoRouter.get('/', authinticationMiddleware, async (req, res, next) => {


    try {
        const limit = Number(req.query.limit) || 10;
        const skip = Number(req.query.skip) || 0;

        const todos = await Todo.find({}, null, { limit: limit, skip: skip }).
            populate('userId', {_id:0,username:1}).
            exec((err, data) => {

                res.json(data);
            });
    } catch (err) {

        // res.json({ message: "somthing went wrong" });
        next();

    }

})




todoRouter.patch('/:id', authinticationMiddleware, async (req, res, next) => {
    try {
        const tokenId = req.tokenId.id;
        const todoId = req.params.id;
        const update = await Todo.updateOne({ _id: todoId, userId: tokenId }, { body: req.body.body });
        res.send(({ message: 'todo body was edited successfully' }));


    } catch (err) {
        
        // res.send({ messgae: "somthing went wrong" })
        next();
    }

})



todoRouter.delete('/:id', authinticationMiddleware, async (req, res, next) => {
    try {
        const deletedTodoId = req.params.id;
        const tokenId = req.tokenId.id;

        await Todo.deleteOne({ _id: deletedTodoId, userId: tokenId });

        res.send({ message: 'the Todo was deleted successfully' });
    } catch (err) {
        // res.send({ messgae: "somthing went wrong" });
        next();
    }

})




module.exports = todoRouter;