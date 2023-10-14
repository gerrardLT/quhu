import request from '@/utils/request'

// 获取池子
export function pool (data) {
  return request({
    url: '/finance/pool',
    method: 'post',
    data
  })
}

// 获取我的挖矿
export function my_mining (data) {
  return request({
    url: '/finance/my',
    method: 'post',
    data
  })
}

// nft锁定挖矿
export function nft_lock (data) {
  return request({
    url: '/finance/nft_lock',
    method: 'post',
    data
  })
}

// nft挖矿赎回
export function nft_back (data) {
  return request({
    url: '/finance/back',
    method: 'post',
    data
  })
}

// 双币挖矿池子
export function dual_pool (data) {
  return request({
    url: '/finance/dual_pool',
    method: 'post',
    data
  })
}

// 双币挖矿锁定
export function dual_lock (data) {
  return request({
    url: '/finance/dual_lock',
    method: 'post',
    data
  })
}

// 双币挖矿赎回
export function dual_back (data) {
  return request({
    url: '/finance/dual_back',
    method: 'post',
    data
  })
}

// 双币挖矿取消赎回
export function cancel_back (data) {
  return request({
    url: '/finance/cancel_back',
    method: 'post',
    data
  })
}
// 双币挖矿自动续费
export function dual_renew (data) {
  return request({
    url: '/finance/dual_renew',
    method: 'post',
    data
  })
}

// 活期挖矿
export function current_lock (data) {
  return request({
    url: '/finance/current_lock',
    method: 'post',
    data
  })
}

// 获取活期挖矿池子
export function current_pool (data) {
  return request({
    url: '/finance/current_pool',
    method: 'post',
    data
  })
}

// 活期挖矿赎回
export function current_back (data) {
  return request({
    url: '/finance/current_back',
    method: 'post',
    data
  })
}

// 活期挖矿获取收益
export function current_claim (data) {
  return request({
    url: '/finance/current_claim',
    method: 'post',
    data
  })
}