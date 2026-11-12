const express = require('express')

const app = express()

app.use(express.json())//--> middleware for accepoting data from frontend

app.get("/",(req,res)=>{

    res.send('you reached ')
})
app.post("/create",(req,res)=>{
    console.log(req.body);
    res.send("ok post")
})

let port = 3000;
app.listen(3000,()=>{
    console.log(`server is runnung on port ${port}`);
    
})