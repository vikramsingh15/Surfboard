/*User

email:String
password:String
username:String
image:String
posts:array of object ref post
*/
const mongoose= require("mongoose"),
		Schema=mongoose.Schema,
passportLocalMongoose=require("passport-local-mongoose");


const userSchema = new Schema({
	email: { type: String, unique: true, required: true },
	avatar:{ 
		public_id:String,
		secure_url:{type:String,default:'/images/default-profile.jpg'}
	},
	resetPasswordToken:String,
	resetPasswordExpires:Date
})
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);