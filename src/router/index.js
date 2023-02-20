/*
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-12 14:01:22
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-30 10:15:53
 * @FilePath: \quhu\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/home/Home.vue'
import My from '../views/my/My.vue'
import Article from '../views/article/Article.vue'
import Auction from '../views/auction/Auction.vue'
import ColumnDetail from '../views/home/ColumnDetail.vue'
import Activation from '../views/my/Activation.vue'
import Setting from '../views/my/Setting.vue'
import Voucher from '../views/my/Voucher.vue'
import Interact from '../views/my/Interact.vue'
import History from '../views/my/History.vue'
import Collect from '../views/my/Collect.vue'
import About from '../views/my/About.vue'
import Invite from '../views/my/Invite.vue'
import ChangePwd from '../views/my/ChangePwd.vue'
import MySpecial from '../views/my/MySpecial.vue'
import { getToken } from '@/utils/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    meta: { isTabPage: true }
  },
  {
    path: '/article',
    component: Article,
    meta: { isTabPage: true }
  },
  {
    path: '/auction',
    component: Auction,
    meta: { isTabPage: true }
  },
  {
    path: '/my',
    component: My,
    meta: { isTabPage: true }
  },
  {
    path: '/activation',
    component: Activation
  },
  {
    path: '/setting',
    component: Setting
  },
  {
    path: '/voucher',
    component: Voucher
  },
  {
    path: '/invite',
    component: Invite
  },
  {
    path: '/interact',
    component: Interact
  },
  {
    path: '/history',
    component: History
  },
  {
    path: '/collect',
    component: Collect
  },
  {
    path: '/about',
    component: About
  },
  {
    path: '/changePwd',
    component: ChangePwd
  },
  {
    path: '/MySpecial',
    component: MySpecial
  },
  {
    path: '/columnDetail',
    component: ColumnDetail
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数， 表示放行   ①next()放行   ②next('/login')强制跳转
  if (to.path === '/login') return next() // 访问登录页，直接放行
  if (to.path === '/login' && from.path === '/changePwd') {
    Vue.prototype.$isTabPage = false
  }
  // 获取token
  const tokenStr = getToken()
  const tabPageList = ['/home', '/special', '/article', '/my', '/auction']
  if (tabPageList.indexOf(to.path) !== '-1') {
    Vue.prototype.$isTabPage = true
  } else {
    Vue.prototype.$isTabPage = false
  }
  if (!tokenStr) return next('/login') // 没有token 强制跳转
  next() // 否则直接放行
})

export default router
