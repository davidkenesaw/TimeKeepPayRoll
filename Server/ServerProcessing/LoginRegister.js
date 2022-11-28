const { dbConn } = require('../../Config/db.config');
const bcrypt = require('bcrypt')
const { getYear, getTime, Day, GetWeek } = require('./TimeCalculation')
const saltRounds = 10;

//function to log user in
function LogUserIn(req, res) {//not done
    const user = req.body.Username;
    const Password = req.body.Password;//add use of password

    //database query
    dbConn.query("SELECT * FROM Users WHERE UserName = ?", [user], function (err, rows) {

        //if an error occures
        if (err) {
            const error = "there was an issue with your username or password";
            res.render('Login', { error });
        }
        else {//log user in the redirect to Codepage
            if (rows.length == 1) {
                bcrypt.compare(Password, rows[0].Password, function (err, result) {
                    if (result == true) {//if logged in is successful
                        req.session.UserName = rows[0].UserName;
                        req.session.FirstName = rows[0].FirstName;
                        req.session.LastName = rows[0].LastName;
                        req.session.Email = rows[0].Email;
                        //add user info to users session
                        req.session.loggedIn = false;
                        req.session.Admin = rows[0].Admin;
                        res.redirect('/CodePage');
                    } else {
                        const error = "UserName or Password is wrong";
                        res.render('Login', { error });//this is wrong
                    }
                });

            } else {//could not find user or password wrong
                const error = "issue with username";
                res.render('Login', { error });//this is wrong
            }
        }

    });
}

//function to register user
function insertUser(req, res) {

    const UserName = req.body.UserName;
    const Password = req.body.Password;

    const FirstName = req.body.FirstName;
    const LastName = req.body.LastName;
    const Email = req.body.Email;

    //encrypt 
    bcrypt.hash(Password, saltRounds, function (err, hash) {
        //database query
        dbConn.query("INSERT INTO Users (UserName,Password,FirstName,LastName,Email) VALUES (?,?,?,?,?)", [UserName, hash, FirstName, LastName, Email], function (err, result) {

            //if an error occures
            if (err) {
                console.log(err)
                const error = "User Taken";
                res.render('Register', { error });
            } else {//register user
                console.log("Data inserted");

                //funtion for inserting 7 entries into UserHours table
                let startDate = new Date();
                const weekDays = GetWeek(startDate, 6);

                for (let loop1 = 0; loop1 < 7; loop1++) {
                    const Date = getYear()
                    dbConn.query("INSERT INTO UserHours (ClockIn,BreakIn,BreakOut,ClockOut,UserName,Date,Day) VALUES (?,?,?,?,?,?,?)", ["0:00", "0:00", "0:00", "0:00", UserName, weekDays[loop1].date, weekDays[loop1].day], function (err, rows) {

                        //if an error occures
                        if (err) {
                            console.log(err)
                            const error = "could not find user";
                        } else {
                            //console.log("New empty fields entered");

                        }
                    });
                }

                res.redirect("/UserRegistered");
            }
        });
    });
}

//chech for user code

function checkCodeEntered(req, res) {
    const crackedCode = req.session.Code;
    //get code from users session
    const user = req.body.code;

    if (user == crackedCode) {//code correct redirect to homepage
        req.session.loggedIn = true;
        res.redirect("/Homepage");
    } else {
        const error = "code incorrect";
        res.render("CodePage", { error })
    }
}

//middleware
function RequireLogin(req, res, next) {
    //if user in sot loggen in the the user will be redirected to log in page

    if (!req.session.loggedIn) {
        return res.redirect('/')
    } next()
}

function RequireAdmin(req, res, next) {
    //if user in sot loggen in the the user will be redirected to log in page

    if (!req.session.loggedIn) {
        return res.redirect('/')
    } if (req.session.Admin != "True") {
        return res.redirect('/')
    } next()
}

function IsLoggedIn(req, res, next) {
    //if user is logged in then user will be redirected to logged in homepage

    if (req.session.loggedIn) {
        return res.redirect('/Homepage')
    } next()
}
function checkPass(req, res, next) {
    //if user is logged in then user will be redirected to logged in homepage

    if (!req.session.CreatedPass) {
        return res.redirect('/')
    } next()
}

function FindUsername(req, res) {//search for Username 
    const user = req.body.Username;

    //database query
    dbConn.query("SELECT * FROM Users WHERE UserName = ?", [user], function (err, rows) {

        //if an error occures
        if (err) {
            const error = "there was an issue with your username";
            res.render('ForgotPasswordUserName', { error });
        }
        else {//found username
            if (rows.length == 1) {
                req.session.UserName = rows[0].UserName;
                req.session.FirstName = rows[0].FirstName;
                req.session.LastName = rows[0].LastName;
                req.session.Email = rows[0].Email;
                req.session.CreatedPass = false;
                res.redirect("/ForgotPasswordCodePage")

            } else {//could not find user
                const error = "issue with username";
                res.render('ForgotPasswordUserName', { error });
            }
        }

    });
}

function checkCodeEnteredFP(req, res) {
    const crackedCode = req.session.CodeFP;
    //get code from users session
    const user = req.body.code;

    if (user == crackedCode) {//code correct redirect forgot password page
        req.session.CreatedPass = true;
        res.redirect("/ForgotPasswordPage");
    } else {
        const error = "code incorrect";
        res.render("CodePageFP", { error })
    }
}


function changePass(req, res) {//change the password

    const UserName = req.session.UserName;
    const Password = req.body.Password;

    //encrypt 
    bcrypt.hash(Password, saltRounds, function (err, hash) {
        //database query
        dbConn.query("UPDATE Users SET Password = ? WHERE UserName = ?", [hash, UserName], function (err, result) {

            //if an error occures
            if (err) {
                const error = "Could not change password";
                res.render('ChangePassword', { error });
            } else {
                req.session.CreatedPass = false;
                console.log("Password Changed");
                res.redirect("/");
            }
        });
    });
}
module.exports = { LogUserIn, insertUser, checkCodeEntered, RequireLogin, IsLoggedIn, FindUsername, checkCodeEnteredFP, changePass, checkPass, RequireAdmin }