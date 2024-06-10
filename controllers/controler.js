const {Pool} = require('pg')
const bcrypt = require('bcryptjs')
const env = require('dotenv')
env.config()

const pool = new Pool({
  user: process.env.DB_USER,
  host:process.env.DB_HOST,
  database:process.env.DB_NAME,
  password:process.env.DB_PASSWORD,
  port:process.env.DB_PORT
})

const creatUser = async(req, res) => {
  const {name, email, password} = req.body;
  try {
    const check = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    if(check.rows.length > 0){
      res.json({message:"User already exist"})
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const result = await pool.query('INSERT INTO users(name, email, password)VALUES($1, $2, $3) RETURNING *',[name, email, hashPassword])
    res.status(200).json(result.rows[0])
  } catch (error) {
    res.status(404).json({error: error.message})
  }
}

const getUsers = async(req,res) => {
  try {
    const result = await pool.query('SELECT * FROM users')
    res.status(200).json(result.rows)
  } catch (error) {
    res.status(404).json({message: error.message})
  }
}

const getUser = async(req,res) => {
  const id = parseInt(req.params.id)
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1',[id])
    if(result.rows.length === 0){
    res.status(400).json({message:`No user with id ${id} found`})
    }
    res.status(200).json(result.rows)
  } catch (error) {
    res.status(404).json({error: error.message})
  }
}

const updateUser = async(req,res) => {
  const id = parseInt(req.params.id)
  const {name, email} = req.body
  try {
    const check = await pool.query('SELECT * FROM users WHERE id = $1',[id])
    if(check.rows.length === 0){
      res.status(400).json({message:`No user with id ${id} found`})
    }
    const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email,id])
    res.status(200).json(result.rows)
  } catch (error) {
    res.status(404).json({message: error.message})
  }
}

const deleteUser = async(req, res) => {
  const id = parseInt(req.params.id)
  try {
    const check = await pool.query('SELECT * FROM users WHERE id = $1',[id])
    if(check.rows.length === 0){
      res.status(400).json({message:`No user with id ${id} found`})
    }
    await pool.query('DELETE FROM users WHERE id = $1', [id])
    res.status(201).json({message: `User with id ${id} has been successfully deleted`})
  } catch (error) {
    res.status(404).json({message: error.message})
  }
}

const loginUser = async(req,res) => {
  const {email, password} = req.body
  try {
    const check = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if(check.rows.length > 0){
      const user = check.rows[0]
      const storedPassword = user.password
      const isMatch = bcrypt.compare(storedPassword, password)
      if(isMatch){
        res.status(200).json(user)
      }else{
        res.json({message: "Incorrect password"})
      }
    }else{
      res.status(400).json({message:"user not found"})
    }
    
  } catch (error) {
    res.status(404).json({message: error.message})
  }
}

module.exports={
  creatUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  loginUser
}