
const { User, Sessions } = require('./db.js')

const express = require('express')
const cookieParser = require("cookie-parser")

const { v4: uuidv4 } = require('uuid');

const app = express()
app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
let loggedin = false
let data = {
    status : loggedin,
    text: '<p>log out current user first</p>'
}




// show home with forms
app.get('/', function( req, res){
    
res.render('pages/home', data)
})
// create a user account
app.post('/create',async function(req, res){
let body = req.body
//await User.findAll().then(user => res.json(user));
res.redirect('/')
})

// login
app.post('/login',async function(req, res){
//pass parameters to database for checking
//match credentials consumes
console.log(req.body.username + ' ' + req.body.password)
let id = uuidv4();
id = String(id)
console.log(id)
await User.findAll(
    {attributes:['username','password'],
    where: { 
       username: req.body.username, 
       password: req.body.password
      } }).then((notes) => {
         console.log(notes.length)
         if(notes.length > 0){
            
            
            //if a cookie already exists, user is still logged in and dont create a new one
if(req.cookies.SID == undefined){

// create cookie that holds the UUID (the Session ID)
res.cookie('SID', id, {
    expires: new Date(Date.now() + 900000),
    httpOnly: true
    })
    loggedin = true
    async function s(){
   await Sessions.create({
    username: req.body.username,
    SID: id,
    session_login : Date.now(),
    session_logout : null
    
}).then(sess=>console.log(sess)).catch(err => console.log(err))};
s();

            res.render('pages/members');

}else if(req.cookies.SID !== undefined){
//logout previous user

    res.redirect('/logout')
}

         }else{
             res.redirect('/error')
            };
      }).catch(err=>console.log(err));


})
// this is the protected route
app.get('/supercoolmembersonlypage', function(req, res){
// attempt to retrieve the session.
// if session exists, get session
// otherwise, session === undefined.
let session = req.cookies.SID
// if session is undefined, then
// this will be false, and we get sent
// to error.ejs
if (session) {
    res.render('pages/members')
    } else {
    res.render('pages/error')
    }
    })
//logout link
app.get('/logout',async function(req, res){
    //close session
    

    await Sessions.findAll().then(session=>console.log(session))
  
    //invalidate SID cookie
    res.cookie('SID', '', {
        expires: new Date(Date.now() - 9000000),
        })
        loggedin = false
         
        //User.findOne().then(user => res.json(user));
              
        res.render('pages/home', data)
        })
// if something went wrong, you get sent here
app.get('/error', function(req, res){
    res.render('pages/error')
    })
// 404 handling
app.all('*', function(req, res){
    res.render('pages/error')
    })
app.listen(1612)
    