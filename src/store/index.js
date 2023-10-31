/*
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-15 03:07:58
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-30 05:44:47
 * @FilePath: \quhu\src\store\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import user from './modules/user'
import MD5 from 'MD5'
import {Message} from 'element-ui'
import { getUser, changeUser } from '@/api/user/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { Loading } from 'element-ui'
import i18n from '@/language'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: {

    }
  },
  mutations: {
    UPDATE_USERINFO (state, data) {
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      state.userInfo = Object.assign({}, userInfo, data)
      localStorage.setItem('quhu-userInfo', JSON.stringify(state.userInfo))
      Message.success(i18n.t('message.change_success'))
    },
    SET_USERINFO (state, data) {
      const userInfo = Object.assign(state.userInfo, data)
      state.userInfo = Object.assign({}, userInfo)
      state.hasLogin = Object.keys(store.userInfo).length !== 0
      // console.log('store.userInfo', store.userInfo);
      localStorage.setItem('quhu-userInfo', state.userInfo)
      return data
    }
  },
  actions: {
    async getUserInfo ({
      commit,
      state
    }, { id, token }) {
      const res = await getUser({ id, token })
      if (res) {
        state.userInfo = Object.assign({}, res.data)
        localStorage.setItem('quhu-userInfo', JSON.stringify(state.userInfo))
        console.log(router.currentRoute.query)
        if(router.currentRoute.query.inviteCode){
          router.push({
            path: '/columnDetail',
            query: router.currentRoute.query
          })
        }else {
          router.push({
            path: '/home',
            query: {
              user: encodeURIComponent(user),
            }
          })
        }

      }
    },
    async updateUser ({
      commit,
      state
    }, d) {

      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      const loginType = localStorage.getItem('login-type')
      const changeInfo = { user: d.user,user_name: d.user_name }
      const params = loginType === 'eth' ? {
        id: userInfo.eth_account,
        token: getToken(),
        password: MD5(d.password),
        sign: d.sign,
        data: changeInfo
      } : {
        id: userInfo.user,
        token: getToken(),
        password: MD5(d.password),
        data: changeInfo
      }
      const loading = Loading.service({
        text: i18n.t('message.loading'),
        spinner: 'el-icon-loading ElementLoading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      const res = await changeUser(params)
      if (res && res.success === 'ok') {
        commit('UPDATE_USERINFO', changeInfo)
      }
      if (loading) {
        loading.close()
      }
    },
    loginOutFalse () {
      localStorage.clear()
      sessionStorage.clear()
      removeToken('quhu-Token')
      router.push('/login')
    },
    loginOutTrue () {
      // 暂时不写
    }
  }
})

export default store
