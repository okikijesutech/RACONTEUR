require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const methodOverride = require("method-override");

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(methodOverride("_method"))

app.use(session({
  secret: "The boy is good",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DB);

const postSchema = {
  title: String,
  category: String,
  content: String,
  createdAt: {
    type: Date,
    default: new Date()
  }
};

const Post = mongoose.model("Post", postSchema);

const userSchema = new mongoose.Schema ({
  username: String,
  password: String
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
// these are the routes
app.get('/', function (req, res) {
  Post.find({}, function(err, posts){
    res.render('home', {posts: posts});
  });
});
app.get('/about', function(req, res) {
  res.render('about')
});
app.get('/contact', function (req, res) {
  res.render('contact');
});
app.get("/register", (req, res) => {
  res.render("register")
});
// this is to get the admin dash board
app.get("/admin", (req, res) => {
  if (req.isAuthenticated()) {
    Post.find({}, (err, posts) =>  {
      res.render("admin", {posts: posts})
    })
  } else {
    res.redirect("/login")
  }
})

app.post("/register", (req, res) => {
  User.register({username: req.body.username}, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
    } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/admin")
        })
    }
  })
})
// this is the login page
app.get("/login", (req, res) => {
  res.render("login")
});
// this is the post for the login page
app.post("/login", (req, res) => {
  const user = new User ({
    username: req.body.username,
    pasword: req.body.password
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, ()=> {
        res.redirect("/admin")
      })
    }
  })
});

app.get("/logout", (req, res)=> {
  req.logout();
  res.redirect("/");
});
// this is to get the compose page
app.get('/compose', (req, res) => {
  if (req.isAuthenticated()) {
    Post.find({}, (err, posts) =>  {
      res.render("compose")
    })
  } else {
    res.redirect("/login")
  }
})
// this is to post the compose page
app.post('/compose', (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    category: req.body.postCategory,
    content: req.body.postContent
  });

  post.save((err) => {
    if (!err) {
      res.redirect('/');
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

app.delete("/posts/:postId", (req, res) => {
  Post.findByIdAndRemove()
    res.redirect('/')
});

app.get("/Categories/:CategoriesId", (req, res) => {
  const requestedCategoriesId = req.params.catigoriesId;
  Post.findOne({id: requestedCategoriesId}, (err, foundPost) => {
    if (err) {
      console.log(err)
    } else {
      if (foundPost) {
        res.render("catigories", {posts: posts})
      }
    }
  })
})

app.listen(process.env.PORT || 3000, function () {
  console.log("server up and running");
});
