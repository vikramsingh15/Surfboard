const Review=require("../models/review.js");
const Posts=require("../models/posts.js");


module.exports={
	/*create new review*/
	async reviewCreate(req,res,next){


		req.body.author=req.user._id;
		posts = await Posts.findById(req.params.id).populate("reviews").exec();
		const pastReview = posts.reviews.filter(review=>review.author.equals(req.user._id));
		if(pastReview.length){
			req.session.error = "cannt have more than one review";
			return res.redirect("back")
		} 

		review = await Review.create(req.body);

		posts.reviews.push(review.id);
		posts.save();
		req.session.success="Sucessfully added the review !!!"
		res.redirect(`/posts/${posts.id}`);
	},
	
	/*Update review*/
	async reviewUpdate(req,res,next){
		await Review.findByIdAndUpdate(req.params.review_id,req.body);
		req.session.success="Review updated !!!";
		res.redirect("back");
	},
	
	/*review delete*/
	async reviewDelete(req,res,next){
		
		await Posts.findByIdAndUpdate(req.params.id,{
			$pull:{reviews:req.params.review_id}
		})
		await Review.findByIdAndDelete(req.params.review_id);
		req.session.success="review deleted !!"
		res.redirect("back");
	}
}