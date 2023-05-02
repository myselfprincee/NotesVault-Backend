const connectToMongo = require('./db');
const express = require('express')
connectToMongo();


const app = express()
const port = 3000

app.use(express.json())

app.use('/auth', require('./routes/auth.js'))
// app.use('/my-notes', require('./routes/my-notes.js'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
