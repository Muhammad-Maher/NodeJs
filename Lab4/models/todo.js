const mongoose=require( 'mongoose');
const User = require('./user')
const Schema = mongoose.Schema;
const schema=new Schema({
    userId:
        { type: Schema.Types.ObjectId, ref: 'User'}
    ,
    title:{
        type:String,
        required:true,
        minlength:10,
        maxlength:20,        
    },
    body:{
         type:String,
         maxlenngth:10000,
         required:true
    },
    tags:[{
        type:String,
        maxlength:10

    }]

},{ timestamps: true });


const Todo=mongoose.model('Todo',schema);
module.exports=Todo;