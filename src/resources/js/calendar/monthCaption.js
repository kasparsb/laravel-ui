//import __ from '../translations';

export default {
    full: function(i) {
        return ["January","February","March","April","May","June","July",
            "August","September","October","November","December"][i];
        //return __('months.'+(i+1)+'_full')
    },
    short: function(i) {
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"][i];
        //return __('months.'+(i+1)+'_short')
    }
}