/**
 * 打印日志模块
 * @module utils/console
 * @author 陈华春
 *
 * @example
 *  // 基础用法
 *  import {log} from '@/utils/console'
 *  log('日志内容')
 */

import * as config from '../config'

/**
 * 是否开启在生产模式时打印日志， 可以在 /src/config.js 中配置
 * @const
 */
const DE_BUG = process.env.NODE_ENV === 'production' ? !!config.DE_BUG : true

const COLORS = {
  default: '#35495E',
  primary: '#3488ff',
  success: '#43B883',
  warn: '#e6a23c',
  error: '#f56c6c'
}

/**
 * 内部调用 console 对象的方法
 * @inner
 * @param {string} name 方法名称
 * @param {Array} args 参数数组
 */
function applyMethod(name, args) {
  if (DE_BUG && window.console) {
    const method = window.console[name]
    try {
      method.apply(method, args)
    } catch (e) {
    }
  }
}

/**
 * 输出提示信息
 * @param {string} title 标题
 * @param {string} info 内容
 * @param {string} [type=primary] 颜色类型，支持：primary/success/warn/error
 */
export function tip(title, info, type = 'primary') {
  log(
    `%c ${title} %c ${info} %c`,
    'background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
    `background:${COLORS[type]}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
    'background:transparent'
  )
}

/**
 * 打印信息日志
 * @param {...string} content 日志内容
 */
export function log(content) {
  applyMethod('log', arguments)
}

/**
 * 打印警告日志
 * @param {...string} content 日志内容
 */
export function warn(content) {
  applyMethod('warn', arguments)
}

/**
 * 打印错误日志
 * @param {...string} content 日志内容
 */
export function error(content) {
  applyMethod('error', arguments)
}

/**
 * 枚举对象属性
 * @param {...string} obj 对象
 */
export function dir(obj) {
  applyMethod('dir', arguments)
}
