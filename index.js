import dotenv from "dotenv/config"
import app from "./app.js";
import connectMongoDB from "./db/connection.js";



const port = process.env.PORT || 3000;

connectMongoDB().then(()=>{
  app.listen(port, () =>{
    console.log(`App listening on PORT ${port}`)
  })
}).catch( (err) =>{
  console.error("MongoDB Connection Error", err)
  process.exit(1)
});




