/**
 *  ajax请求模块, 底层调用axios发送请求，做了响应数据的适配，并支持 url path 传参
 *  @module utils/ajax
 *  @author 陈华春  <chenhuachun@xdh.net.cn>
 *
 */

import pathToRegex from 'path-to-regexp'
import axios from './axios'
import {getHost} from './url'
import {get, save, LOCAL, SESSION} from './storage'
import bus from './bus'
import {guid} from './util'
import * as config from '../config'


/**
 * 与后端约定好ajax请求成功时响应json对象code的值。 默认值可在 /src/config.js 中配置
 * @const
 * @type {number}
 * @default 0
 */
const AJAX_SUCCESS = config.AJAX_SUCCESS || 200

// 编译过的url缓存
let pathToRegexCaches = {}

// 内存缓存数据保存处
let Caches = {}

/**
 * ajax 请求的默认参数
 * @const
 * @type {{url: null, method: string, params: null, data: null}}
 * @property {string} url  - 请求地址, 必要参数
 * @property {string} method - 请求方法类型，默认：get
 * @property {object} params - path参数，如: /api/user/:id, 不是url查询参数, 默认：null
 * @property {object} data - 请求发送数据，get head delete请求是查询参数，其他类型是post数据, 默认：null, 支持 Object/URLSearchParams/FormData
 * @property {Object|boolean} cache 缓存配置
 * @property {boolean} socket 是否启用webSocket通知
 */
const defaultConfig = {
  url: null,
  method: 'get',
  params: null, // 这里不是查询参数，是path参数，如: /api/user/:id
  data: null, // get head delete请求是查询参数，其他类型是post数据
  cache: null, // boolean/Object, Object: {local, session, key} local:数据是否保存到localStorage，session:数据是否保存到SessionStorage key：缓存的key，默认取url+query
  socket: false // boolean, 是否使用 websocket通知请求结果
}

/**
 * 处理响应的数据
 * @param {Object} res 响应原始数据
 * @param {object} cache 缓存配置
 * @param {object} storage 缓存存储位置
 * @param {function} resolve
 * @param {function} reject
 */
function processData(res, cache, storage, resolve, reject) {
  if (res.data.state) {
    if (res.status === AJAX_SUCCESS) {
      (cache && cache.key) && saveCache(cache.key, res.data.data, storage)
      resolve(res.data.data)
    } else {
      reject(res.data)
    }
  }
}

/**
 *
 * 构建通用适配处理ajax返回数据Promise，判断ajax响应的json对象code属性，如果与 [AJAX_SUCCESS]{@link module:utils/ajax~AJAX_SUCCESS}  的值不一致即 reject
 * @inner
 * @param {string} type 请求方法类型
 * @param {string} url 请求url
 * @param {Object} data 请求发送数据
 * @param {Object} config axios配置选项
 * @param {Boolean} socket 是否采用websocket接收响应数据
 * @param {object} cache 缓存配置
 * @returns {Promise} Promise 实例
 */
