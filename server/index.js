const express = require('express');
const cors = require('cors')

const app = express();

cors(app);

app.get("/",(req,res)=>{
    res.send("Hello");
})

app.listen(5000,()=>{
    console.log("Server running..")
})
