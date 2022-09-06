const path = require('path');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');



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
const { use } = require('./routes/admin');



app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res,next)=>{
    User.findByPk(1)
    .then(user=>{
        req.user = user;
        next()
    })
    .catch(err=>console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(display404Controller.display404);
//this means the user created the product
//second args is optional, it lets u define how the relationshp be managed
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
//this is optional, can replace belonsTo with hasMany(), you can use either
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
//{through: CartItem} tells sequelize through which table they are connected
Cart.belongsToMany(Product,{through: CartItem});
Product.belongsToMany(Cart,{through: CartItem});
//get the models(db tables) if exisit else create them
//important: {force: true} is only for development, to overwirte the db tables and refelcet the new changes
// sequelize.sync({force: true})
sequelize.sync()
.then((result)=>{
    // console.log(result)
    return User.findByPk(1)
})
.then(user=>{
    if(!user){
        return User.create({name:'susu',email:'test@test.com'})
    }
    return user
})
.then(user=>{
    // console.log(user);
    return user.createCart();
})
.then(cart=>{
    app.listen(3000);

})
.catch(err=>console.log(err));
