const Posts=require("../models/posts.js");
const mapboxToken=process.env.MAPBOX_TOKEN;
const Review=require('../models/review.js');
const {cloudinary}=require("../cloudinary")
const mbx = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbx({ accessToken: mapboxToken });



module.exports={
/*	index of posts*/
	postsIndex:async (req,res,next)=>{
			const { dbQueries }=res.locals;
			delete res.locals.dbQueries;
			
			let posts =await Posts.paginate(dbQueries,{
				page:req.query.page||1,
				limit:10,
				sort:"-_id"
			})
			posts.page = Number(posts.page);

			if(!posts.docs.length&&res.locals.query) res.locals.error="No result found !!"

			res.render("posts/index.ejs",{
				posts,
				mapboxToken,
				title:"Posts index"
			});
	},
	
	/*new post*/
	postsNew(req,res,next){
			res.render("posts/new.ejs")
		},

	/*create new posts*/	
	postsCreate:async (req,res,next)=>{
		req.body.images=[];
		req.body.author=req.user._id;
		/*cloudinary new image upload*/
		for(const file of req.files){
			req.body.images.push({url:file.secure_url,public_id:file.public_id});
		}


		/*geolocation sdk*/
		response=await geocodingClient.forwardGeocode({
		  query: req.body.location,
		  limit: 1
		}).send()

		req.body.geometry=response.body.features[0].geometry;


		let posts=await Posts.create(req.body);
		posts.properties.description=`<strong><a href="/posts/${posts._id}">${posts.title}</a></strong><p>${posts.location}</p><p>${posts.description.substring(0, 20)}...</p>`;
		await posts.save()
		req.session.success="Post created successfully!! "
		res.redirect("/posts/"+posts.id);
	},

	/*show particular post*/
	async postsShow(req,res,next){
		post = await Posts.findById(req.params.id).populate({
			path:"reviews",
			options:{sort:{"_id":-1}},
			populate:{
				path:"author",
				model:"User"
			}

		});

		floorRating=post.averageRating();
	
		
		res.render("posts/show.ejs",{
			post,
			title:post.title,
			floorRating,
			mapboxToken:mapboxToken
		});
	},
	
	/*edit posts*/
	async postsEdit(req,res,next){
			post=await Posts.findById(req.params.id);

			res.render("posts/edit.ejs",{post});
	},
	
	/*update posts*/
	async postsUpdate(req,res,next){
		const posts=await Posts.findById(req.params.id);
		
		/*cloudinary image update*/
		if(req.body.deleteCheckbox&&req.body.deleteCheckbox.length){
			for(public_id of req.body.deleteCheckbox){
				await cloudinary.v2.uploader.destroy(public_id);
				posts.images=posts.images.filter(image=>image.public_id!==public_id);
			}
		}

		if(req.files){
			for(const file of req.files){
			
				posts.images.push({url:file.secure_url,public_id:file.public_id});
			}
		}

		/*geolocation geometry update*/
		if(req.body.location!==posts.location){
			response=await geocodingClient.forwardGeocode({
			  query: req.body.location,
			  limit: 1
			}).send()

			posts.geometry=response.body.features[0].geometry;
			posts.location=req.body.location;	
		}

		posts.title=req.body.title;	
		posts.price=req.body.price;	
		posts.description=req.body.description;	
		posts.properties.description=`<strong><a href="/posts/${posts._id}">${posts.title}</a></strong><p>${posts.location}</p><p>${posts.description.substring(0, 20)}...</p>`;
		await posts.save();
		res.redirect("/posts/"+posts.id);
	},

	/*delete posts*/

	async postsDelete(req,res,next){
		const posts=await Posts.findById(req.params.id);

		for({public_id} of posts.images){
			await cloudinary.v2.uploader.destroy(public_id);
		}
		posts.remove();
		res.redirect("/");
	}
}


