const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../AirBnbClone/models/listing.js");
const path=require("path");
const { isValidObjectId } = mongoose;
const methodOverride= require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchmea}=require("./schema.js")

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
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req, res) => {
    res.send("Hello World");
});

//Indexx route
app.get("/listings", wrapAsync(async(req,res)=>{
    const allisting= await Listing.find({});
    res.render("listings/index.ejs",{allisting});
}));

//New Route
app.get("/listings/new",wrapAsync(async(req,res)=>{
    res.render("listings/new.ejs");
}));

const validListing= (req,res,next)=>{
    let {error}=listingSchmea.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
}

app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).send("Invalid ID format");
    }
    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).send("Listing not found");
    }
    res.render("listings/show.ejs",{listing});
});

//Edit Route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
app.put("/listings/:id", wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedlisting= await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings");
}));

//Create Route
app.post("/listings", wrapAsync(async(req,res,next)=>{
        const newlisting = new Listing(req.body.listing);
        await newlisting.save();
        res.redirect("/listings");
}));

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong!"}=err;
    res.render("listing/error.ejs",{message});
    // res.status(statusCode).send(message);
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