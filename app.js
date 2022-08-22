const path = require('path');
const db = require('./util/database');

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

db.execute('SELECT * FROM products')
    .then((result)=>{
        console.log(result[0], result[1])
    }).catch((err)=>{
        console.log(err)
    });

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(display404Controller.display404);





app.listen(3000);