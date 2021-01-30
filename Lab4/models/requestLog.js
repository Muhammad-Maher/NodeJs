
const mongoose=require('mongoose');

const logSchema=new mongoose.Schema({
    request_url:
        {
            type:String
        }
    ,
    method:{
        type:String,
              
    }

},{  timestamps: { createdAt: true, updatedAt: false } })

const RequestLog=mongoose.model("RequestLog",logSchema);
module.exports=RequestLog;