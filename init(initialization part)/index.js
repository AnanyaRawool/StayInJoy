// logic for intialization

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//mongodb connection get initalize
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main () .then(() =>{
    console.log("connected with DB");
})
.catch((err) => {
    console.log(err);
});
async function main (){
    await mongoose.connect(MONGO_URL);
}

//initalize db
const initDB = async ()=> {

// if random data already exist in db then delete it 
  await Listing.deleteMany({});

//after deleting data insert new data 
initData.data = initData.data.map((obj) => ({
     ...obj, 
     owner:"698f2c1b927e707fcb5cb018",
    }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialized.");

};

initDB();