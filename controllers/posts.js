const Posts=require("../models/posts.js");
const cloudinary=require("cloudinary").v2;
const mbx = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbx({ accessToken: process.env.MAPBOX_TOKEN });
cloudinary.config({
	cloud_name:"dxkrfrwzc",
	api_key:"665587122729671",
	api_secret:process.env.CLOUDINARY_SECRET
});


module.exports={
	postsIndex:async (req,res,next)=>{
			posts=await Posts.find({})
			res.render("posts/index.ejs",{posts});
	},

	postsNew(req,res,next){
			res.render("posts/new.ejs")
		},

	postsCreate:async (req,res,next)=>{
		req.body.images=[];

		/*cloudinary new image upload*/
		for(const file of req.files){
			let image=await cloudinary.uploader.upload(file.path);
			req.body.images.push({url:image.secure_url,public_id:image.public_id});
		}


		/*geolocation sdk*/
		response=await geocodingClient.forwardGeocode({
		  query: req.body.location,
		  limit: 1
		}).send()

		req.body.coordinates=response.body.features[0].geometry.coordinates;

		let posts=await Posts.create(req.body);
		req.session.success="Post created successfully!! "
		res.redirect("/posts/"+posts.id);
	},

	async postsShow(req,res,next){
		post = await Posts.findById(req.params.id);
		res.render("posts/show.ejs",{post,title:post.title});
	},

	async postsEdit(req,res,next){
			post=await Posts.findById(req.params.id);

			res.render("posts/edit.ejs",{post});
	},

	async postsUpdate(req,res,next){
		const posts=await Posts.findById(req.params.id);
		
		/*cloudinary image update*/
		if(req.body.deleteCheckbox&&req.body.deleteCheckbox.length){
			for(public_id of req.body.deleteCheckbox){
				await cloudinary.uploader.destroy(public_id);
				posts.images=posts.images.filter(image=>image.public_id!==public_id);
			}
		}

		if(req.files){
			for(const file of req.files){
				let image=await cloudinary.uploader.upload(file.path);
				posts.images.push({url:image.secure_url,public_id:image.public_id});
			}
		}

		/*geolocation coordinates update*/
		if(req.body.location!==posts.location){
			response=await geocodingClient.forwardGeocode({
			  query: req.body.location,
			  limit: 1
			}).send()

			posts.coordinates=response.body.features[0].geometry.coordinates;
			posts.location=req.body.location;	
		}

		posts.title=req.body.title;	
		posts.price=req.body.price;	
		posts.description=req.body.description;	
		posts.save();
		res.redirect("/posts/"+posts.id);
	},

	async postsDelete(req,res,next){
		const posts=await Posts.findByIdAndDelete(req.params.id);
		for({public_id} of posts.images){
			await cloudinary.uploader.destroy(public_id);
		}
		res.redirect("/");
	}
}