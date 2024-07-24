import express,{Express} from "express";
const app =express()
const port=3000
app.get('/',(req,res) =>{
    res.send('this is database')
})
app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})
  
