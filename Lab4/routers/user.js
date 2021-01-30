const express = require('express');
const User = require('../models/user')
const Todo = require('../models/todo')
const { body, validationResult } = require('express-validator');
const authinticationMiddleware = require('../middlewares/authentication');
const { Error } = require('mongoose');

//BASE PATH  /api/user
const userRouter = new express.Router();


userRouter.post('/register', body('password').isLength({ min: 5 }), async (req, res,next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });        
        const { username, password, firstName, age } = req.body;                
        const user = await User.create({ username, password, firstName, age });    
        res.statusCode = 201;
        res.send({ message: 'user was registered successfully' });
    }
    catch (err) {
        // console.error(err);
        // res.statusCode = 422;
        // res.send(err);
        next();
    }

});

userRouter.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username }).exec();
        if (!user) throw new Error("wrong username or password");
        const isMatched = (password=== user.password)? true:false;
        if (!isMatched) throw new Error("wrong username or password");
        const token = await jwt.sign({ id: user.id }, "secret-key")
        const Latesttodos = await Todo.find({}).populate('userId', 'username').
            exec((err, data) => {

                res.json({ token, data })
            });

    }
    catch (err) {
        // res.statusCode = 401;
        // res.json({ error: 'invalid credentials' });
        next();
    }
})



userRouter.get('/', authinticationMiddleware, (req, res, next) => {
    User.find({}, { _id: 0, firstName: 1 }, (err, users) => {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            return res.send({ message: "somthing went wrong" })
        }
        res.send(users);
    })
})


userRouter.delete('/:id', authinticationMiddleware, async (req, res, next) => {
    try {
        const  deleteduserId = req.params.id;
        const tokenId =req.tokenId.id;          
        if (deleteduserId === tokenId) {
            await User.deleteOne({ _id: deleteduserId });
            
        }
        res.send({message:'the profile deleted successfully'});
    } catch (err) {
        // res.send({ messgae: "somthing went wrong" });
        next();
    }

})

userRouter.patch('/:id', authinticationMiddleware, async (req, res, next) => {
    try {
        const  updatedUserId = req.params.id;
        const tokenId =req.tokenId.id;          
        if (updatedUserId === tokenId) {
            
            const update=await User.updateOne({ _id: tokenId }, { firstName: req.body.firstName });
            const updatedUser=await User.find({ _id: tokenId }).exec((err,data)=>{

                 
                 res.send(({message:'user was edited successfully', user: data}) );
            });            
        }
    } catch (err) {
        // res.send(err);
        // res.send({ messgae: "somthing went wrong" });
        next();
    }

})



module.exports = userRouter;