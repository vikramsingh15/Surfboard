const Review=require("../models/review");
const Post=require("../models/posts");
const User=require("../models/user");
const {cloudinary}=require('../cloudinary');

const mapboxToken=process.env.MAPBOX_TOKEN;
const mbx = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbx({ accessToken: mapboxToken });


const middleware={
	
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
	},


	isLoggedIn(req,res,next){ 
		if(req.isAuthenticated()) return next()
		req.session.error='You need to log in first !!';
		req.session.redirectTo=req.originalUrl;
		return res.redirect("/login")
	},

	async isPostAuthor(req,res,next){
			const posts=await Post.findById(req.params.id);
			if(posts.author.equals(req.user._id)) return next();

				req.session.error='bad request !!'
				return res.redirect("back");
			
	},

	async isValidPassword(req,res,next){ 
		const {user}=await User.authenticate()(req.user.username,req.body.currentPassword);
		if(user) return next();
		
		middleware.deleteImage(req);
		req.session.error="Incorrect current password !!";
		return res.redirect('/profile')	
	},


	async changePassword(req,res,next){
		const {newPassword,confirmPassword}=req.body;
		if(newPassword&&!confirmPassword){

			middleware.deleteImage(req);
			req.session.error='confirmPassword missing !!'
			return res.redirect('/profile')
		}else if(newPassword&&confirmPassword){

			if(newPassword===confirmPassword){
				await req.user.setPassword(newPassword);
				return next()	
			}else{

				middleware.deleteImage(req);
				req.session.error="password must match !!"
				return res.redirect('/profile');
			}
		}else{
				return next()
		}
	},


	async deleteImage(req){

		if(req.file) await cloudinary.v2.uploader.destroy(req.file.public_id);

	},


	async searchAndFilterPosts(req,res,next){
		
		const queryKeys=Object.keys(req.query);
		
		if(queryKeys.length){
			dbQueries=[];
			let {search,price,avgRating,location,distance}=req.query;
			
		if (search) {
						search = new RegExp(escapeRegExp(search), 'gi');
						dbQueries.push({ $or: [
								{ title: search },
								{ description: search },
								{ location: search }
							]
						});
					}

		if(location){
			response=await geocodingClient.forwardGeocode({
			  query: location,
			  limit: 1
			}).send()

			const {coordinates}=response.body.features[0].geometry;

			maxDistance=distance||25;
			maxDistance*=1000;   /*km->m*/
			
			dbQueries.push({
				geometry:{
					$near:{
						$geometry:{
							type:'Point',
							coordinates
						},
						$maxDistance:maxDistance
					}
				}
			})

		}
	
		if(price){
			if (price.min) dbQueries.push({ price: { $gte: price.min } });
			if (price.max) dbQueries.push({ price: { $lte: price.max } });
		}
		
		if(avgRating){
			dbQueries.push({avgRating:{$in:avgRating}})
		}
		res.locals.dbQueries=dbQueries.length?{$and:dbQueries}:{};

		}

		
		res.locals.query = req.query;
		
		if(queryKeys.includes('page')) queryKeys.splice(queryKeys.indexOf('page'), 1);
		
	
		const delimiter = queryKeys.length ? '&' : '?';
		res.locals.paginateUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g, '') + `${delimiter}page=`;

		next();
	}
}


function escapeRegExp(str){
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');	
}

module.exports=middleware;