function createPromise(type, url, data, config, socket, cache = {}) {
  let cacheData, storage = null
  if (cache && cache.key) {
    storage = cache.local ? LOCAL : (cache.session ? SESSION : null)
    cacheData = getCache(cache.key, storage)
  }

  return new Promise(function (resolve, reject) {
    if (cacheData) {
      resolve(cacheData)
    } else {
      // 开启用websocket接收响应数据，通过消息总线来传递数据
      if (socket) {
        // 在请求数据中注入用户与websocket通信的消息名称标识
        data = {
          // websocket约定的消息名称，这里生成一个唯一的标识
          __async__: guid(),
          ...data
        }
        // 用消息总线接收异步消息，需要在websocket接收到数据后，由事件总线触发
        // 只接收一次，收到消息即销毁侦听句柄
        bus.$once(data.__async__, res => {
          processData(res, cache, storage, resolve, reject)
        })
      }
      const http = ['get', 'head', 'delete'].includes(type)
        ? axios[type](url, {...config, params: data})
        : axios[type](url, data, config)
      http.then(function (res) {
        // 如果开启用websocket接收响应数据，http的响应结果可以忽略
        if (socket) return
        processData(res, cache, storage, resolve, reject)
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}


/**
 * 创建缓存key, 由请求url、类型、参数、发送数据构成的标识符
 * @param {string} url 请求url
 * @param {string} type 请求类型
 * @param {object} params url参数对象
 * @param {object} data 请求数据
 * @return {string}
 */
function createKey(url, type, params, data) {
  return encodeURIComponent([url, type, JSON.stringify(params), JSON.stringify(data)].join(','))
}

/**
 * 获取缓存
 * @param {string} key 缓存key
 * @param {Storage} storage 保存缓存方式，localStorage/sessionStorage/null
 * @return {String|Object|Array}
 */
function getCache(key, storage) {
  return storage ? get(key, storage) : Caches[key]
}

/**
 * 写入缓存
 * @param {string} key 缓存key
 * @param {Object|Array} data 写入数据
 * @param {Storage} storage 保存缓存方式，localStorage/sessionStorage/null
 */
function saveCache(key, data, storage) {
  if (storage) {
    save(key, data, storage)
  } else {
    Caches[key] = data
  }
}

/**
 * ajax 函数
 * @export
 * @param {object} options - ajax参数选项. [默认选项值]{@link module:utils/ajax~defaultConfig}
 * @returns {Promise} promise
 *
 *  @example
 *
 *  // 基础用法
 *  ajax({
 *    url: '/api/users'
 *  })
 *  .then(res => {
 *    // to do something...
 *  })
 *  .catch(e => {
 *    // to do something...
 *  })
 *
 *  @example
 *
 *  // url path传参
 *  ajax({
 *    method: 'get',
 *    url: '/api/users/:id',
 *    params: {
 *      id: '123'
 *    }
 *  })
 *
 *  @example
 *
 *  // 发送数据
 *  ajax({
 *    url: '/api/users',
 *    method: 'post',
 *    data: {
 *      name: 'kenny',
 *      password: '123456'
 *    }
 *  })
 *
 *  @example
 *  // 设置请求头
 *  ajax({
 *    url: '/api/users/',
 *    data: {
 *      page: 1,
 *      limit: 10
 *    },
 *    headers: {
 *      'Content-type': 'application/x-www-form-urlencoded'
 *    }
 *  })
 *
 *  @example
 *
 *  // 启用缓存，缓存到内存，刷新页面将失效
 *  ajax({
 *    url: '/api/user',
 *    cache: true
 *  })
 *
 * // 启用缓存，缓存到LocalStorage
 *  ajax({
 *    url: '/api/user',
 *    cache: {
 *      local: true
 *    }
 *  })
 *
 * // 启用缓存，缓存到SessionStorage
 *  ajax({
 *    url: '/api/user',
 *    cache: {
 *      session: true
 *    }
 *  })
 *
 * // 启用缓存，自定义缓存key
 *  ajax({
 *    url: '/api/user',
 *    cache: {
 *      local: true,
 *      key: 'cachekey'
 *    }
 *  })
 *
 *  @example http发送请求，websocket接收响应，需要与websocket配合
 *  ajax({
 *    url: '/api/user',
 *    socket: true
 *  })
 *
 *  // webscoket 接收转发
 *  ws.on('FwzxSyncCall', function (res) {
 *        if (res && res.NotifyId) {
 *         bus.$emit(res.NotifyId, responseData({data: res.Data}))
 *       }
 *     })
 *
 */
export default function (options) {
  // 处理默认参数，传参和默认参数合并
  let config = Object.assign({}, defaultConfig, options || {})
  // 必须要传入url
  if (!config.url) {
    throw new Error('ajax url is required!')
  }
  // 从缓存中提取已经解析过的url
  // url 支持参数信息，如： /api/path/:id
  // 这种情况需要把url解析成一个正则表达式，然后再跟参数匹配组成一个真正要请求的url
  let compileCache = pathToRegexCaches[config.url]
  let host = getHost(config.url)
  if (!compileCache) {
    // 先排除host段，因为host段的端口号与参数写法有冲突
    compileCache = pathToRegexCaches[config.url] = pathToRegex.compile(config.url.replace(host, ''))
  }
  // 出去传输过来的url参数，并补回host段
  let url = host + compileCache(config.params)
  let type = config.method.toLowerCase()
  let data = config.data
  // 处理缓存配置，判断是否有缓存配置，为缓存配置生成一个默认的标识key，这个key也可以由配置指定
  let cache = config.cache
    ? {key: createKey(url, type, config.params, data), ...config.cache}
    : {};
  let socket = config.socket

  delete config.url
  delete config.type
  delete config.data
  delete config.params
  delete config.cache
  delete config.socket

  return createPromise(type, url, data, config, socket, cache)
}


/**
 * axios 数据适配函数, 数据转换层对数据进行转换的函数句柄，代码生成器需要用到该函数
 * @param {Function} transformer 自定义数据转换函数
 * @param {string} method 方法名称
 * @param {object} postData 请求的参数对象
 * @param {object} params 请求的url参数对象
 * @returns {Function}
 */
export function transformHandler(transformer, method, postData, params) {
  return function (data) {
    let json = typeof data === 'string' ? JSON.parse(data) : data
    return transformer(json, method, postData, params)
  }
}
