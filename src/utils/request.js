/*
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-15 01:58:41
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-30 11:03:32
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
const md5 = require('@/utils/md5.js')

console.log(md5('abcdef'))
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

// 请求拦截器
service.interceptors.request.use((config) => {
  const token = getToken()
  const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))

  if (config.url === '/register') {
    config.headers['QUHU-AUTH-TOKEN'] = md5(config.data.user || '')
  } else if (config.url === '/login') {
    config.headers['QUHU-AUTH-TOKEN'] = md5(config.data[0] || '')
  } else {
    if (userInfo) {
      const authId = userInfo.eth_account === 'none' ? userInfo.user : userInfo.eth_account
      config.headers['QUHU-AUTH-TOKEN'] = md5(authId)
    }
  }

  // loading = Loading.service({
  //   text: '加载中...',
  //   spinner: 'el-icon-loading ElementLoading',
  //   background: 'rgba(0, 0, 0, 0.2)'
  // })
  return config
},
  (error) => {
    return Promise.reject(error)
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
    if (res.error_code === -1) { // 默认-1  只有为-1时才做轻提示
      Message({
        message: res.error,
        type: 'warning',
        duration: 5 * 1000
      })
    }
    if (res.error_code === 500) { // 默认-1  只有为-1时才做轻提示
      const message = '服务端错误'
      Message({
        message,
        type: 'warning',
        duration: 5 * 1000
      })
    }
    return Promise.reject(res).catch(() => { })
  }
},
  (error) => {
    if (loading) {
      loading.close()
    }
    if (!error.response) {
      if (error.message.includes('timeout')) {
        Message({
          message: '请求超时',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: error.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
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
    return Promise.reject()
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
