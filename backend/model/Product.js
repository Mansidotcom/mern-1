const mogoose = require("mongoose");
const { create } = require("./User");

const productSchema = mogoose.Schema({
    name : {
        type : String,
        required : true},
     description : {
        type : String,
        required : true},
    price : {
        type : Number,
        required : true},
    imageUrl : {
        type : String,
        required : true},
    stock : {
        type : Number,
        required : true},
    createdAt : {   
        type: Date, default: 0 },
    rating : {
        type : Number,
        default : 0},
    numReviews : {
        type : Number,
        default : 0},
    
})

const Product = mogoose.model("Product", productSchema);

module.exports = Product;