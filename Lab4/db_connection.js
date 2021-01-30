const mongoose=require('mongoose');

mongoose.connect(process.env.MONGO_DB || 'mongodb://localhost:27017/newDb', {useNewUrlParser: true},(err)=>{
    if(err){
        console.warn(`connection fails`)
        console.log(err);
        process.exit(1);
    }
    console.info(`connection established successfully`);
});