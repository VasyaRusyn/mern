const express = require('express')

const mongoose = require('mongoose')


const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json({extended:true}))
app.use('/api/auth',require('./routes/auch.routes'))

async function start(){
    try{
        await mongoose.connect('mongodb+srv://qwe:qwe123@cluster0.44xpx.mongodb.net/List?retryWrites=true&w=majority')
        app.listen(PORT,()=>{
            console.log(`server started an port:${PORT}`);
        })
    }catch (e){
        console.error(e);
    }
}
start()