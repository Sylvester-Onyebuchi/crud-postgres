const express = require('express')
const  {Pool} =  require( "pg");
const bcrypt = require('bcryptjs')
const route = require('./route/route')

const app = express();
const port = process.env.PORT || 3050

app.use(express.json())

app.use('/users', route)


app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
