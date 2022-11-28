//send an email

const { sgMail } = require('../../Config/email.config')

function sendEmail(To, code) {
    //function that sends email of code to user
    const msg = {
        to: To,
        from: process.env.EMAIL,
        subject: 'Authentication',
        text: 'Type in the code:' + code + ", to authenticate"
    }
    sgMail.send(msg).then(() => {
        console.log('Email sent')
    })
        .catch((error) => {
            console.error(error)
        })
}

function sendPaymentReminder(To, Firstname) {
    //function that sends email of code to user
    const msg = {
        to: To,
        from: process.env.EMAIL,
        subject: 'Payment',
        text: "Dear " + Firstname + ", \n you have received your weekly payment."
    }
    sgMail.send(msg).then(() => {
        console.log('Email sent')
    })
        .catch((error) => {
            console.error(error)
        })
}

module.exports = { sendPaymentReminder, sendEmail }