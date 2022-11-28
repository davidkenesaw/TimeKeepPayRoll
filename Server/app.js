//require statements
const path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
})
const express = require("express");

const cookieParser = require('cookie-parser');
const { LogUserIn, insertUser, checkCodeEntered, RequireLogin, IsLoggedIn, FindUsername, checkCodeEnteredFP, changePass, checkPass, RequireAdmin } = require('./ServerProcessing/LoginRegister')
const { sendEmail } = require('./ServerProcessing/email')
const { seshOption } = require('../Config/db.config')
const { nextWeek } = require('./ScheduledTask/NewWorkWeek')
const { displayTime, ChooseTimeSlot } = require('./ServerProcessing/TimeKeeping')
const { displayUsers, getUserInfo, UpdateUserInfor } = require("./AdminFunctions/EditUsers")
const { insertUser1 } = require("./AdminFunctions/addUsers")

//configre express app
const app = express();
app.set('view engine', 'ejs');//use ejs
app.use(express.urlencoded({ extended: true }));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))//add bootsrap css
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))//add bootsrap javascript
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))//add bootsrap jquery
app.use(cookieParser(process.env.SECRETE));//change this and make it secrete
app.set('views', path.join(__dirname, '../Client/views'));//show express the views directory
app.use(express.static(path.join(__dirname, '../Client')));//show express the Client directory
app.use(seshOption)//configuration for express session

//scheduled Tasks
nextWeek()

//get Pages

app.get("/", IsLoggedIn, function (req, res) {//login page
    const error = "";
    res.render("Login", { error });
});
app.get("/RegisterPage", function (req, res) {//register page
    const error = "";
    res.render("Register", { error });
});
app.get('/CodePage', function (req, res) {//enter in a code page
    const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
    //10 digit random number
    req.session.Code = randomNumber
    //add code to users session
    sendEmail(req.session.Email, randomNumber)
    //send email of code to user 

    const error = "";
    res.render('CodePage', { error });
});
app.get('/UserRegistered', function (req, res) {//page displaying user is registered
    res.render('Registered');
});
app.get("/Homepage", RequireLogin, displayTime);
app.get("/AdminUserList", RequireAdmin, displayUsers);
app.get("/AdminUser", RequireAdmin, getUserInfo);
app.post("/AdminEdit", UpdateUserInfor);
app.get("/AdminRegPage", RequireAdmin, function (req, res) {//register page
    const error = "";
    res.render("AdminRegister", { error });
});
app.get("/AdminError", RequireAdmin, function (req, res) {//register page
    res.render("AdminHomeError");
});
app.get("/AdminNoData", RequireAdmin, function (req, res) {//register page
    res.render("AdminNoDataYet");
});
app.get("/HomeError", function (req, res) {//register page
    res.render("homeError");
});
app.get("/ForgotPasswordUserNamePage", function (req, res) {//homepage
    const error = "";
    res.render("ForgotPasswordUserName", { error });
});
app.get("/ForgotPasswordCodePage", function (req, res) {//homepage
    const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
    //10 digit random number
    req.session.CodeFP = randomNumber
    //add code to users session
    sendEmail(req.session.Email, randomNumber)
    //send email of code to user 

    const error = "";
    res.render('CodePageFP', { error });
});
app.get("/ForgotPasswordPage", checkPass, function (req, res) {//homepage
    const error = "";
    res.render("ChangePassword", { error });
});


//http post requests
app.post("/Login", LogUserIn)//login functionality
app.post('/CompleteLogin', checkCodeEntered);
app.post("/Register", insertUser1)//register functionality
app.post("/SignOut", function (req, res) {

    req.session.UserName = null;
    //set users session username to null 

    req.session.loggedIn = false;

    res.redirect('/');
})
app.post("/SendAgain", (req, res) => {//send code again
    res.redirect('/CodePage');
})
app.post("/ConfirmUserName", FindUsername)//confim if this is the username for forgot password
app.post("/ConfirmFPCode", checkCodeEnteredFP)//confirm forgot password code
app.post("/SendCodeFPAgain", (req, res) => {//send code again for forgot massword
    res.redirect('/ForgotPasswordCodePage');
})
app.post("/ChangePass", changePass)//change the password

app.listen(process.env.PORT || 3456, function () {//host site
    console.log("Port: 3456");
});

//time Keeping
app.post("/SetTime", RequireLogin, ChooseTimeSlot)