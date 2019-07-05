const mongoose =require("mongoose"),
		Schema=mongoose.Schema;


		const reviewSchema = new Schema({
			body:String,
			author:{
				type:Schema.Types.Object.ObjectId,
				ref:"User"
			}
		})	;


		modele.exports = mongoose.model("Review",reviewSchema);
