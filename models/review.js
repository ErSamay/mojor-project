const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviewSchema = new mongoose.Schema({
    comment : String , 
    rating : {
        type : Number , 
        min : 1 , 
        max : 3 
    } , 
    createdAt : {
        type : Date , 
        default : Date.now()
    },
    author:{
        type :Schema.Types.ObjectId,
        ref : "User" , 
        
    }
})
module.exports = mongoose.model("Review" , reviewSchema);
