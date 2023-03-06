/*
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-12 14:01:22
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-29 03:46:49
 * @FilePath: \quhu\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './utils/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
import '@/assets/index'
// 导入全局样式表
import './assets/css/global.css'
import store from './store'
import axios from 'axios'
import Web3 from 'web3'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入quill-editor编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import quillEmoji from 'quill-emoji'
import 'quill-emoji/dist/quill-emoji.css'
import * as Quill from 'quill'
import ImageResize from 'quill-image-resize-module'
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'


// 实现quill-editor编辑器拖拽上传图片
Vue.use(VueQuillEditor)

// 实现quill-editor编辑器调整图片尺寸

Quill.register('modules/imageResize', ImageResize)
Quill.register('modules/quillEmoji', quillEmoji)
Vue.use(ElementUI)
Vue.use(preview)

Vue.prototype.Web3 = Web3

Vue.prototype.$http = axios

Vue.prototype.$store = store

Vue.config.productionTip = false

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

// new Vue({
//   el: '#app',
//   router,
//   store, // 把store对象添加到vue实例上
//   components: { App },
//   template: '<App/>',
// });
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
