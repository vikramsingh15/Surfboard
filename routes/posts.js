const express = require('express');
const router=express.Router();



/* GET posts Index (/posts)*/
router.get('/', (req, res, next)=> {
  res.send("INDEX /posts");
});

/* GET posts New (/posts/new) */
router.get('/new', (req, res, next)=> {
  res.send("new /posts/new");
});

/* POST posts Create (/posts/new) */

router.post("/",(req,res,next)=>{
	res.send("CREATE /posts")
})

/* GET posts Show (/posts/:id) */
router.get('/:id', (req, res, next)=> {
  res.send("Show /posts/:id");
});

/* GET posts Edit (/posts/:id/edit) */
router.get('/:id/edit', (req, res, next)=> {
  res.send("Show /posts/:id/edit");
});

/* PUT posts Update (/posts/:id) */
router.put("/:id",(req,res,next)=>{
	res.send("PUT /posts/:id")
});

/* DELETE posts Destroy(/posts/:id) */
router.delete("/:id",(req,res,next)=>{
	res.send("DELETE /posts/:id")
});

module.exports=router;
