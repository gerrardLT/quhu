/*
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-15 13:49:44
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-25 00:07:53
 * @FilePath: \quhu\src\api\store\login.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function register (data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}
