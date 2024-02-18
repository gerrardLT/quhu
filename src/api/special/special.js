/*
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-28 00:03:56
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-30 11:45:29
 * @FilePath: \quhu\src\api\special\special.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'
let base = ''
if (process.env.NODE_ENV === 'development') {
  base = '/steem'
} else {
  base = '/api/'
}

export function subscriptions (data) {
  return request({
    url: '/subscriptions',
    method: 'post',
    data
  })
}

export function post (data) {
  return request({
    url: '/post',
    method: 'post',
    data
  })
}
// 获取所有文章
export async function getArticles (data) {
  return request({
    baseURL: base,
    // url: '/bridge.get_ranked_posts',
    method: 'post',
    data
  })
}
// 获取文章内容
export async function getArticleDetail (data) {
  return request({
    baseURL: base,
    // url: '/bridge.get_discussion',
    method: 'post',
    data
  })
}

// 加入专栏
export async function addColumn (data) {
  return request({
    url: '/add',
    method: 'post',
    data
  })
}


// 加入专栏(续订)
export async function add2Column (data) {
  return request({
    url: '/add2',
    method: 'post',
    data
  })
}

// 退出专栏
export async function removeColumn (data) {
  return request({
    url: '/remove',
    method: 'post',
    data
  })
}

// 搜索专栏
export async function searchColumn (data) {
  return request({
    url: '/search',
    method: 'post',
    data
  })
}


// 点赞
export async function vote (data) {
  return request({
    url: '/vote',
    method: 'post',
    data
  })
}

//快捷点赞
export async function vote2 (data) {
  return request({
    url: '/vote2',
    method: 'post',
    data
  })
}

// 查询点赞数
export async function getVote (data) {
  return request({
    url: '/getvote',
    method: 'post',
    data
  })
}


// 查询热门专栏
export async function hotColumn (data) {
  return request({
    url: '/hot',
    method: 'get',
    data
  })
}


// 文章置顶
export async function goTop (data) {
  return request({
    url: '/subscriptions/top',
    method: 'post',
    data
  })
}

// 收藏
export async function collect (data) {
  return request({
    url: '/favorites',
    method: 'post',
    data
  })
}

// 获取收藏
export async function getfavorites (data) {
  return request({
    url: '/getfavorites',
    method: 'post',
    data
  })
}

// 移除收藏
export async function removeCollect (data) {
  return request({
    url: '/removefavorites',
    method: 'post',
    data
  })
}

// 移动文章分类
export async function move (data) {
  return request({
    url: '/subscriptions/move',
    method: 'post',
    data
  })
}

// 邀请进圈
export async function invite (data) {
  return request({
    url: '/invitedcode',
    method: 'post',
    data
  })
}
