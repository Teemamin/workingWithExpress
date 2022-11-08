module.exports = (req,res,next)=>{
    if(!req.session.isLoggedIn){
        res.redirect('/login')
    }
    //calling next so ensure the req moves on to the whichever route it was going
    // on routes: you can add as many handlers as you wish and the req will be funneled through them from
    //left to right, it calls the next middle ware in action
    next()
}