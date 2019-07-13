const Review=require("../models/review");
module.exports={
	
	asyncErrorHandler:function(fn){

				return (function(req,res,next){
					Promise.resolve(fn(req,res,next)).catch(next);
				});		

	},


	async isReviewAuthor(req,res,next){
		review=await Review.findById(req.params.review_id);	
		if(review.author.equals(req.user._id)){
			return next()
		}
		req.session.error="bad request!!"
		return res.redirect("back");
	}
}
