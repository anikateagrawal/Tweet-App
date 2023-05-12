const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    email:String,
    isAdmin:Boolean,
    saved:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Journal'
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    image:{type:String,
        default:"https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"},
    bio:String,
    Name:String,
    Address:String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);