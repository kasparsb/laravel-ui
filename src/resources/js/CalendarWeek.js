export default {
    init() {
        window.webit.ui.FieldDate.setNamedListener(
            'calendar-week-data-picker',
            function(date){
                console.log('calendar-week-data-picker');
                console.log(date);
            }
        )
    }
};