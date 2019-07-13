const cloudinary=require("cloudinary"),
	  cloudinaryStorage=require("multer-storage-cloudinary"),
	  multer=require("multer"),
	  crypto=require("crypto");

cloudinary.config({
	cloud_name:"dxkrfrwzc",
	api_key:"665587122729671",
	api_secret:process.env.CLOUDINARY_SECRET
});

const storage=cloudinaryStorage({
	cloudinary,
	folder:'surfBoard',
	allowedFormats: ['jpeg', 'jpg', 'png'],
	filename:(req,file,cb)=>{
		let buf=crypto.randomBytes(16);
		buf=buf.toString('hex');
		let uniqueFileName=file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
		uniqueFileName+=buf;
		cb(undefined,uniqueFileName);
	}
});

const upload=multer({storage})

module.exports={
	cloudinary,
	upload
}



