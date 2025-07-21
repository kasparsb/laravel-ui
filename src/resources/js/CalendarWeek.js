import FieldDate from './FieldDate';


export default {
    init() {
        FieldDate.setNamedListener(
            'calendar-week-data-picker',
            function(date){
                console.log('calendar-week-data-picker');
                console.log(date);
            }
        )
    }
};