const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const { isLoggedIn } = require('../middleware');
const Journal=require('../model/journalModel');


router.get('/journal',isLoggedIn,async(req,res)=>{
    var posts=await Journal.find({}).populate('creator');
    shuffleArray(posts);
    res.render('journal/index',{posts});
})
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

router.get('/journal/about',(req,res)=>{
    res.render('journal/about');
})

router.get('/journal/contact',(req,res)=>{
    res.render('journal/contact');
})

router.post('/journal/contact',(req,res)=>{
    const {username,email,message}=req.body;
    console.log({username,email,message});
    res.redirect('/journal/contact');
})

router.get('/journal/compose',isLoggedIn,(req,res)=>{
    res.render('journal/compose');
})

router.post('/journal/compose',isLoggedIn,async(req,res)=>{
    const {postTitle,pp}=req.body;
    const date=new Date().toLocaleDateString();
    await Journal.create({postTitle,pp,'creator':req.user.id,date});
    req.flash('msg','Journal Added Successfully');
    res.redirect('/journal');
})

router.get('/journal/show/:id',isLoggedIn,async(req,res)=>{
    try{
    const {id}=req.params;
    const post=await Journal.findById(id);
    await post.populate('creator');
    await post.populate('reviews');
    res.render('journal/readMore',{post});
    }
    catch(err){
        console.log(err);
        res.send(err);
    }
})

router.get('/journal/edit/:id',isLoggedIn,async(req,res)=>{
    const {id}=req.params;
    const post=await Journal.findById(id);
    res.render('journal/edit',{post});
})

router.post('/journal/edit/:id',isLoggedIn,async(req,res)=>{
    const {id}=req.params;
    const {postTitle,pp}=req.body;
    const date=new Date().toLocaleDateString();
    await Journal.findByIdAndUpdate(id,{postTitle,pp,date});
    req.flash('msg','update successful');
    res.redirect(`/journal/show/${id}`);
})

router.delete('/journal/:id',isLoggedIn,async(req,res)=>{
    const {id}=req.params;
    await Journal.findByIdAndDelete(id);
    req.flash('err','deleted successfully');
    res.redirect('/journal');
})

router.get('/journal/myjournals',isLoggedIn,async(req,res)=>{
    const posts=await Journal.find({'creator':req.user.id}).populate('creator');
    res.render('journal/myjournals',{posts});
})

module.exports=router;