const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//this tells express which template engine we are using
app.set('view engine', 'ejs');
//this tells express where to find the templates
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const display404Controller = require('./controllers/404');
const mongoConnect = require('./util/database');


app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res,next)=>{
    // User.findByPk(1)
    // .then(user=>{
    //     req.user = user;
    //     next()
    // })
    // .catch(err=>console.log(err))
    next()
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(display404Controller.display404);

mongoConnect.mongoConnect(()=>{
    app.listen(3000);
})
