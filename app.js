const express = require('express')
const cookieParser = require("cookie-parser")
const fake_db = require("./db.js")
const { v4: uuidv4 } = require('uuid');
const matchCredentials = require('./utils.js')
const app = express()
app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
let loggedin = false
console.log(loggedin)
let data = {
    status : loggedin,
    text: '<p>log out current user first</p>'
}




// show home with forms
app.get('/', function(req, res){
    console.log(loggedin)
res.render('pages/home', data)
})
// create a user account
app.post('/create', function(req, res){
let body = req.body
let user = {
username: body.username,
password: body.password
}
fake_db.users[user.username] = user
console.log(fake_db)
res.redirect('/')
})

// login
app.post('/login', function(req, res){

if (matchCredentials(req.body,fake_db)) {
let user = fake_db.users[req.body.username].username
console.log(user)

// this creates a random id that is,
// for all practical purposes,
// guaranteed to be unique. We’re
// going to use it to represent the
// logged in user, and their session
let id = uuidv4()
// create session record
// Use the UUID as a key
// for an object that holds
// a pointer to the user
// and their time of login.
// If we have any data that we
// want to hold that doesn’t belong in
// database, can put it here as well.
console.log(req.cookies.SID)
//if a cookie already exists, user is still logged in and dont create a new one
if(req.cookies.SID == undefined){
fake_db.sessions[id] = {
user: user,
timeOfLogin: Date.now()
}} else if(req.cookies.SID !== undefined){
//logout previous user

    res.redirect('/logout')
}

console.log(fake_db)
// create cookie that holds the UUID (the Session ID)
res.cookie('SID', id, {
expires: new Date(Date.now() + 900000),
httpOnly: true
})
loggedin = true
console.log(loggedin)
res.render('pages/members')
} else {
res.redirect('/error')
}
})
// this is the protected route
app.get('/supercoolmembersonlypage', function(req, res){
let id = req.cookies.SID
// attempt to retrieve the session.
// if session exists, get session
// otherwise, session === undefined.
let session = fake_db.sessions[id]
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
app.get('/logout', function(req, res){
    //delete session

    delete fake_db.sessions[req.cookies.SID]
    //invalidate SID cookie
    res.cookie('SID', '', {
        expires: new Date(Date.now() - 9000000),
        })
        loggedin = false
        console.log(loggedin)
        console.log(fake_db)
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
    