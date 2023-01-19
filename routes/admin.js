var express = require("express");
const session = require("express-session");
var router = express.Router();
var db = require("../config/connection");
var userhelpers = require("../helpers/userhelpers");
const emailad = "admin@t20.com";
const passwordad = "admin123";
// getting the admin page
router.get("/", function (req, res, next) {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  if (req.session.adminLogged) {
    userhelpers.getAllusers().then((response) => {
      req.session.admin = response;
      res.render("adminhome", { response });
    });
  } else res.render("adminlogin", { loginErr: req.session.loggedErr });
  req.session.loggedErr = null;
});
//getting data from admin login page
router.post("/", function (req, res, next) {
  const userDetails = ({ email, password } = req.body);
  if (email == emailad && password == passwordad) {
    req.session.adminLogged = true;
    res.redirect("/admin");
  } else {
    req.session.loggedErr = "Enter valid username and password";
    res.redirect("/admin");
  }
});
//to new player registration page
router.get("/create", (req, res) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  if (req.session.adminLogged) res.render("home", { admin: true });
});
//adding new player
router.post("/createnew", (req, res) => {
  userhelpers.registerPlayers(req.body).then(() => {
    res.redirect("/admin");
  });
});
//deleting player
router.get("/delete/:id", (req, res) => {
  if (req.session.adminLogged) {
    let deletedOne = req.params.id;
    userhelpers.deleteOne(deletedOne).then((response) => {
      res.redirect("/admin/");
    });
  }
});
//edit player to new page
router.get("/edit/:id", (req, res) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  if (req.session.adminLogged) {
    userhelpers.editOne(req.params.id).then((result) => {
      res.render("edituser", { result });
    });
  }
});
//after edit details of existing players
router.post("/edituser/:id", (req, res) => {
  userhelpers.updateOne(req.params.id, req.body).then(() => {
    res.redirect("/admin");
  });
});
//loggind out from the site
router.get("/adminlogout", function (req, res, next) {
  req.session.admin=null
  req.session.adminLogged=false
  res.redirect("/admin");
});

module.exports = router;
