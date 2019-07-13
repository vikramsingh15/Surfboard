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
const mongoosePaginate=require("mongoose-paginate");
const mongoose= require("mongoose"),
		Schema=mongoose.Schema,
		Review=require("./review.js");


const postSchema = new Schema({
	title:String,
	price:String,
	description:String,
	images:[{url:String,public_id:String}],
	avgRating:{type:Number,default:0},
	location:String,
	geometry:{
		type:{
			type:String,
			enum:['Point'],
			required:true
		},
		coordinates:{
			type:[Number],
			required:true
		}
	},
	properties:{
		description:String
	},
	author:{
		type:Schema.Types.ObjectId,
		ref:"User"
	},
	reviews:[{
		type:Schema.Types.ObjectId,
		ref:"Review"
	}]
});


postSchema.pre('remove',async function(){
	await Review.remove({
		_id:{
			$in:this.reviews
		}
	})
})
postSchema.plugin(mongoosePaginate);

postSchema.methods.averageRating = function(){
	let floorRating=0;
	if(this.reviews.length){
		this.reviews.forEach(review=>{
				floorRating+=review.rating
		});
		this.avgRating=(Math.round(floorRating*10)/10)/this.reviews.length;
		floorRating/=this.reviews.length;
		this.save()
		return Math.floor(floorRating);
	}
	this.avgRating=0
	this.save()
	return 0;
}


module.exports = mongoose.model("Post",postSchema);