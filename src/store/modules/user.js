/*
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-20 01:31:36
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-25 12:44:01
 * @FilePath: \quhu\src\store\modules\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { getToken, setToken, removeToken } from '@/utils/auth'
const state = {
  userInfo: {
    token: getToken(),
    nickName: '',
    avatar: ''
  }
}

const mutations = {

}
const getters = {}
const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
