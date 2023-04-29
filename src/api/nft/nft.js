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

