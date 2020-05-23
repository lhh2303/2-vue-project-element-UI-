import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
Vue.use(VueRouter)

  const routes = [
    { path : '/' , redirect : '/login'},
    { path : '/login' , component : Login},
    { path : '/home' , component : Home},
]

const router = new VueRouter({
  routes
})

// 挂在路由导航守卫 
/* 
  根据有无token做判断 
*/
router.beforeEach((to, from, next) =>{
  if(to.path ==='/login') return next()
  // 获取token
  const tokestr =window.sessionStorage.getItem('token')
  if(!tokestr) return next('/login')
  next()
})
export default router
