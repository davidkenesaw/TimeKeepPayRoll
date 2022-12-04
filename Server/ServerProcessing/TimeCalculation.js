
function getYear(){
    //gets the year and formats it
    let currentDate = new Date();
    let cDay = currentDate.getDate();
    let cMonth = currentDate.getMonth() + 1;
    let cYear = currentDate.getFullYear();
    
    const value = cMonth+ "/" + cDay + "/" + cYear
    return value;
}
function Day(){
    //returns string value for days in a week
    let date = new Date();
    let dayOfWeekNumber = date.getDay();
    let nameOfDay;

    switch(dayOfWeekNumber){
        case 0: 
            nameOfDay = 'Sunday';
            break;
        case 1:
            nameOfDay = 'Monday';
            break;
        case 2:
            nameOfDay = 'Tuesday';
            break;
        case 3:
            nameOfDay = 'Wednesday';
            break;
        case 4:
            nameOfDay = 'Thursday';
            break;
        case 5:
            nameOfDay = 'Friday';
            break;
        case 6:
            nameOfDay = 'Saturday';
            break;

    }   
    return nameOfDay;
}
function getTime(){
    //gets the current time
    let currentDate = new Date();
    let time;
    let minute = currentDate.getMinutes()
    
    if(currentDate.getHours() > 12){
        time = (currentDate.getHours()-12) + ":" + minute + " PM";
    }else{
        var hour = currentDate.getHours()
        if(parseInt(hour) <= 0)hour = "12";
        time = (hour) + ":" + minute + " AM";
    }
    return formatTime(time); 
}
function formatTime(value){
    //formats the time the way the website wants it
    var myArray1= value.split(" ");
    var myArray2 = myArray1[0].split(":");
    let minute = myArray2[1];
    let pmAm = myArray1[1]
    let hour = parseInt(myArray2[0]);
    if(hour < 10){
        hour = "0" + hour
    }
    if(minute < 10){
        minute = "0" + minute
    }
    return(hour + ":" + minute + " " + pmAm)
}
function convertTimeTo(value){
    if(value == "0:00"){
        return value;
    }
    var myArray1= value.split(" ");
    var myArray2 = myArray1[0].split(":");
    let minute = myArray2[1];
    let pmAm = myArray1[1]
    let hour = parseInt(myArray2[0]);
    if(hour == 12){
        hour = 0;
    }
    if(pmAm == "PM"){
        
        hour += 12
    }
    
    let hour1 = hour.toString();
    let minute1 = minute.toString();
    if(hour1.length == 1){
        hour1 = "0" + hour1
    }
    if(minute1.length == 1){
        minute1 = "0" + minute1
    }
    return(hour1 + ":" + minute1)
}
function convertTimeBack(value){
    
    if(value == ""){
        return "0:00";
    }
    var myArray1= value.split(":");
    let minute = myArray1[1];
    let hour = parseInt(myArray1[0]);
    let amPm = ""
    
    if(hour == 12){
        amPm = "PM"
    }
    else if(hour > 12){
        amPm = "PM"
        hour -= 12
    }else{
        amPm = "AM"
    }
    if(hour == 0){
        hour = 12;
    }
    let hour1 = ""+hour;
    let minute1 = ""+ minute;
    if(hour1.length == 1){
        hour1 = "0" + hour1
    }
    if(minute1.length == 1){
        minute1 = "0" + minute1
    }
    return(hour1 + ":" + minute1 + " " + amPm)
}
function GetWeek(startDate, daysToAdd) {
    //gets week value
    var aryDates = [];

    for (var i = 0; i <= daysToAdd; i++) {
        var currentDate = new Date();
        currentDate.setDate(startDate.getDate() + i);
        aryDates.push({
            date: (currentDate.getMonth()+1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear(),
            day: DayAsString(currentDate.getDay())
        });
    }//cMonth+ "/" + cDay + "/" + cYear

    return aryDates;
}

function DayAsString(dayIndex) {
    //returns the days as a string value
    var weekdays = new Array(7);
    weekdays[0] = "Sunday";
    weekdays[1] = "Monday";
    weekdays[2] = "Tuesday";
    weekdays[3] = "Wednesday";
    weekdays[4] = "Thursday";
    weekdays[5] = "Friday";
    weekdays[6] = "Saturday";

    return weekdays[dayIndex];
}



module.exports = {getYear,convertTimeBack, getTime,Day,convertTimeTo, GetWeek, DayAsString}