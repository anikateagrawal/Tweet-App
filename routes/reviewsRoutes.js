const express=require('express');
const router=express.Router();
const reviews=require('../model/reviews');
const journals=require('../model/journalModel');
const { isLoggedIn } = require('../middleware');

router.post('/journal/:prdid/review',isLoggedIn,async(req,res)=>{
    const {prdid}=req.params;
    const {rating,comment}=req.body;
    const review=await reviews.create({rating,comment,username:req.user.username,creator:req.user.id});
    const journal=await journals.findById(prdid);
    await journal.reviews.splice(0,0,review);
    await journal.save();
    console.log('success');
    req.flash('message','Review added');
    res.redirect('/journal/show/'+prdid);
})

router.delete('/journal/:prdid/reviews/:rvid',isLoggedIn,async(req,res)=>{
    const {prdid,rvid}=req.params;
    await reviews.findByIdAndDelete(rvid);
    const journal=await journals.findById(prdid);
    journal.reviews=journal.reviews.filter((id)=>id!=rvid);
    await journal.save();
    res.redirect('/journals/'+prdid);
})

module.exports=router;