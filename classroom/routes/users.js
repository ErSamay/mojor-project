const express = require("express");
const { route } = require("../../router/listing");
const router = express.Router();

router.get("/" , (req , res) => {
    res.send("Hey Every One I am Samay")
})

router.get("/:id" , (req , res) => {
    res.send("Get For Show Users")
});

router.post("/" , (req , res) => {
    res.send("Post Show Users")
});

router.delete("/:id" , (req  , res) => {
    res.send("DELETED")
});

module.exports = router