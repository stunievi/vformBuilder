/**
 * Url操作模块
 * @module utils/url
 * @author 陈华春
 */

import pathToRegex from 'path-to-regexp'

const hostRegex = /^(http|https):\/\/[\w.:]*\//

/**
 * 参数字符串转换成对象形式，如：a=1&b=2 转换成 {a:1, b:2}
 * @param {String} str 需要转换的字符串
 * @param {String} [sep=&] 连接符，可选，默认 &
 * @param {String} [eq==] 键值间隔符，可选，默认 =
 * @returns {Object}
 */
export function parse (str, sep, eq) {
  let obj = {}
  str = (str || location.search).replace(/^[^]*\?/, '')
  sep = sep || '&'
  eq = eq || '='
  let arr,
    reg = new RegExp('(?:^|\\' + sep + ')([^\\' + eq + '\\' + sep + ']+)(?:\\' + eq + '([^\\' + sep + ']*))?', 'g')
  while ((arr = reg.exec(str)) !== null) {
    if (arr[1] !== str) {
      obj[decodeURIComponent(arr[1])] = decodeURIComponent(arr[2] || '')
    }
  }
  return obj
}

/**
 * 键值对转换成查询字符串
 * @param {object} query 键值对，对象
 * @returns {string} 查询参数字符串
 */
export function stringify (query) {
  let array = []
  for (let key in query) {
    if (query.hasOwnProperty(key)) {
      array.push([key, encodeURIComponent(query[key])].join('='))
    }
  }
  return array.join('&')
}

/**
 * 获取url的Host段，
 * @param {string} url URL地址
 * @returns {string} Host
 *
 * @example
 *
 * let url = 'http://127.0.0.1:8001/api/abc/123'
 * getHost(url) // -> http://127.0.0.1:8001/
 */
export function getHost (url) {
  let matches = url.match(hostRegex)
  if (matches) {
    return matches[0]
  }
  return ''
}

/**
 * 从url 的 path中提取参数对象，
 * @param {string} regexUrl url path规则表达式
 * @param {string} url URL
 * @returns {object} 参数键值对
 *
 * @example
 *
 * let regexUrl = '/api/:type/:id' ,
 *     url = '/api/abc/123'
 * getParams(regexUrl, url) // -> {type: 'abc', id: 123}
 *
 */
export function getParams (regexUrl, url) {
  let keys = [], host = getHost(regexUrl)
  // 先排除host段，因为host段的端口号与参数写法有冲突
  let regex = pathToRegex(regexUrl.replace(host, ''), keys)
  // 排除url参数部分
  let matches = regex.exec(url.split('?')[0].replace(host, ''))
  let params = {}
  if (matches && matches.length > 0) {
    keys.forEach((key, index) => {
      params[key.name] = matches[index + 1]
    })
  }
  return params
}

/**
 * 在url追加参数
 * @param {string} url 原本的url
 * @param {string|object} query 需要追加的参数，Object|String
 * @returns {string} 追加参数后的url
 */
export function appendQuery (url, query) {
  query = typeof query === 'string' ? parse(query) : query
  const path = url.split('?')[0]
  const originalQuery = parse(url)
  const joinQuery = Object.assign({}, originalQuery, query)
  const queryStr = stringify(joinQuery)
  return queryStr ? [path, queryStr].join('?') : url
}
