const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//this tells express which template engine we are using
app.set('view engine', 'ejs');
//this tells express where to find the templates
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(adminData.routes);
app.use(shopRoutes);

app.use((req,res,next)=>{
    res.status(404).render('404', {pageTitle: '404'});
})





app.listen(3000);