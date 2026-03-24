require("dotenv").config();
const connectToDB = require("./src/config/database.js");
const app = require("./src/app.js")



app.listen(process.env.PORT || 3000 ,()=>{
    connectToDB();
});
