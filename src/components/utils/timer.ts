export function secondsToHms(d: number) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? (h < 10 ? "0" + h + ":" : h + ":") : "00:";
    var mDisplay = m > 0 ? (m < 10 ? "0" + m + ":" : m + ":") : "00:";
    var sDisplay = s > 0 ? (s < 10 ? "0" + s : s) : "00";
    return hDisplay + mDisplay + sDisplay; 

}

export function dateToDmy(date: Date) {
    var d = date.getUTCDate();
    var m = date.getUTCMonth();
    var y = date.getUTCFullYear();
    return `${d}.${m}.${y}` 
}

export function getFormatedStringFromDays(days: number) {
    days = +days;
    if(Number.isInteger(+days)){
        var years = Math.floor(days / 365);
        days %= 365;
        var months = Math.floor(days / 30);
        var days = days % 30;
        return {
            year: years,
            month: months,
            day: days
        }
    } 
    return  {
        year: 0,
        month: 0,
        day: 0
    }
  }
