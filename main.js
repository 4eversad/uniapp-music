import App from './App'
import dayjs from 'dayjs'
import store from './store/index.js'
import musicHead from './components/musichead/musichead'
// 骨架屏
import mForSkeleton from './components/m-for-skeleton/m-for-skeleton'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
Vue.filter("formatCount", (value) => {
	if(value >= 10000 && value <= 100000000) {
		value /= 10000
		return value.toFixed(1) + '万'
	}
	else if (value > 100000000) {
		value /= 100000000;
		return value.toFixed(1) + '亿'
	}
	else {
		return value
	}
})
Vue.filter('timeFormat', (time) => {
	 
	let now = new Date(parseInt(time)),
	y = now.getFullYear(),
	m = now.getMonth() + 1,
	d = now.getDate();
	return y + '年' + (m < 10 ? '0' + m : m) + '月' + (d < 10 ? '0' + d : d) + '日'
	            
})
Vue.component('music-head', musicHead)
Vue.component('mForSkeleton', mForSkeleton)
const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif
console.log(app);

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif