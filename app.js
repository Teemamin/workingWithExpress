const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/user');

const app = express();

//this tells express which template engine we are using
app.set('view engine', 'ejs');
//this tells express where to find the templates
app.set('views', 'views');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
const display404Controller = require('./controllers/404');



app.use(bodyParser.urlencoded({extended:false}));
const mongoose = require('mongoose');
app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res,next)=>{
    User.findById('6335fccdbcfbdbae9e753172')
    .then(user=>{
        req.user = new User(user.username,user.email,user.cart,user._id);
        next()
    })
    .catch(err=>console.log(err))
})

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(display404Controller.display404);


mongoose.connect('mongodb+srv:')
.then(result=>{
    app.listen(3000);
})
.catch(err=>console.log(err))
