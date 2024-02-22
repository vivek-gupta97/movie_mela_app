const path = require("path");

const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");

const { check, body } = require("express-validator");

const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Please enter valid Email"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Minimum Password length has to be 5"),
  ],
  authController.postLogin
);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Please enter valid Email"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Minimum Password length has to be 5"),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

module.exports = router;
