const express = require("express");
const router = express.Router(); //create router

//index
router.get("/" , (req, res) => { //GET : Retrieving data
    res.send("GET for posts");
})

//index
router.get("/:id" , (req, res) => {
    res.send("GET for posts id");
})

//POST
router.post("/" , (req, res) => { //POST : Submitting data to be processed
    res.send("POST for posts");
})

//DELETE 
router.delete("/:id" , (req, res) => {
    res.send("DELETE for posts id");
})

module.exports = router;