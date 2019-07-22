const express = require('express');
const router=express.Router();
const {upload}=require("../cloudinary");

const {
	postsIndex,
	postsNew,
	postsCreate,
	postsShow,
	postsEdit,
	postsUpdate,
	postsDelete	
	}=require("../controllers/posts.js");
const {asyncErrorHandler,isLoggedIn,isPostAuthor,searchAndFilterPosts}=require("../middleware")


/* GET posts Index (/posts)*/
router.get('/',asyncErrorHandler(searchAndFilterPosts), asyncErrorHandler(postsIndex));

/* GET posts New (/posts/new) */
router.get('/new',isLoggedIn,postsNew);

/* POST posts Create (/posts) */

router.post("/",isLoggedIn,upload.array("images",4),asyncErrorHandler(postsCreate));


/* GET posts Show (/posts/:id) */
router.get('/:id', asyncErrorHandler(postsShow));

/* GET posts Edit (/posts/:id/edit) */
router.get('/:id/edit',isLoggedIn,
	isPostAuthor,asyncErrorHandler(postsEdit));

/* PUT posts Update (/posts/:id) */
router.put("/:id",isLoggedIn,isPostAuthor,
	upload.array("images",4),asyncErrorHandler(postsUpdate));

/* DELETE posts Destroy(/posts/:id) */
router.delete("/:id",isLoggedIn,isPostAuthor,asyncErrorHandler(postsDelete));

module.exports=router;
