
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")

MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
   console.log("connnected succefulluy")
}).catch((err) => {
    console.log(err)
})
async function main(){
    await mongoose.connect(MONGO_URL);
}
const initDB = (async() => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("yo yo samay");
  

})
initDB();

