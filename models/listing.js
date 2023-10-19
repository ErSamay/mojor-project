const mongoose = require("mongoose");
const Review = require("./review")
const Schema = mongoose.Schema;

// MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main().then(() => {
//    console.log("connnected succefulluy")
// }).catch((err) => {
//     console.log(err)
// })
// async function main(){
//     await mongoose.connect(MONGO_URL);
// }

const listingSchema = new mongoose.Schema({
    title : {
        type : String , 
        required : true
    } , 
    description : String , 
    image : {
        type :  String ,
        default : "https://t4.ftcdn.net/jpg/06/37/04/83/240_F_637048304_gG1q9XoPsy17wtqm1rCM8ke3EjENcq5N.jpg" , 
        set : (v) => v === "" ? "https://t4.ftcdn.net/jpg/06/37/04/83/240_F_637048304_gG1q9XoPsy17wtqm1rCM8ke3EjENcq5N.jpg" : v,
    } ,
    price : Number , 
    location : String , 
    country : String , 
    reviews : [
        {
            type : Schema.Types.ObjectId , 
            ref : "Review" , 

        }
    ]

})
listingSchema.post("findOneAndDelete" , async(listing) => {
if(listing){
    await Review.deleteMany({_id : {$in : listing.reviews}})
}
})
const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;