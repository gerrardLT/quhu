/*
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-19 23:09:53
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-20 01:39:23
 * @FilePath: \quhu\src\utils\auth.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Cookies from 'js-cookie'

const TokenKey = 'quhu-Token'

export function getToken () {
  return Cookies.get(TokenKey) || ''
}

export function setToken (token) {
  return Cookies.set(TokenKey, token, {
    expires: 365
  })
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
