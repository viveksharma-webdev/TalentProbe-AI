require("dotenv").config();
const connectToDB = require("./src/config/database.js");
const app = require("./src/app.js")



app.listen(3000,()=>{
    connectToDB();
    console.log("server is running on port 3000")
});