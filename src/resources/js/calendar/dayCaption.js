//import __ from '../translations';

export default {
    full: function(i) {
        daysInWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i+1];
        //return __('week-days.'+(i+1)+'_full')
    },
    short: function(i) {
        daysInWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i+1];
        //return __('week-days.'+(i+1)+'_short')
    }
}