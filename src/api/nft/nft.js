import request from '@/utils/request'

// mint
export function mint (data) {
  return request({
    url: '/nft/mint',
    method: 'post',
    data
  })
}

//  获取nft
export function get_nft (data) {
    return request({
      url: '/nft/get_nft',
      method: 'post',
      data
    })
  }

//测试接口
export function get_card (data) {
  return request({
    url: '/get_card',
    method: 'post',
    data
  })
}
//高级合成
  
export function advanced_fusion (data) {
  return request({
    url: '/nft/advanced_fusion',
    method: 'post',
    data
  })
}
  
//合成
export function fusion (data) {
  return request({
    url: '/nft/fusion',
    method: 'post',
    data
  })
}
  
//开箱
export function open (data) {
  return request({
    url: '/nft/open',
    method: 'post',
    data
  })
}

//碎片合成
export function debris (data) {
  return request({
    url: '/nft/debris',
    method: 'post',
    data
  })
}
