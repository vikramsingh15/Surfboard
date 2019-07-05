const express = require('express');
const router=express.Router();
const multer=require("multer");
const upload = multer({dest:"uploads/"});
const {
	postsIndex,
	postsNew,
	postsCreate,
	postsShow,
	postsEdit,
	postsUpdate,
	postsDelete	
	}=require("../controllers/posts.js");
const {asyncErrorHandler}=require("../middleware")


/* GET posts Index (/posts)*/
router.get('/', asyncErrorHandler(postsIndex));

/* GET posts New (/posts/new) */
router.get('/new',postsNew);

/* POST posts Create (/posts) */

router.post("/",upload.array("images",4),asyncErrorHandler(postsCreate));


/* GET posts Show (/posts/:id) */
router.get('/:id', asyncErrorHandler(postsShow));

/* GET posts Edit (/posts/:id/edit) */
router.get('/:id/edit',asyncErrorHandler(postsEdit));

/* PUT posts Update (/posts/:id) */
router.put("/:id",upload.array("images",4),asyncErrorHandler(postsUpdate));

/* DELETE posts Destroy(/posts/:id) */
router.delete("/:id",asyncErrorHandler(postsDelete));

module.exports=router;
