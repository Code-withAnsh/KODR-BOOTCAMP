const express = require('express')

const app = express()

let port = 3000;
app.use(express.json())
let users =[]
//create-

app.post("/create",(req,res)=>{
    let body = req.body;
users.push(body)
res.send(users)
})

app.delete("/delete/:id",(req,res)=>{

    let id = Number(req.params.id);
    let userData = users.filter((val)=>val.id!==id);
console.log(userData);
users = userData
res.send(userData)

})

app.put("/update/:id",(req,res)=>{
    
let id = Number(req.params.id);
let body = req.body

users = users.map((val)=>val.id===id?{...val,...body}:val)

    res.send(users)
})
//get- read


app.get("/",(req,res)=>{
    res.send(users)
})

app.listen(port,()=>{
    console.log
    (`server is running on port ${port}`)
})

//put - se pura obj replace ho skta haiu
//patch -- se single entity

