const express=require('express');
const app=express();
const path=require('path');
const router=require('./routes/routes');
const engine=require('ejs-mate');
const mongoose=require('mongoose');
const Journal=require('./model/journalModel')
const methodOverride=require('method-override');
const session=require('express-session');
const flash=require('connect-flash');
const {locals}=require('./middleware');
const authRoutes=require('./routes/authRoutes');
const port=3000;
const passport=require('passport');
const LocalStrategy=require('passport-local');
const MongoDBStore = require('express-mongodb-session')(session);
const reviewRoutes=require('./routes/reviewsRoutes');
const userRoutes=require('./routes/userRoutes');
const profileRoutes=require('./routes/profileRoutes');

dburl2="mongodb+srv://Anikate7316ag:Anikate%4025@cluster0.ofjnmbo.mongodb.net/TweetApp";
dburl='mongodb://127.0.0.1:27017/TweetApp';


const User = require('./model/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const store = new MongoDBStore({
    uri: dburl,
    collection: 'mySessions',
    expires:60*60*1000*7*24
  });
  
  // Catch errors
  store.on('error', function(error) {
    console.log(error);
  });
  

app.use(session({
  secret: 'Secret Daily Journal',
  resave: true,
  saveUninitialized: true,
  cookie: {},
  store:store
}))
app.use(passport.session());

app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash());
app.use(locals);


mongoose.connect(dburl).then(()=>{
    console.log("db connected");
}).catch((err)=>{
    console.log(err); 
});

app.use(router);
app.use(authRoutes);
app.use(reviewRoutes);
app.use(userRoutes);
app.use(profileRoutes);

app.get('/',(req,res)=>{
    res.redirect('/journal');
})


app.listen(port,()=>{
    console.log("Server Connected at port "+port);
})