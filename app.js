import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"; 
import cookieParser from "cookie-parser";
import cors from "cors"; 
import userRoutes from "./routes/user.routes.js";
import reviewRoutes from "./routes/review.routes.js"

// Inicializar el paquete de dotenv
dotenv.config(); 

// Inicializar express
const app = express();

// Middlewares
app.use(express.json()); 

app.use(function(req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.header("Access-Controll-Allow-Origin", "*")
  next()
})

app.use(cookieParser()); 

app.use(cors({
  credentials: true, 
  origin: true
}))

// Rutas
app.use("/user", userRoutes)
app.use("/review", reviewRoutes)

// Rutas no declaradas
app.use((req, res) => {
  res.status(404).json({ error: "Not found" })
})  

// Connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(result => {
    console.log("Connected to the database!"); 

    // Escuchar en un puerto
    const PORT = process.env.PORT || 3000; 
    app.listen(PORT, () => {
      console.log(`Listening on: http://localhost:${PORT}`); 
    })
  })
  .catch(err => console.log(err)); 

