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

export function clamp(max: number, min: number, value: number) {
    if (value <= max && value >= min) return value;
    if (value > max) return max;
    if (value < min) return min;
    return value;
}