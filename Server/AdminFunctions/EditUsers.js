const {dbConn} = require('../../Config/db.config');
const {getYear,convertTimeBack, getTime, Day, GetWeek, convertTimeTo} = require('../ServerProcessing/TimeCalculation')


function displayUsers(req,res){
    //display list of users
    const CurentUser = req.session.UserName;
    
    dbConn.query("SELECT UserName FROM Users WHERE UserName != ?",[CurentUser],function(err,rows){
        if(err){
            //if an error occures
            res.redirect("/AdminError")
        }
        else{
            const newListItems = rows;
            res.render('AdminUserEdit',{newListItems});
        }

    });
}

function getUserInfo(req,res){
    //get a specific users time information
    const user = req.query.button1
    
    dbConn.query("(SELECT * FROM UserHours WHERE UserName = ? order by id desc limit 7) order by id asc",[user],function(err,rows){
        if(err){
            //if an error occures
            res.redirect("/AdminError")
        }
        else{
            if(rows.length == 0){
               res.redirect("/AdminNoData")
            }
            else{
                const newListItems = rows;
                for(var loop = 0; loop < newListItems.length; loop++){
                    newListItems[loop].ClockIn = convertTimeTo(newListItems[loop].ClockIn)
                    newListItems[loop].BreakIn = convertTimeTo(newListItems[loop].BreakIn)
                    newListItems[loop].BreakOut = convertTimeTo(newListItems[loop].BreakOut)
                    newListItems[loop].ClockOut = convertTimeTo(newListItems[loop].ClockOut)
                }
                req.session.UpdatingUser = user
                res.render('AdminSpecificUser',{user,newListItems});
            }
        }

    });


}
function UpdateUserInfor(req,res){
    //updates a users information
    const user = req.session.UpdatingUser
    const date = req.body.Date;
    const clockin = req.body.ClockIn;
    const breakin = req.body.BreakIn;
    const breakout = req.body.BreakOut;
    const clockout = req.body.ClockOut;

    for(let loop = 0; loop < 7; loop++){
        

        //db query
        dbConn.query("UPDATE UserHours SET ClockIn = ?, BreakIn = ?, BreakOut = ?, ClockOut = ? WHERE UserName = ? && Date = ?",[convertTimeBack(clockin[loop]),convertTimeBack(breakin[loop]),convertTimeBack(breakout[loop]),convertTimeBack(clockout[loop]),user,date[loop]],function(err,rows){
            if(err){
                //if error occures
                res.redirect("/AdminError")
            }
        });
        
    }
    res.redirect("/AdminUserList");

}

module.exports = {displayUsers,getUserInfo,UpdateUserInfor};