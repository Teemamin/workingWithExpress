const path = require('path');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

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



app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(display404Controller.display404);
//this means the user created the product
//second args is optional, it lets u define how the relationshp be managed
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
//this is optional
User.hasMany(Product);

//get the models(db tables) if exisit else create them
//important: {force: true} is only for development, to overwirte the db tables and refelcet the new changes
sequelize.sync({force: true}).then((result)=>{
    // console.log(result)
    app.listen(3000);
})
    .catch(err=>console.log(err));
