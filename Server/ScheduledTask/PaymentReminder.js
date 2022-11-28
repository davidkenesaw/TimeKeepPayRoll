const { dbConn } = require('../../Config/db.config');
const { getYear, getTime, Day, GetWeek } = require('../ServerProcessing/TimeCalculation');
const cron = require('node-cron');
const { sendPaymentReminder } = require('../ServerProcessing/email');

function paymentReminder() {
    //funtion for inserting 7 entries into UserHours table

    //database query
    dbConn.query("SELECT * FROM Users", function (err, result) {

        //if an error occures
        if (err) {
            console.log(err)
        } else {

            for (var loop = 0; loop < result.length; loop++) {
                sendPaymentReminder(result[loop].Email, result[loop].FirstName);
            }

        }
    })
}

module.exports = { paymentReminder }