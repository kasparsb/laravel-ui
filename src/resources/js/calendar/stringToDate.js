function stringToDate(dateString) {

    if (dateString instanceof Date) {
        return new Date(dateString.getTime());
    }

    // Sadalam pa datumu un laiku
    var dp = dateString.split(' ');

    // gads, mēnesis, diena
    var date = dp[0].split('-');
    // stundas, minūtes, sekundes
    var time = [0, 0, 0];
    if (dp.length > 1) {
        time = dp[1].split(':');
    }

    if ((date.length != 3) || (time.length != 3)) {
        return new Date();
    }

    return new Date(date[0], date[1]-1, date[2], time[0], time[1], time[2]);
}

export default stringToDate