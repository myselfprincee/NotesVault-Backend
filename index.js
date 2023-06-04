const connectToMongo = require('./db');
const express = require('express')
const cors = require('cors');
connectToMongo();


const app = express()
const port = process.env.port || 5000;
app.use(cors())
app.use(express.json())



app.use(express.json())

app.use('/auth', require('./routes/auth'))
app.use('/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`NotesVault Backend listening on port ${port}`)
})
