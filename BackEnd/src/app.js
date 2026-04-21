require('dotenv').config();

const express = require('express');
const cors = require('cors');
const postMessage = require('../routes/message.routes')

const app = express();


app.use(cors()); // Enables CORS for all origins
app.use(express.json());

const Port = process.env.PORT || 8080


app.get('/',(req,res)=>{
  res.send('Server is Running')
})



app.use('/api/postMessage', postMessage);

app.listen(Port,()=>{
    console.log(`Server is Sucessfully running in ${Port}`)
})