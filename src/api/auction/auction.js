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
// 获取已完成的拍卖
export async function getLaunchdBids (data) {
  return request({
    baseURL: base,
    // url: '/bridge.get_ranked_posts',
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

   //获取地址
   export function get_address (data) {
    return request({
      url: '/auction/get_address',
      method: 'post',
      data
    })
  }



     //登记地址
     export function upload_address (data) {
      return request({
        url: '/auction/address',
        method: 'post',
        data
      })
    }
  
    
     //拍卖发货登记
     export function goods (data) {
      return request({
        url: '/auction/goods',
        method: 'post',
        data
      })
    }
        
     //拍卖发货获取
     export function get_goods (data) {
      return request({
        url: '/auction/get_goods',
        method: 'post',
        data
      })
    }
         //确认收货
         export function confirm (data) {
          return request({
            url: '/auction/confirm',
            method: 'post',
            data
          })
        }