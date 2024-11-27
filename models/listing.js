const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type:String,
        required : true
    },
    description: String,
    picture : {
        type: String,
        default : "https://unsplash.com/photos/multicolored-hallway-RnCPiXixooY",
        set :(v) => v===""? "https://unsplash.com/photos/multicolored-hallway-RnCPiXixooY":v
    },
    price : Number,
    location : String,
    country : String,
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;