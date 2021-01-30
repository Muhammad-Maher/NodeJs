const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        maxlength:20,
        minlength:5,
        unique:true
    },
    password:{
        type:String,
        required:true,
        
    },
    firstName:{
        type:String,
        minlength:3,
        maxlength:15,
        required:true
    },
    age:{
        type:Number,
        min:13

    }    


});


const User=mongoose.model('User',userSchema);
module.exports=User;