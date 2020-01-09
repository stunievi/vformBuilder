
import axios from '../utils/axios'

/**
 * 在请求发送数据之前，对发送数据进行转换
 */
axios.interceptors.request.use(function (config) {
  // 在这里实现对请求前的处理
  return config
})

/**
 * 在ajax接收响应数据之前，进行判断是否响应未登录、如果未登录重定向到登录页面
 */
axios.interceptors.response.use(function (res) {
  // 在这里实现响应后的处理
  return res
})
