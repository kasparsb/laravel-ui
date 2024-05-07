import stringToDate from './stringToDate';

/**
 * Validējam, lai date būt starp min un max Dates
 * atgriež koriģēto datumu
 */
function clampDate(date, minDate, maxDate) {
    date = stringToDate(date);

    if (minDate && maxDate) {
        minDate = stringToDate(minDate);
        maxDate = stringToDate(maxDate);

        if (date < minDate && date < maxDate) {
            return minDate;
        }
        else if (date > minDate && date > maxDate) {
            return maxDate;
        }
    }
    else if (minDate) {
        minDate = stringToDate(minDate);
        if (date < minDate) {
            return minDate;
        }
    }
    else if (maxDate) {
        maxDate = stringToDate(maxDate);
        if (date > maxDate) {
            return maxDate;
        }
    }

    return date;
}

export default clampDate