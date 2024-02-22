const User = require("../models/user"); // import {User} from '../models';
const Movie = require("../models/movie");

const { validationResult } = require('express-validator');

const bcrypt = require("bcryptjs"); // to encrypt the password
exports.getLogin = (req, res, next) => {
  //console.log("GET /login");
  let message = req.flash('error');
  console.log(message);
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
    isAuthenticated:false ,
    csrfToken: req.csrfToken()
  });
};
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  //validation result from routes whether the input is in valid format
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      isAuthenticated: false ,
      csrfToken: req.csrfToken(),
      errorMessage: errors.array()[0].msg
    });
  }

  User.findOne({where:{ email: email }})
    .then((user) => {
      if (!user) {
        req.flash('error' , ' Email not exist ! Please Sign up ');
        res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password) // compare the hashed passwrd and gives the boolean value in a promise
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedin = true;
            req.session.user =  user;
            return req.session.save(err=> {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash('error' , 'Incorrect  Password');
          res.redirect("/login");
        
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false ,
    csrfToken: req.csrfToken(),
    errorMessage: message
  });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const genre = req.body.genre;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      isAuthenticated: false ,
      csrfToken: req.csrfToken(),
      errorMessage: errors.array()[0].msg
    });
  }

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (user) {
        req.flash('error','Email already exist')
        return res.redirect("/signup");
      }
      if (password !== confirmPassword) {
        req.flash('error','Passwords do not match!');
        return res.redirect("/signup");
      }
      return bcrypt.hash(password, 12)
      .then((passHash) => {
        return User.create({
          name: name,
          email: email,
          password: passHash,
          genre: genre,
        });
      }).then(user=>{
        return user.createWishlist();
      })
      .then((result) => {
        res.redirect("/login");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req ,res ,next)=> {
  req.session.destroy((err)=>{
    console.log(err);
    res.redirect('/');
  });
};
