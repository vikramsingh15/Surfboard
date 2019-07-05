/*
Posts
title:String
price:String
description:String
images:array of string
location:String
lat:Number
lng:Number
author:String
reviews:array of object ref review*/

const mongoose= require("mongoose"),
		Schema=mongoose.Schema;


const postSchema = new Schema({
	title:String,
	price:String,
	description:String,
	images:[{url:String,public_id:String}],
	location:String,
	lat:Number,
	lng:Number,
	author:{
		type:Schema.Types.ObjectId,
		ref:"User"
	},
	reviews:[{
		type:Schema.Types.ObjectId,
		ref:"Review"
	}]
})

module.exports = mongoose.model("Post",postSchema);