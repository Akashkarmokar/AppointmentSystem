import Vue from 'vue';
import moment from 'moment'

Vue.filter('toDate',(value)=>{
    // console.log('toDa: ',value);
    return moment(value,'HH:mm').format('DD-MM-YYYY');
});
Vue.filter('toDateMod',(value)=>{
    console.log('toDaMod : ',value);
    return moment(value,'ddd MMM DD YYYY').format('DD-MM-YYYY');
});
Vue.filter('toTime',(value)=>{
    return moment(value,'HH:mm').format("HH:mm")
});

Vue.filter('HourFormate',(value)=>{
    // console.log('hF:',value);
    return moment(value,'HH:mm').format('hh:mm a');
});

Vue.filter('dddMMMDDYYYY',(value)=>{
    return moment(value,'ddd MMM DD YYYY').format('DD-MM-YYYY')
})