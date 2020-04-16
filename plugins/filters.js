import Vue from 'vue'
import moment from 'moment'

Vue.filter('dateformat', (date, fmt) => {
    return moment(date).format(fmt)
})