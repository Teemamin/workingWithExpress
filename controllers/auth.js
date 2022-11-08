const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "184ccb3f929036",
      pass: "91ddb225e3d9e6"
    }
  });


exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email:email})
    .then(userDoc=>{
        if(userDoc){
            req.flash('error','user aready exist')
           return res.redirect('/signup');
        }
        return bcrypt.hash(password,12)
        //bcrypt returns a promise, it is an asycrns action
        .then(hashedPassword=>{
            //create user after hashing password
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: {
                    items: []
                }
            })
            return user.save();
        })
        .then(result=>{
            //here the user is saved
            res.redirect('/login')
            return transport.sendMail({
                to: email,
                from: 'shop@node-complete.com',
                subject: 'Signup succeeded!',
                html: '<h1>You successfully signed up!</h1>'
              });
        }).catch(err => {
            console.log(err);
          });
    })
    
    .catch(err=>console.log(err))
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0]
    }else{
        message = null
    }
    res.render(
        'auth/signup',
        {
            path: '/signup',
            pageTitle: 'Signup Page',
            isAuthenticated: req.session.isLoggedIn,
            errorMessage: message
        }
    )
};

exports.getLogin = (req,res,next)=>{
    // const isAuthenticated = req.get('Cookie').trim().split('=')[1]
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0]
    }else{
        message = null
    }
    res.render(
        'auth/login',
        {
            path: '/login',
            pageTitle: 'Login Page',
            isAuthenticated: req.session.isLoggedIn,
            errorMessage: message
            //errorMessage: req.flash('error') 
            //this will pul out what we saved in error, see postLogin
            //after using the flash message it is then removed from the session
        }
    )
}

exports.postLogin = (req,res,next)=>{
    // res.setHeader('Set-Cookie', 'isLoggedIn = true')
    //session saves data across requests but not across users
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
            //flash takes key and value as args "error can be named anything"
            req.flash('error','invalid email or password')
          return res.redirect('/login');
        }
        //if the code makes it here: a user with the email addrss was found
        bcrypt
          .compare(password, user.password)
          .then(doMatch => {
            //in both a matching and non matching case we make it into the then block
            if (doMatch) {
                //doMatch returns a boolean
                //if the passwrd matches
              req.session.isLoggedIn = true;
              req.session.user = user;
        //calling req.session.save before redirect ensure the session is saved first before redirect is fired
              return req.session.save(err => {
                console.log(err);
                res.redirect('/');
              });
            }
            res.redirect('/login');
          })
          .catch(err => {
            //with compare we will only face err if something goes wrong not if the passswrd doesnt match
            console.log(err);
            res.redirect('/login');
          });
      })
      .catch(err => console.log(err));
}

exports.postLogout = (req,res,next)=>{
    // destroys the session data
   req.session.destroy((err)=>{
        console.log(err)
        res.redirect('/');
   })
}