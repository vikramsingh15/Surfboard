const User=require("../models/user.js");
const passport=require("passport");



module.exports={
	async postRegister(req,res,next){
			const newUser= new User({
				username:req.body.username,
				image:req.body.image,
				email:req.body.email
			});

			await User.register(newUser,req.body.password);
			res.redirect("/");
	
	},

	getLogout(req,res,next){
		req.logout();
		res.redirect("/");
	},

	postLogin(req,res,next){
		passport.authenticate("local",{
			successRedirect:"/",
			failureRedirect:"/login"
		})(req,res,next);
	}


}
