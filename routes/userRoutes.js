const express=require('express');
const router=express.Router();
const {isLoggedIn}=require('../middleware');
const User=require('../model/user');
const Journal=require('../model/journalModel');


router.get('/user',isLoggedIn,(req,res)=>{
    res.render('user/userInfo');
})

router.post('/journal/saved/:pid/add',isLoggedIn,async(req,res)=>{
    const uid=req.user.id;
    const {pid}=req.params;
    const user=await User.findById(uid);
    user.saved.splice(0,0,pid);
    await user.save();
    req.flash('msg','post successfully added to saved');
    res.redirect('/journal');
})

router.get('/saved',isLoggedIn,async(req,res)=>{
    const user=req.user;
    await user.populate('saved');
    for(let p of user.saved){
        await p.populate('creator');
    }
    const posts=user.saved;
    res.render('user/saved',{posts});
})  

router.delete('/journal/saved/:pid',isLoggedIn,async(req,res)=>{
    const uid=req.user.id;
    const {pid}=req.params;
    const user=await User.findById(uid);
    user.saved=user.saved.filter((p)=>p!=pid);
    await user.save();
    req.flash('err','post removed from saved');
    res.redirect('/');
})


router.post('/profile/follow/:pid',isLoggedIn,async(req,res)=>{
    const user=await User.findById(req.user.id);
    const {pid}=req.params;
    const followuser=await User.findById(pid);
    if(user.following.includes(pid)){
        req.flash('err','already following');
        res.redirect('/profile/'+pid);
    }
    else{
        followuser.followers.push(user.id);
        await followuser.save();
        user.following.push(pid);
        await user.save();
        req.flash('msg','added to following');
        res.redirect('/profile/'+pid);
    }
})

router.delete('/profile/follow/:pid',isLoggedIn,async(req,res)=>{
    const user=await User.findById(req.user.id);
    const {pid}=req.params;
    const followuser=await User.findById(pid);
    user.following=user.following.filter((id)=>id!=pid);
    followuser.followers=followuser.followers.filter((id)=>id!=user.id);
    await user.save();
    await followuser.save();
    req.flash('msg','unfollowed');
    res.redirect('/profile/'+pid);
})

router.get('/following',isLoggedIn,async(req,res)=>{
    const posts=[];
    const following =req.user.following;
    for(let f of following){
        const p=await Journal.find({'creator':f}).populate('creator');
        posts.push(...p);
    }
    res.render('user/following',{posts});
})
module.exports=router;
