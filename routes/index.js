const express = require('express');
const router = express.Router();
const passport=require("passport");
const {upload}=require('../cloudinary');

const { 
	getLogin,
	getRegister,
	postRegister,
	getLogout,
	postLogin,
	landingPage,
	getProfile,
	putProfile,
	getForgotPw,
	postForgotPw,
	getReset,
	putReset} = require("../controllers/index.js");
	
const {asyncErrorHandler,
	   isLoggedIn,
	   isValidPassword,
	   changePassword}=require("../middleware/index.js");


/* GET home page. */
router.get('/', asyncErrorHandler(landingPage));

/*GET (/register)*/
router.get("/register",getRegister);

/*POST (/register)*/
router.post("/register",upload.single('avatar'),asyncErrorHandler(postRegister));

/*GET (/login)*/
router.get("/login",getLogin);

/*POST (/login)*/
router.post("/login",asyncErrorHandler(postLogin));

/*
logout*/
router.get("/logout",getLogout);

/*GET (/profile)*/
router.get("/profile",isLoggedIn,asyncErrorHandler(getProfile));


/*PUT (/PROFILE)*/
router.put("/profile/:user_id",isLoggedIn,
	upload.single('avatar'),
	asyncErrorHandler(isValidPassword),
	asyncErrorHandler(changePassword),asyncErrorHandler(putProfile));

router.get('/forgot-password',getForgotPw);

router.post('/forgot-password',asyncErrorHandler(postForgotPw));

router.get('/reset/:token',asyncErrorHandler(getReset));

router.put('/reset/:token',asyncErrorHandler(putReset));



module.exports = router;
