var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1470246973918-29a93221c455?dpr=1&auto=format&fit=crop&w=376&h=564&q=60&cs=tinysrgb",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mauris sem, varius ut risus sit amet, tempor convallis augue. Quisque sed elementum sapien, eu hendrerit nisl. Donec ac porta mauris. Nulla in odio elementum leo efficitur consequat ut a dui. Praesent enim dui, ornare in molestie et, pretium vitae sapien. Mauris aliquet tortor at sollicitudin ornare. Donec leo ligula, vulputate non scelerisque et, rhoncus in risus. Donec in justo ut purus dictum tempor vitae non eros. Aliquam erat volutpat. Sed aliquet vitae sapien quis finibus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus eget leo vel lorem iaculis luctus. Nunc lorem dolor, scelerisque vel dignissim congue, fermentum id magna. Etiam tempus vitae nulla eu faucibus."
    },
    {
        name: "Desert Mesa",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoalSyWai9q874Zk-d0BOLqI73e3BRooINwkZ8HKFBkz-pjXJd",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mauris sem, varius ut risus sit amet, tempor convallis augue. Quisque sed elementum sapien, eu hendrerit nisl. Donec ac porta mauris. Nulla in odio elementum leo efficitur consequat ut a dui. Praesent enim dui, ornare in molestie et, pretium vitae sapien. Mauris aliquet tortor at sollicitudin ornare. Donec leo ligula, vulputate non scelerisque et, rhoncus in risus. Donec in justo ut purus dictum tempor vitae non eros. Aliquam erat volutpat. Sed aliquet vitae sapien quis finibus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus eget leo vel lorem iaculis luctus. Nunc lorem dolor, scelerisque vel dignissim congue, fermentum id magna. Etiam tempus vitae nulla eu faucibus."
    },
    {
        name: "Canyon Floor",
        image: "https://static.wixstatic.com/media/7a6231_d8bc055c721a4dd5b8563500ad0b11cf~mv2_d_5760_3840_s_4_2.jpg/v1/fill/w_784,h_523,al_c,q_90,usm_0.66_1.00_0.01/7a6231_d8bc055c721a4dd5b8563500ad0b11cf~mv2_d_5760_3840_s_4_2.webp",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mauris sem, varius ut risus sit amet, tempor convallis augue. Quisque sed elementum sapien, eu hendrerit nisl. Donec ac porta mauris. Nulla in odio elementum leo efficitur consequat ut a dui. Praesent enim dui, ornare in molestie et, pretium vitae sapien. Mauris aliquet tortor at sollicitudin ornare. Donec leo ligula, vulputate non scelerisque et, rhoncus in risus. Donec in justo ut purus dictum tempor vitae non eros. Aliquam erat volutpat. Sed aliquet vitae sapien quis finibus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus eget leo vel lorem iaculis luctus. Nunc lorem dolor, scelerisque vel dignissim congue, fermentum id magna. Etiam tempus vitae nulla eu faucibus."
    }
]

function seedDB(){
  Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
      console.log("remove campgrounds");
             data.forEach(function(seed){
             Campground.create(seed, function(err, campground){
              if(err){
                  console.log(err);
              } else {
                  console.log("added a campground");
                   
                  Comment.create(
                      {
                          text: "This place is great, but I wish there was internet",
                          author: "Homer"
                      }, function(err, comment){
                          if(err){
                              console.log(err);
                          } else {
                              campground.comments.push(comment._id);
                              campground.save();
                              console.log("Created new comment");
                          }
                      });
              }
            });
        });
    });  
    
}

module.exports = seedDB;