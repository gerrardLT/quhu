import request from '@/utils/request'

// 获取所有token
export function getChainTokens (data) {
  return request({
    url: '/getChainTokens',
    method: 'post',
    data
  })
}

// 记录查询
export async function getBridgeHistory (data) {
  return request({
    url: '/getbridgehistory',
    method: 'post',
    data
  })
}

// 获取充值地址
export async function getAddress (data) {
  return request({
    url: '/get_address',
    method: 'post',
    data
  })
}