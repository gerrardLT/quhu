/*
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-15 01:58:41
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-10-14 09:26:29
 * @FilePath: \quhu\src\utils\request.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/* eslint-disable */
import axios from 'axios'
import baseUrl from '@/config/baseUrl'
// import Message from '@/utils/message'
import { MessageBox, Loading, Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import store from '@/store'
import i18n from '@/language'
const md5 = require('@/utils/md5.js')

// console.log(md5('abcdef'))
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: baseUrl.api,
  // 超时
  timeout: 60000 * 10,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
    'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
    'Content-Type': 'application/json'
  }
})

let loading // 加载动画
let hasPermission = false // 当401时会弹层提示 此字段用来防止二次弹层
// const indexPath = process.env.NODE_ENV === 'production' ? window.globalVar.indexPath : '/'
const CancelToken = axios.CancelToken; 
const source = CancelToken.source();  
// 请求拦截器
service.interceptors.request.use((config) => {
  const token = getToken()
  const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))

  if (config.url === '/register') {
    config.headers['QUHU-AUTH-TOKEN'] = md5(config.data.user || '')
  } else if (config.url === '/login') {
    console.log(config.data.data[0])
    console.log(md5(config.data.data[0]))
    config.headers['QUHU-AUTH-TOKEN'] = md5(config.data.data[0] || '')
  } else if (config.url === '/user') {
    config.headers['QUHU-AUTH-TOKEN'] = md5(config.data.id || '')
  } else {
    if (userInfo) {
      const authId = localStorage.getItem('login-type') === 'eth' ? userInfo.eth_account:userInfo.user
      config.headers['QUHU-AUTH-TOKEN'] = md5(authId)
    }
  }
  config.cancelToken = new axios.CancelToken(cancel => {
    window._axiosPromiseArr.push({ cancel })
  })

  return config
},
  (error) => {
    return Promise.reject(error).catch(() => { })
  })

// 响应拦截器
service.interceptors.response.use((response) => {
  if (loading) {
    loading.close()
  }
  const res = response.data
  if (res.success && res.success === 'ok' || res.jsonrpc) {
    return res
  } else {
    const errorCodeMap = {
      500: 'unknown_error',
      1001: 'token_expired',
      1002: 'error_token',
      1003: 'Cancel_Collection_Successfully',
      1004: 'not_favorites',
      1005: 'no_permissions',
      1006: 'error_Address',
      1007: 'error_obtaining_nft_information',
      1008: 'nft_unlock',
      1009: 'nFT_locked',
      1010: 'balance_not_enough',
      1011: 'confirmed_receipt',
      1012: 'error_in_obtaining_auction_information',
      1013: 'the_auction_hasnot_started_yet',
      1014: 'Ended',
      1015: 'Not_modifiable',
      1016: 'No_one_won',
      1017: 'lose_a_bid',
      1018: 'Miss_subscriptions_name',
      1019: 'Below_the_minimum_price',
      1020: 'Has_been_opened',
      1021: 'sixteen_NFTs_required',
      1022: 'eighteen_NFTs_required',
      1023: 'cast_tips',
      1024: 'Requires_points',
      1025: 'fragments_required',
      1026: 'error_nonce',
      1027: 'error_signature',
      1028: 'NFT_Permission_check_error',
      1029: 'Card_error_type1',
      1030: 'Card_error_type2',
      1031: 'Card_error_type3',
      1032: 'Canceled',
      1033: 'Below_minimum',
      1034: 'Name_Repeated',
      1035: 'Illegal_character',
      1036: 'tags_error',
      1037: 'No_permission',
      1038: 'Over_words',
      1039: 'Duplicate_Content',
      1040: 'Duplicate_vote',
      1041: 'No_Exit',
      1042: 'month',
      1043: 'error_invitedcode',
      1044: 'subscriptions_free',
      1045: 'user_exists',
      1046: 'error_data',
      1047: 'no_data',
      1048: 'error_price',
      1049: 'already_exists',
      1050: 'error_username',
      1051: 'no_user',
      1052: 'Existing',
      1053: 'user_has_been_registered',
      1054: 'error_password',
      1055: 'error_ip',
      1056: 'ip_limit',
      1057:'hash_not_exist',
      1058:'transaction_check_failed',
      1059:'transaction_failed',
      1060:'error_method',
      1061:'nft_id_error',
      1062:'card_error',
      1063:'coupon_error',
      1064:'already_claim',
      1065:'coupon_expire'
    };

if(res.code === 1000){

}else{
  Message({
    message: i18n.t('server.'+errorCodeMap[res.code]),
    type: 'warning',
    duration: 5 * 1000
  })
        if(res.error ==='Token expired'){
        setTimeout(() => {
          store.dispatch('loginOutFalse')
        }, 1000);
      }
}
    return Promise.reject(res).catch(() => { })
  }
},
  (error) => {
    if (!error.response) {
  
      // if (error.message && error.message.includes('timeout')) {
      //   Message({
      //     message: '请求超时',
      //     type: 'error',
      //     duration: 5 * 1000
      //   })
      // } else {
      //   Message({
      //     message: error.message,
      //     type: 'error',
      //     duration: 5 * 1000
      //   })
      // }
    } else {
      const status = error.response.status
      if (status === 401) {
        if (!hasPermission) {
          setTimeout(() => {
            const currentPath = location.hash.match(/(\w+)\/?/)
            const isLoadingPath = currentPath && currentPath[0] === 'login'
            if (!isLoadingPath) {
              hasPermission = true
              MessageBox.confirm('系统已注销，可以取消以停留在此页面，或重新登录', '确认注销', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                // userStore.fedLogOut()
                location.reload()
              }).catch(() => hasPermission = false)
            } else {
              Message({
                message: '系统已注销，请重新登录',
                type: 'warning',
                duration: 3 * 1000
              })
            }
          }, 300)
        }
      } else if (status === 404) {
        Message({
          message: '访问资源未找到',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: '服务端错误',
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
    return Promise.reject().catch(() => { })
  }
)

service.get = (url, params, headers = {}) => {
  return service({
    url,
    method: 'get',
    params,
    headers
  })
}

service.put = (url, data) => {
  return service({
    url,
    method: 'put',
    data
  })
}

service.post = (url, data) => {
  return service({
    url,
    method: 'post',
    data
  })
}

service.delete = (url, params) => {
  return service({
    url,
    method: 'delete',
    params
  })
}

export default service
