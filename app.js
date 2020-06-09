//npm install passport passport-local passport-local-mongoose express-session --save
//npm install --save connect-flash
//npm install -g nodemon

//install lastest version mongoose
//npm uninstal mongoose ; npm install --save mongoose@5.9.17 
//copy the version from https://mongoosejs.com


var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"), 
	Campground = require("./models/campground"), 
	Comment = require("./models/comment"),
	seedDB = require("./seeds"), 
	passport = require("passport"), 
	LocalStrategy = require("passport-local"), 
	User = require("./models/user"),
	methodOverride = require("method-override"), 
	flash = require("connect-flash"); 

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index"); 

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParse: true}); 
app.use(bodyParser.urlencoded({extended:true})); 
app.set("view engine", "ejs"); 
app.use(express.static(__dirname + "/public")); 
app.use(methodOverride("_method"));
app.use(flash()); 
// seedDB(); //seed the database

//passport configuration
app.use(require("express-session")({
	secret:"hello everyone", 
	resave:false, 
	saveUninitialized:false
})); 
app.use(passport.initialize()); 
app.use(passport.session()); 
app.use(function(req, res, next) {
	res.locals.currentUser = req.user; 
	res.locals.error = req.flash("error"); 
	res.locals.success = req.flash("success"); 
	next(); 
}); 
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 





// var campgrounds = [
// 		{name: "A", image:"https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"},
// 		{name: "B", image:"https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"},
// 		{name: "C", image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"}
// 	]

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(3000, function() {
	console.log("The YelpCamp Server Has Started!"); 
})