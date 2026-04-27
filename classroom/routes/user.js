const express = require("express");
const router = express.Router();

//index-user
router.get("/" , (req, res) => { //GET : Retrieving data , only single '/' represent the common part that is '/users' used in the server.js
    res.send("GET for users");
})

//index-user
router.get("/:id" , (req, res) => {
    res.send("GET for users id");
})

//POST-user
router.post("/" , (req, res) => { //POST : Submitting data to be processed
    res.send("POST for users");
})

//DELETE -user
router.delete("/:id" , (req, res) => {
    res.send("DELETE for users id");
})

module.exports = router;
