const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../MajorProject/models/listing.js");
const path=require("path");

const mongooseurl="mongodb://127.0.0.1:27017/majorproject";

main().then(() =>{
    console.log("Connected to MongoDB");
}).catch(err =>{
    console.log("Error connecting to MongoDB", err);
}); 

async function main(){
    await mongoose.connect(mongooseurl);
};

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.send("Hello World");
});

//Indexx route
app.get("/listings", async(req,res)=>{
    const allisting= await Listing.find({});
    res.render("listings/index.ejs",{allisting});
});

//New Route
app.get("/listings/new",async(req,res)=>{
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

//Create Route
app.post("/listings", async(req,res)=>{
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
});


// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My House",
//         description: "Random Locations",
//         price : 1200,
//         location : "Random city, Country",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log("Working");
//     res.send("Sucessful Testing");
// });

app.listen(3000, () =>{
    console.log("Server is running on port 3000");
});    