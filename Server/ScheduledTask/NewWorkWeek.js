const { dbConn } = require('../../Config/db.config');
const { getYear, getTime, Day, GetWeek } = require('../ServerProcessing/TimeCalculation');
const cron = require('node-cron');
const { paymentReminder } = require('./PaymentReminder')

function nextWeek() {//event driven function that runs every monday at 12:00 am
    cron.schedule('0 0 * * Monday', function () {
        paymentReminder()//sends email to all users saying that they have recieved their payment
        insertUser()//inserts 7 empty records for aevery user, for users to log their times
    })
}

function insertUser() {
    //funtion for inserting 7 entries into UserHours table
    var startDate = new Date();
    const weekDays = GetWeek(startDate, 6);
    //database query
    dbConn.query("SELECT UserName FROM Users", function (err, result) {

        //if an error occures
        if (err) {
            console.log(err)
        } else {
            console.log('adding user hours')
            for (var loop = 0; loop < result.length; loop++) {
                for (let loop1 = 0; loop1 < 7; loop1++) {

                    dbConn.query("INSERT INTO UserHours (ClockIn,BreakIn,BreakOut,ClockOut,UserName,Date,Day) VALUES (?,?,?,?,?,?,?)", ["0:00", "0:00", "0:00", "0:00", result[loop].UserName, weekDays[loop1].date, weekDays[loop1].day], function (err, rows) {

                        //if an error occures
                        if (err) {
                            console.log(err)
                            const error = "could not find user";
                        } else {
                            //console.log("New empty fields entered");

                        }
                    });
                }
            }

        }
    });
}

module.exports = { nextWeek }