
const mongoose= require("mongoose"),
		Schema=mongoose.Schema;

		const reviewSchema = new Schema({
			body:String,
			rating:Number,
			author:{
				type:Schema.Types.ObjectId,
				ref:"User"
			},
			createdAt:{type:Date,defaule:Date.now}
		})	


		module.exports = mongoose.model("Review",reviewSchema);
