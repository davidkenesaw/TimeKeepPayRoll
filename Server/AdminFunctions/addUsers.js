const { dbConn } = require('../../Config/db.config');
const bcrypt = require('bcrypt')
const { getYear, getTime, Day, GetWeek } = require('../ServerProcessing/TimeCalculation')
const saltRounds = 10;


//function to register user
function insertUser1(req, res) {

    const UserName = req.body.UserName;
    const Password = req.body.Password;

    const FirstName = req.body.FirstName;
    const LastName = req.body.LastName;
    const Email = req.body.Email;

    if (UserName.length < 5) {

        const error = "User name must be at least 6 characters";
        return res.render('AdminRegister', { error });
    }
    else if (UserName.length > 50) {
        const error = "User name must be less than 50 characters";
        return res.render('AdminRegister', { error })

    }
    else if (Password.length > 50) {
        const error = "Password must be less than 50 characters";
        return res.render('AdminRegister', { error })

    }
    else if (FirstName.length > 50) {
        const error = "First name must be less than 50 characters";
        return res.render('AdminRegister', { error })

    }

    else if (LastName.length > 50) {
        const error = "Last name must be less than 50 characters";
        return res.render('AdminRegister', { error })

    }

    else if (Email.length > 50) {
        const error = "Email must be less than 50 characters";
        return res.render('AdminRegister', { error })

    }


    else if (Password.length < 5) {

        const error = "Password must be at least 6 characters";
        return res.render('AdminRegister', { error });
    }


    //encrypt 
    bcrypt.hash(Password, saltRounds, function (err, hash) {
        //database query
        dbConn.query("INSERT INTO Users (UserName,Password,FirstName,LastName,Email) VALUES (?,?,?,?,?)", [UserName, hash, FirstName, LastName, Email], function (err, result) {

            //if an error occures
            if (err) {
                console.log(err)
                const error = "User Taken";
                res.render('AdminRegister', { error });
            } else {//register user
                const error = "User added";
                res.render("AdminRegister", { error });
            }
        });
    });
}
module.exports = { insertUser1 };