export function getRemainingTime(startDateString, endDateString){
    let startDate = new Date(startDateString);
    let endDate = new Date(endDateString);

    let differenceInMilliSeconds = (endDate - startDate) / 1000;

    const days = Math.floor(differenceInMilliSeconds / 86400);
    differenceInMilliSeconds -= days*86400;
    
    const hours = Math.floor(differenceInMilliSeconds / 3600) % 24;
    differenceInMilliSeconds -= hours*3600;

    const minutes = Math.floor(differenceInMilliSeconds / 60) % 60;
    differenceInMilliSeconds -= minutes*60;

    const seconds = Math.floor(differenceInMilliSeconds % 60);
    differenceInMilliSeconds -= seconds*60;

    let difference = '';
    if(days > 0){
        difference += (days == 1) ? `${days} day :` : `${days} days :`;
    }
    difference += ` ${hours} hr : ${minutes} min : ${seconds} sec`;
    return difference;
}