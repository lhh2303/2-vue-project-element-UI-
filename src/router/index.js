import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/rights/Rights.vue'
import Roles from '../components/rights/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
Vue.use(VueRouter)

  const routes = [
    { path : '/' , redirect : '/login'},
    { path : '/login' , component : Login},
    { 
      path : '/home' ,
      component : Home ,
      redirect :'/welcome',
      children :[ 
        { path : '/welcome', component : Welcome},
        { path : '/users' , component :Users},
        { path : '/rights' , component :Rights},
        { path : '/roles' , component :Roles},
        { path : '/categories' , component :Cate},
        { path : '/params' , component :Params},
    ]},
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
