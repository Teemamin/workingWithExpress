const User = require('../models/user');
const bcrypt = require('bcryptjs');


exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email:email})
    .then(userDoc=>{
        if(userDoc){
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
        })
    })
    
    .catch(err=>console.log(err))
}

exports.getSignup = (req, res, next) => {
    res.render(
        'auth/signup',
        {
            path: '/signup',
            pageTitle: 'Signup Page',
            isAuthenticated: req.session.isLoggedIn
        }
    )
};

exports.getLogin = (req,res,next)=>{
    // const isAuthenticated = req.get('Cookie').trim().split('=')[1]
    res.render(
        'auth/login',
        {
            path: '/login',
            pageTitle: 'Login Page',
            isAuthenticated: req.session.isLoggedIn
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