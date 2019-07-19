const User=require("../models/user.js");
const passport=require("passport");
const Post =require("../models/posts.js");
const mapboxToken=process.env.MAPBOX_TOKEN;
const util=require('util');
const {deleteImage}=require('../middleware');
const {cloudinary} =require('../cloudinary');
const crypto=require('crypto');
const { postForgotPwMail ,putResetMail}=require('../sendGridMail');


module.exports={

	async landingPage(req,res,next){
		posts=await Post.find();
		res.render("index.ejs",{posts,mapboxToken,title:"surfBoard - home"});
	},

	getRegister(req,res,next){
		res.render("user/register.ejs",{username:'',email:''})
	},

	async postRegister(req,res,next){

		try{
			if(req.file){ 
				const {secure_url,public_id}=req.file;
				req.body.avatar={secure_url,public_id};
			}


			const user=await User.register(new User(req.body),req.body.password);

			
			req.login(user,err=>{
				if(err) return next(err);

				req.session.success=`Hey ${user.username} you have successfully signed up !!`
				return res.redirect('/'); 	
			});
		}catch(err){
			const {username,email}=req.body;
			await deleteImage(req);
			
			let error=err.message;
			req.session.error=error;
			return res.render('user/register.ejs',{title:'Register',username,email})

		}
			
	
	},

	getLogout(req,res,next){
		req.logout();
		res.redirect("/");
	},

	getLogin(req,res,next){
		if(req.isAuthenticated()) return res.redirect('/');

		if(req.query.referTo) req.session.redirectTo=req.headers.referer;

		res.render("user/login.ejs")
	},

	async postLogin(req,res,next){
		const {username,password}=req.body;
		const {user,error}=await User.authenticate()(username,password);
		if(error&&!user) return next(error);
		
		
		req.login(user,function(err){
			if(err) return next(error);
			req.session.success=`Welcome back ${user.username} !!`
			const redirectUrl=req.session.redirectTo||'/';
			delete req.session.redirectTo;
			return res.redirect(redirectUrl);

		});
	},

	async getProfile(req,res,next){
		const recentPost=await Post.find().where('author').equals(req.user._id).limit(2).sort('-_id').exec();
		res.render('user/profile.ejs',{recentPost});
	},

	async putProfile(req,res,next){
		let user=req.user;
		const checkUser=await User.find({username:req.body.username});
		if((req.body.username!==req.user.username)&&(checkUser&&checkUser.username!==req.user.username)){		//check whether username exists
			req.session.error='Username already exists';
			res.redirect('/profile');
		}

		if(req.file) {

			if(user.avatar.public_id) await cloudinary.v2.uploader.destroy(user.avatar.public_id);
			const {secure_url,public_id}=req.file;
			user.avatar={secure_url,public_id};	
		} 
		
		user.username=req.body.username
		user.email=req.body.email
		user=await user.save();	
		const login = util.promisify(req.login.bind(req));
		await login(user);
		req.session.success="Profile updated !!"
		res.redirect('/profile')
	},


	getForgotPw(req,res,next){
		res.render('user/forgot-password.ejs');
	},

	async postForgotPw(req,res,next){
		const token=await crypto.randomBytes(20).toString('hex');
		const { email }=req.body;
		const user=await User.findOne({ email });
		if(!user) {
			req.session.error=`User with ${email} doesn't exists !!`
			return res.redirect('/forgot-password');
		}
		
		user.resetPasswordToken = token;
		user.resetPasswordExpires = Date.now()+3600000;
		await user.save();

		await postForgotPwMail(req,email,token);/* send mail*/

		req.session.success=`An email has been sent to  ${email} with further instructions your token will expire within 1 hour!!`;
		res.redirect('/forgot-password');

	},

	async getReset(req,res,next){
		const { token } =req.params;
		const user=User.findOne({
			resetPasswordToken:token,
			resetPasswordExpires:{$gt:Date.now()}
		})

		if(!user) {
			req.session.error= 'Reset token is invalid or expired !!';
			return res.redirect('/forgot-password');
		}

		res.render('user/reset-password.ejs',{ token });
	},

	async putReset(req,res,next){
		const { token } =req.params;
		const user=await User.findOne({
			resetPasswordToken:token,
			resetPasswordExpires:{$gt:Date.now()}
		})

		if(!user) {
			req.session.error= 'Reset token is invalid or expired !!';
			return res.redirect('/forgot-password');
		}

		if(req.body.newPassword===req.body.confirmPassword){
				await user.setPassword(req.body.newPassword);
				user.resetPasswordToken=null;
				user.resetPasswordExpires=null;
				await user.save();
				const login=util.promisify(req.login.bind(req));
				await login(user);
		}else{
			req.session.error= 'Password must match !!';
			return res.redirect('back');
		}

	await putResetMail(user.email);

	  req.session.success='Password updated successfully !!'
	  res.redirect('/');
	}

}

