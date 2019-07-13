const express = require('express');
const router = express.Router();
const passport=require("passport")
const {postRegister,getLogout,postLogin,landingPage} = require("../controllers/index.js");
const {asyncErrorHandler}=require("../middleware/index.js");


/* GET home page. */
router.get('/', asyncErrorHandler(landingPage));

/*GET (/register)*/
router.get("/register",(req,res,next)=>{

	res.send("GET /register")
});

/*POST (/register)*/
router.post("/register",asyncErrorHandler(postRegister));

/*GET (/login)*/
router.get("/login",(req,res,next)=>{

	res.send("GET /login")
});

/*POST (/login)*/
router.post("/login",postLogin);

/*GET /logout*/

router.get("/logout",getLogout);

/*GET (/profile)*/
router.get("/profile",(req,res,next)=>{

	res.send("get /profile")
});

/*PUT (/PROFILE)*/
router.put("/profile/:user_id",(req,res,next)=>{

	res.send("PUT /PROFILE")
});



module.exports = router;
