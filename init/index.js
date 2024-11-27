const mongoose = require('mongoose');
const initdata = require("../init/data.js");
const Listing= require("../models/listing.js");

const mongooseurl="mongodb://127.0.0.1:27017/majorproject";

main().then(() =>{
    console.log("Connected to MongoDB");
}).catch(err =>{
    console.log("Error connecting to MongoDB", err);
});

async function main(){
    await mongoose.connect(mongooseurl);
};

const initDB= async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("Data was Intialized");
}

initDB();
