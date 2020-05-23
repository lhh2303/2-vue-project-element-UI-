import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 全局样式表
import './assets/css/global.css'
Vue.use(ElementUI);
// axious
import axios from 'axios'
Vue.prototype.$http = axios
// 请求根路径
axios.defaults.baseURL ='https://www.liulongbin.top:8888/api/private/v1/'

// 拦截器
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
