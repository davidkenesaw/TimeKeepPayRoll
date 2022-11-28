const {dbConn} = require('../../Config/db.config');
const {getYear, getTime, Day, GetWeek} = require('./TimeCalculation')

function displayTime(req,res){
    const user = req.session.UserName;
    
    dbConn.query("(SELECT * FROM UserHours WHERE UserName = ? order by id desc limit 7) order by id asc",[user],function(err,rows){
        if(err){
            const newListItems = [{Day: "Error, could not get data"}] 
            if(req.session.Admin == "True"){
                res.render('homeAdmin',{newListItems});
            }else{
                res.render('homeLoggedIn',{newListItems});
            }
        }
        else{
            if(rows.length == 0){
                const newListItems = [{Day: "User will be ready to work next week"}] 
                if(req.session.Admin == "True"){
                    res.render('homeAdmin',{newListItems});
                }else{
                    res.render('homeLoggedIn',{newListItems});
                }
            }
            else{
                const newListItems = rows;
                if(req.session.Admin == "True"){
                    res.render('homeAdmin',{newListItems});
                }else{
                    res.render('homeLoggedIn',{newListItems});
                }
            }
        }

    });
}


function ClockIn(req,res){

    const clockIn = getTime()
    const UserName = req.session.UserName;
    const Date = getYear()
    //console.log(UserName)
    //database query
    dbConn.query("UPDATE UserHours SET ClockIn = ? WHERE UserName = ? && Date = ?",[clockIn,UserName,Date],function(err,result){
        
        //if an error occures
        if(err){
            const newListItems = [{Day: "Error, could not get data"}] 
            
            if(req.session.Admin == "True"){
                res.render('homeAdmin',{newListItems});
            }else{
                res.render('homeLoggedIn',{newListItems});
            }
        }else{
            res.redirect('/Homepage');
        }
    });
}
function BreakIn(req,res){
    
    const breakIn = getTime()
    const UserName = req.session.UserName;
    const Date = getYear()

    //database query
    dbConn.query("UPDATE UserHours SET BreakIn = ? WHERE UserName = ? && Date = ?",[breakIn,UserName,Date],function(err,result){
        
        //if an error occures
        if(err){
            const newListItems = [{Day: "Error, could not get data"}] 
            if(req.session.Admin == "True"){
                res.render('homeAdmin',{newListItems});
            }else{
                res.render('homeLoggedIn',{newListItems});
            }
        }else{
            res.redirect('/Homepage');
        }
    });
}
function BreakOut(req,res){
    
    const breakOut = getTime()
    const UserName = req.session.UserName;
    const Date = getYear()

    //database query
    dbConn.query("UPDATE UserHours SET BreakOut = ? WHERE UserName = ? && Date = ?",[breakOut,UserName,Date],function(err,result){
        
        //if an error occures
        if(err){
            const newListItems = [{Day: "Error, could not get data"}] 
            if(req.session.Admin == "True"){
                res.render('homeAdmin',{newListItems});
            }else{
                res.render('homeLoggedIn',{newListItems});
            }
        }else{
            res.redirect('/Homepage');
        }
    });
}
function ClockOut(req,res){
    
    const clockOut = getTime()
    const UserName = req.session.UserName;
    const Date = getYear()

    //database query
    dbConn.query("UPDATE UserHours SET ClockOut = ? WHERE UserName = ? && Date = ?",[clockOut,UserName,Date],function(err,result){
        
        //if an error occures
        if(err){
            const newListItems = [{Day: "Error, could not get data"}] 
            if(req.session.Admin == "True"){
                res.render('homeAdmin',{newListItems});
            }else{
                res.render('homeLoggedIn',{newListItems});
            }
        }else{
            res.redirect('/Homepage');
        }
    });
}
function ChooseTimeSlot(req,res){
    const Date = getYear()
    const user = req.session.UserName;
    dbConn.query("SELECT * FROM UserHours WHERE UserName = ? && Date = ?",[user,Date],function(err,rows){
        
        if(err){
            const newListItems = [{Day: "Error, could not get data"}] 
            res.render('homeLoggedIn',{newListItems});
        }
        else{

            if(rows.length == 0){
                const newListItems = ["User will be ready to work next week"]
                if(req.session.Admin == "True"){
                    res.render('homeAdmin',{newListItems});
                }else{
                    res.render('homeLoggedIn',{newListItems});
                }
            }else if(rows[0].ClockIn == "0:00"){
                ClockIn(req,res)
            }else if(rows[0].BreakIn == "0:00"){
                BreakIn(req,res)
            }else if(rows[0].BreakOut == "0:00"){
                BreakOut(req,res)
            }else if(rows[0].ClockOut == "0:00"){
                ClockOut(req,res)
            }
            else if(!rows[0].ClockOut != "0:00"){
                res.redirect("/Homepage");
            }
        }

    });
}
module.exports = {displayTime,ClockIn,ChooseTimeSlot};