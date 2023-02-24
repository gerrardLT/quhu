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
import home from './modules/home'
import { getUser, changeUser } from '@/api/user/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

Vue.use(Vuex)
// {
//   user,
//   user_name,
//   email,
//   eth_account,
//   steem_id,
//   invitedId,
//   integral,
//   token_num,
//   lock_token,
//   auth_info,
//   spread_award_info,
//   auction_info,
//   buy_article,
//   essay_info,
//   countdown,
//   prepare_info,
//   goods,
//   status,
//   phone,
//   avatar,
//   activation
// }
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
        router.push({
            path: '/home'
            // query: {
            //   user: encodeURIComponent(user)
            // }
          })
      }
    },
    async updateUser ({
      commit,
      state
    }, d) {
      console.log(d)
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      const loginType = localStorage.getItem('login-type')
      const changeInfo = d.type === 'user' ? { user: d.user } : { user_name: d.user_name }
      const params = loginType === 'eth' ? {
        id: userInfo.eth_account,
        token: getToken(),
        sign: d.sign,
        data: changeInfo
      } : {
        id: userInfo.user,
        token: getToken(),
        password: d.password,
        data: changeInfo
      }
      const res = await changeUser(params)
      if (res && res.success === 'ok') {
        commit('UPDATE_USERINFO', changeInfo)
      }
    },
    loginOutFalse () {
      localStorage.removeItem('quhu-userInfo')
      localStorage.removeItem('login-type')
      removeToken('quhu-Token')
      router.push('/login')
    },
    loginOutTrue () {
      // 暂时不写
    }
  }
})

export default store
