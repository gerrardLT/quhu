import request from '@/utils/request'
let base = ''
if (process.env.NODE_ENV === 'development') {
  base = '/steem'
} else {
  base = '/api/'
}

//发布新拍卖
export function auction_post (data) {
    return request({
      url: '/auction/post',
      method: 'post',
      data
    })
  }
  
  // 拍卖出价
  export function auction_bid (data) {
    return request({
      url: '/auction/bid',
      method: 'post',
      data
    })
  }
  
    // 拍卖信息
  export function auction_info (data) {
    return request({
      url: '/auction/now',
      method: 'post',
      data
    })
  }

  // 拍卖出价列表
  export function auction_bidlist (data) {
    return request({
      url: '/auction/bidlist',
      method: 'post',
      data
    })
  }

  // 我的拍卖
  export function auction_mybid (data) {
    return request({
      url: '/auction/mybid',
      method: 'post',
      data
    })
  }

  //拍卖详情
  export function get_auction_detail (data) {
    return request({
      baseURL: base,
      method: 'post',
      data
    })
  }
