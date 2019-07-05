const express = require('express');
const router=express.Router({mergeParams:true});


/* GET review Index (posts/:id/review)*/
router.get('/', (req, res, next)=> {
  res.send("INDEX posts/:id/review");
});

/* POST review Create (posts/:id/review) */

router.post("/",(req,res,next)=>{
	res.send("CREATE posts/:id/review")
})

/* GET review Edit (posts/:id/review/:review_id/edit) */
router.get('/:review_id/edit', (req, res, next)=> {
  res.send("Show /review/:review_id/edit");
});

/* PUT review Update (posts/:id/review/:review_id) */
router.put("/:review_id",(req,res,next)=>{
	res.send("PUT /review/:review_id")
});

/* DELETE review Destroy(posts/:id/review/:review_id) */
router.delete("/:review_id",(req,res,next)=>{
	res.send("DELETE /review/:review_id")
});

module.exports=router;
