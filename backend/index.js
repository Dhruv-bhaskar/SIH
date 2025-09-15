const express = require('express')
const cors = require("cors");
const env = require('dotenv')

env.config()
const app = express()

app.use(cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
    credentials: true
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req,res)=>{
    res.send('app is running')
})

app.listen(3000, ()=>{
    console.log('app is running on port 3000');
    
})