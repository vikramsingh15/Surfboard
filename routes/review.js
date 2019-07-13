const express = require('express');
const router=express.Router({mergeParams:true});
const {asyncErrorHandler,isReviewAuthor}=require("../middleware");
const {
	reviewCreate,
	reviewUpdate,
	reviewDelete
}=require("../controllers/review.js");


/* POST review Create (posts/:id/review) */

router.post("/",asyncErrorHandler(reviewCreate))


/* PUT review Update (posts/:id/review/:review_id) */
router.put("/:review_id",isReviewAuthor,asyncErrorHandler(reviewUpdate));


/* DELETE review Destroy(posts/:id/review/:review_id) */
router.delete("/:review_id",isReviewAuthor,asyncErrorHandler(reviewDelete));

module.exports=router;
