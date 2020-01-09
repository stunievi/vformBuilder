/**
 * 模拟数据Mockjs处理模块
 * @module utils/mock
 * @author 陈华春
 */

import Mock from 'mockjs'
import pathToRegex from 'path-to-regexp'
import {parse, getParams} from './url'
import {log, tip} from './console'
import * as config from '../config'

// 模拟请求延时时间
Mock.setup({
  timeout: '10-50'
})

/**
 * 字符串转换成对象
 * @param {string} str
 * @returns {Object} json
 *
 *
 * @example
 * // json 格式字符串
 *  "{name:'kenny', password:'123'}"
 *
 *  // 结果
 *  {name:'kenny', password:'123'}
 */
function toObject(str) {
  if (typeof str === 'object') {
    return str
  }
  const regex = /^\{[\W\w]*\}$/
  return regex.test(str) ? JSON.parse(str) : null
}


/**
 * 请求数据 body 转换成 JSON，发送内容有两种形式，json格式或表单模式
 * @param {String} body 数据内容文本
 * @returns {Object} json
 *
 * @example
 * // json 格式
 *  "{name:'kenny', password:'123'}"
 *
 *  //表单模式
 *  name=kenny&passwrod=123
 *
 *  // 结果
 *  {name:'kenny', password:'123'}
 */
function getBody(body) {
  if (!body) return null

  const regex = /^\{[\W\w]*\}$/
  return regex.test(body) ? JSON.parse(body) : parse(body)
}

/**
 * 把非标准的参数名称转换成前端定义的规范名称
 * 需要在config.js 中配置 TO_STANDARD_WORD_MAP，设置需要转换的名称map
 * 如果没有配置，不做任何处理
 * @param {Object} data
 * @returns {*}
 *
 * @example
 *
 * 如： {PageSize:10, PageIndex:1} -> {limit:10, page:1}
 */
function fixWords(data) {
  const wordMap = config.TO_STANDARD_WORD_MAP
  if (!wordMap || !data) return data
  for (let key in wordMap) {
    if (wordMap.hasOwnProperty(key)) {
      const standardWord = wordMap[key]
      const isExist = typeof data[key] !== 'undefined'
      if (isExist) {
        data[standardWord] = data[key]
        delete data[key]
      }
    }
  }
  return data
}

/**
 * 根据mock配置规则，设置拦截请求返回模拟数据
 * @param {Object} item mock规则对象
 * @param {String} item.title 规则描述文字
 * @param {String} item.url 请求url地址
 * @param {String} item.method 请求方法类型，如：get post head put patch delete options
 * @param {Object} [item.params] 请求url查询参数对象
 * @param {Object|Function} item.template 模拟数据模板
 *
 * @example
 *
 * import mock from '@/utils/mock'
 * mock({
 *  title: 'GET_USERS',
 *  url: GET_USERS,
 *  method: 'get',
 *  params: {},
 *  template: {
 *    code: 0,
 *    msg: '获取成功',
 *    data: {
 *      'id': '@guid',
 *      'name': '@cname'
 *    }
 *   }
 * })
 */
export default function (item = {}) {
  if (!item.url) return
  // 匹配的请求url
  let oRegex = pathToRegex(item.url)
  // 只匹配path，忽略参数
  let regex = new RegExp(oRegex.source.replace('(?:\\/)?$', '($|\\?)'), 'i')
  // 设置拦截请求ur
  Mock.mock(regex, item.method, function (options) {
    let result
    let body = getBody(options.body) || {}
    // 把GET、POST请求的参数对象与默认的参数进行合并组成新的对象
    let query = Object.assign({},
      item.params || {},
      getParams(item.url, options.url),
      parse(options.url || ' '),
      fixWords(body),
      fixWords(toObject(body.data) || {})
    )
    if (typeof item.template === 'function') {
      result = item.template(Mock, options.url, query, options)
    } else {
      // 把模拟数据模板字转换成字符串，因为需要对模板插入自定义参数
      let templateString = JSON.stringify(item.template)

      // 替换在模板中的参数标识
      for (let key in query) {
        templateString = templateString.replace(new RegExp('{{' + key + '}}', 'g'), query[key])
      }

      // 返回模拟数据
      result = Mock.mock(JSON.parse(templateString))
    }
    // 打印模拟请求日志
    tip('Mock', item.title)
    log(options, result)
    log('-------------------------------------------')
    return result
  })
}
