var express = require("express");
var router = express.Router();
var db = require("../config/connection");
var userhelpers = require("../helpers/userhelpers");

//getting the login page
router.get("/", function (req, res, next) {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  if (req.session.loggedIn) {
    res.redirect("/home");
  } else res.render("login", { loginErr: req.session.loggedError });
  req.session.loggedError = null;
});
//entered datas from login page
router.post("/login", (req, res, next) => {
  userhelpers.doLogin(req.body).then((returned) => {
    if (returned.result) {
      req.session.loggedIn = true;
      req.session.user = returned.user;
      res.redirect("/home");
    } else {
      req.session.loggedError = "Invalid username or password";
      res.redirect("/");
    }
  });
});
//displaying home page
router.get("/home", function (req, res, next) {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  if (req.session.loggedIn) {
    let userName = req.session.user;
    res.render("home", { userName });
  } else res.redirect("/");
});
//datas from user to register new player
router.post("/submitdetails", (req, res) => {
  console.log(req.body);
  userhelpers.registerPlayers(req.body).then(() => {
    res.redirect("/home");
  });
});
//logging out from site
router.get("/logout", (req, res) => {
  req.session.loggedIn = false;
  req.session.user = null;
  res.redirect("/");
});
//displaying signup page
router.get("/signup", function (req, res, next) {
  res.render("signup", { Error: req.session.Err });
  req.session.Err = null;
});
//datas from the signup page
router.post("/signup", function (req, res, next) {
  if (req.body.password == req.body.cpassword) {
    userhelpers.doSignup(req.body).then(() => {
      req.session.loggedIn = true;
      res.redirect("/home");
    });
  } else {
    req.session.Err = "Password mismatch";
    res.redirect("/signup");
  }
});
router.get('/pay',(req,res)=>{
  res.render('pay')
})
module.exports = router;
