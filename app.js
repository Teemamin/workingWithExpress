const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/user');

const app = express();

//this tells express which template engine we are using
app.set('view engine', 'ejs');
//this tells express where to find the templates
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const display404Controller = require('./controllers/404');



app.use(bodyParser.urlencoded({extended:false}));
const mongoose = require('mongoose');
app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res,next)=>{
    User.findById('6341a713f3d3a66c0816c17a')
    //the user here is a full mongoose obj
    .then(user=>{
        req.user = user;
        next()
    })
    .catch(err=>console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(display404Controller.display404);


mongoose.connect('mongodb+srv://susu:surimama@cluster0.ndona.mongodb.net/shop?retryWrites=true&w=majority')
.then(result=>{
    //findOne if no args passd it will always return the first match it finds
    User.findOne().then(user=>{
        if(!user){
            const user = new User(
                {
                    username: 'Susu',
                    email: 'test@testing.com',
                    cart: {
                        items: []
                    }
                }
            )
            user.save();
        }
    })
    
    app.listen(3000);
})
.catch(err=>console.log(err))
