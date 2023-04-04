/*
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-15 22:54:39
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-27 11:55:10
 * @FilePath: \quhu\src\api\user\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

export async function getUser (data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

export async function changePwd (data) {
  return request({
    url: '/password',
    method: 'post',
    data
  })
}

export async function changeUser (data) {
  return request({
    url: '/userdata',
    method: 'post',
    data
  })
}

export async function changeAvatar (data) {
  return request({
    url: '/avatar',
    method: 'post',
    data
  })
}

export async function getAvatars (data) {
  return request({
    url: '/getavatar',
    method: 'post',
    data
  })
}

export async function bindEth (data) {
  return request({
    url: '/eth',
    method: 'post',
    data
  })
}

// 基础资料修改
export async function baseData (data) {
  return request({
    url: '/basedata',
    method: 'post',
    data
  })
}

// 用户轨迹
export async function trail (data) {
  return request({
    url: '/trail',
    method: 'post',
    data
  })
}


// 交易记录
export async function transactions (data) {
  return request({
    url: '/transactions',
    method: 'post',
    data
  })
}
