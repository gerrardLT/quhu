/*
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-12 14:01:22
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-10-12 13:13:11
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
import MyAuction from '../views/auction/MyAuction.vue'
import Publish from '../views/auction/Publish.vue'
import AuctionDetail from '../views/auction/Detail.vue'
import Nft from '../views/nft/Nft.vue'
import Inventory from '../views/nft/Inventory.vue'
import Animation from '../views/nft/animation.vue'
import Treasure from '../views/nft/treasure.vue'
import ColumnDetail from '../views/home/ColumnDetail.vue'
import Write from '../views/home/Write.vue'
import Activation from '../views/my/Activation.vue'
import Setting from '../views/my/Setting.vue'
import Voucher from '../views/my/Voucher.vue'
import Recharge from '../views/my/Recharge.vue'
import Interact from '../views/my/Interact.vue'
import Search from '../views/my/Search.vue'
import Upgrade from '../views/my/Upgrade.vue'
import Invite from '../views/my/Invite.vue'
import MySpecial from '../views/my/MySpecial.vue'
import Benifit from '../views/my/Benifit.vue'
import Introduce from '../views/my/Introduce.vue'
import Information from '../views/home/Information.vue'
import OfficialBanner from '../views/home/OfficialBanner.vue'
import Mining from '../views/mining/Mining.vue'
import Except from '../views/except/except.vue'
import Raffle from '../views/raffle.vue'
import Bridge from '../views/chain_bridge/bridge.vue'
import { getToken } from '@/utils/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
    meta: { showSwitch: true }
  },
  {
    path: '/login',
    component: Login,
    meta: { showSwitch: true }
  },
  {
    path: '/except',
    component: Except,
    meta: { showSwitch: true }
  },
  {
    path: '/raffle',
    component: Raffle,
    meta: { showSwitch: true }
  },
  {
    path: '/home',
    component: Home,
    meta: { isTabPage: true,showSwitch: true },
    children: [
      {
        name: 'write', path: '/write', component: Write,
        meta: { isTabPage: true,showSwitch: true }
      }
    ]
  },
  
  {
    path: '/article',
    component: Article,
    meta: { isTabPage: true,showSwitch: true }
  },
  {
    path: '/bridge',
    component: Bridge,
    meta: { isTabPage: false,showSwitch: false }
  },
  {
    path: '/information',
    component: Information,
    meta: { isTabPage: true,showSwitch: true }
  },
  {
    path: '/official_banner',
    component: OfficialBanner,
    meta: { isTabPage: true,showSwitch: true }
  },
  
  {
    path: '/animation',
    component: Animation,
    meta: { isTabPage: true,showSwitch: true }
  },
  {
    path: '/treasure',
    component: Treasure,
    meta: { isTabPage: false,showSwitch: true }
  },
  
  {
    path: '/nft',
    component: Nft,
    meta: { isTabPage: true,showSwitch: true },
    children: [
      {
        name: 'inventory', path: '/inventory', component: Inventory,
        meta: { isTabPage: true,showSwitch: true }
      }
    ]
  },
  {
    path: '/mining',
    component: Mining,
    meta: { isTabPage: true,showSwitch: true }
  },
  {
    path: '/auction',
    component: Auction,
    meta: { isTabPage: true,showSwitch: true },
    children: [
      {
        name: 'myauction', path: '/myauction', component: MyAuction,
        meta: { isTabPage: true,showSwitch: true }
      },
      {
        name: 'auctiondetail', path: '/auctiondetail', component: AuctionDetail,
        meta: { isTabPage: true,showSwitch: true }
      },
      {
        name: 'Publish', path: '/publish', component: Publish,
        meta: { isTabPage: true,showSwitch: true }
      }
    ]
  },
  {
    name: 'my',
    path: '/my',
    component: My,
    meta: { isTabPage: true,showSwitch: true },
    children: [
      {
        name: 'activation', path: '/activation', component: Activation,
        meta: { isTabPage: true,showSwitch: true }
      },
      {
        name: 'setting', path: '/setting', component: Setting,
        meta: { isTabPage: true,showSwitch: true }
      },
      {
        name: 'voucher', path: '/voucher', component: Voucher,
        meta: { isTabPage: true,showSwitch: true }
      },
      {
        name: 'invite', path: '/invite', component: Invite,
        meta: { isTabPage: true,showSwitch: true }
      },
      {
        name: 'interact', path: '/interact', component: Interact,
        meta: { isTabPage: true,showSwitch: true }
      },
      {
        name: 'upgrade', path: '/upgrade', component: Upgrade,
        meta: { isTabPage: true,showSwitch: true }
      },
      {
        name: 'introduce', path: '/introduce', component: Introduce,
        meta: { isTabPage: true,showSwitch: true }
      },
      {
        name: 'benifit', path: '/benifit', component: Benifit,
        meta: { isTabPage: true,showSwitch: true }
      },
      {
        name: 'recharge', path: '/recharge', component: Recharge,
        meta: { isTabPage: true,showSwitch: true }
      },
      {
        name: 'search', path: '/search', component: Search,
        meta: { isTabPage: true,showSwitch: true }
      }
    ]
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
  mode: 'history',
  routes
})

window._axiosPromiseArr = []
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数， 表示放行   ①next()放行   ②next('/login')强制跳转
  if (to.path === '/login') return next() // 访问登录页，直接放行
  if (to.path === '/login' && from.path === '/setting') {
    Vue.prototype.$isTabPage = false
  }

  // console.log(window._axiosPromiseArr)
  window._axiosPromiseArr.forEach((ele, index) => {
    ele.cancel()
    delete window._axiosPromiseArr[index]
  })

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
