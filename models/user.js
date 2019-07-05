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
	email:String,
	password:String,
	username:String,
	image:String,
	posts:[{
		type:Schema.Types.ObjectId,
		ref:"Post"
	}]
})
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);