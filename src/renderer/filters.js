import Vue from 'vue'

import {timeDisplay} from '../libraries/unitConverter'

timeDisplay()
Vue.filter('timeDisplay', timeDisplay)
export { timeDisplay }
