const Posts=require("../models/posts.js");
const cloudinary=require("cloudinary").v2;
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
		for(const file of req.files){
			let image=await cloudinary.uploader.upload(file.path);
			req.body.images.push({url:image.secure_url,public_id:image.public_id});
		}
		let posts=await Posts.create(req.body);
		res.redirect("/posts/"+posts.id);
	},

	async postsShow(req,res,next){
		post = await Posts.findById(req.params.id);
		res.render("posts/show.ejs",{post});
	},

	async postsEdit(req,res,next){
			post=await Posts.findById(req.params.id);
			res.render("posts/edit.ejs",{post});
	},

	async postsUpdate(req,res,next){
		const posts=await Posts.findById(req.params.id);
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

		posts.title=req.body.title;	
		posts.price=req.body.price;	
		posts.location=req.body.location;	
		posts.lat=req.body.lat;	
		posts.lng=req.body.lng;	
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