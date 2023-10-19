const express = require("express");
const { route } = require("../../router/listing");
const router = express.Router();



router.get("/" , (req , res) => {
    res.send("Hey Every One I am Samay this is post route")
});

router.get("/:id" , (req , res) => {
    res.send("Get For Show Post id")
});

router.post("/" , (req , res) => {
    res.send("Post Show posts")
});

router.delete("/:id" , (req  , res) => {
    res.send("DELETED for posts id")
})


module.exports = router;
