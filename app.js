const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/user');
const mongoose = require('mongoose');
const session = require('express-session');
//MongoDBStore returns a functn to which you pass the express-session
const MongoDBStore = require('connect-mongodb-session')(session);
const envars = require('./util/database');
const MONGO_DB_URI = envars.MONGO_DB_URI;
const csrf = require('csurf');
const flash = require('connect-flash');

const app = express();
//store is used to store session data
const store = new MongoDBStore({
    uri: MONGO_DB_URI,
    collection: 'mySessions'
  });

  const csrfProtection = csrf();
  
  // Catch errors
  store.on('error', function(error) {
    console.log(error);
  });

//this tells express which template engine we are using
app.set('view engine', 'ejs');
//this tells express where to find the templates
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const display404Controller = require('./controllers/404');



app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
//resave: false will ensure the session is not resaved for evry incoming req
//saveUninitialized: false ensures no session is saved for req wr it dosnt need to be saved
//session middleware automatically sets a session for you and also automatcly reads the cookie value
app.use(session(
        {
            secret: envars.secret,
            resave: false,
            saveUninitialized: false,
            store: store
        }
    )
)
//csrfProtection should be initialize after the seesion, cos the csrf will use the session
app.use(csrfProtection);
app.use(flash());
app.use((req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    //at this point in the code session data is set
    User.findById(req.session.user._id)
    //the user here is a full mongoose obj
    .then(user=>{
        req.user = user;
        next()
    })
    .catch(err=>console.log(err))
})

app.use((req,res,next)=>{
    //this will pass the vars to all the templates being rendered
    //for every req that is executed these vars will be set to the rendered view
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    //calling next so that we are able to continue
    next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(display404Controller.display404);


mongoose.connect(MONGO_DB_URI)
.then(result=>{  
    app.listen(3000);
})
.catch(err=>console.log(err))
