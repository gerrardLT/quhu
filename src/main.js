import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import axios from 'axios'
import Web3 from 'web3'

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 通过axios请求拦截器添加token，保证拥有获取数据的权限
axios.interceptors.request.use(config => {
  // 为请求头对象，添加 Token 验证的 Authorization 字段
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})

// const user = {
//   login_Info: {
//     phone_num: '', //手机号
//     eth_account: '', //eth账号
//     steem_id: '', // steem id
//     invitedId: '', // 邀请人Id
//     integral: 0, // 积分 周期性清空
//     token_num: 0 //token数量
//   },
//   special_column: {
//     auth_info: {}, // 权限设置
//     spread_award_info: {}, //推广奖励信息
//     auction_info: {}, // 拍卖信息
//     article_info: [] // 专栏文章信息
//   },
//   short_essay: {
//     essay_info: [], //文章信息 包括点赞  评论等
//   },
//   advert_auction: {
//     countdown: 0, // 拍卖倒计时
//     prepare_info: '', // 拍卖预告
//     goods: [], // 商品列表
//     status: {} // 当前拍卖状态
//   }
// }

Vue.prototype.Web3 = Web3

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

Vue.use(VueQuillEditor)

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0') // 如果不是两位前面用0填充
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
