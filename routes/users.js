var express = require("express");
var router = express.Router();
const Axios = require("axios");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
var passwordValidator = require("password-validator");
const bcryptjs = require("bcryptjs");
var schema = new passwordValidator();
schema
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .symbols()
  .has()
  .digits();
const { passport } = require("../lib/passport");
// const passport = require("passport");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
  }),
  function (req, res) {
    res.status(200).json({ user: req });
  }
);

router.post("/signup", body("username").isEmail(), function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const passwordErrors = schema.validate(req.body.password, { list: true });
  if (passwordErrors.length > 0)
    return res
      .status(400)
      .json({ errors: ["Invalid password", ...passwordErrors] });
  Axios.get(
    "https://gist.githubusercontent.com/tbrianjones/5992856/raw/93213efb652749e226e69884d6c048e595c1280a/free_email_provider_domains.txt"
  ).then((rsp) => {
    const domain = req.body.username.split("@")[1];
    const disallowedDomains = rsp.data.split("\n");
    if (disallowedDomains.includes(domain)) {
      return res.status(400).json({ errors: ["Domain not allowed"] });
    }
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    user.save().then(() => {
      res.status(200).json({ msg: "signup successful" });
    });
  });
});

module.exports = router;
