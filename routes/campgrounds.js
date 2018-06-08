
var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");
var geocoder = require("geocoder");
var multer = require("multer");
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require("cloudinary");
cloudinary.config({ 
  cloud_name: "courtcloud", 
  api_key: 394781639476534, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//INDEX - show all campgrounds
router.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search){
      const regex = new RegExp(escapeRegex(req.query.search), "gi");
          // Get all campgrounds from DB
            Campground.find({name: regex}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
           if(allCampgrounds.length < 1) {
              noMatch = "No campgrounds match that query, please try again.";
           }
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds', noMatch: noMatch});
        }
     });
       } else {
           // Get all campgrounds from DB
             Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds', noMatch: noMatch});
       }
    });
    }
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, upload.single("image"), function(req, res) {
  // get data from form and add to campgrounds array
  
  var price = req.body.price;
  geocoder.geocode(req.body.location, function (err, data) {
      if(err) {
          console.log(err);
      } else {
        console.log(data);
        req.body.campground.lat = data.results[0].geometry.location.lat;
        req.body.campground.lng = data.results[0].geometry.location.lng;
        req.body.campground.location = data.results[0].formatted_address;
        cloudinary.uploader.upload(req.file.path, function(result) {
  // add cloudinary url for the image to the campground object under image property
  req.body.campground.image = result.secure_url;
  // add author to campground
  req.body.campground.author = {
    id: req.user._id,
    username: req.user.username
  }
  Campground.create(req.body.campground, function(err, campground) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    res.redirect('/campgrounds/' + campground.id);
  });
});
    }

  });
});
//New - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//Show - shows more info about on campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            console.log(foundCampground);
           res.render("campgrounds/show", {campground: foundCampground});  
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
     Campground.findById(req.params.id, function(err, foundCampground){
         if(err){
             res.redirect("/campgrounds");
         } else {
            res.render("campgrounds/edit", {campground: foundCampground});  
         }
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
   var newData = {name: req.body.campground.name, image: req.body.campground.image, description: req.body.campground.description, price: req.body.campground.price, location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;