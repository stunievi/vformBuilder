const _isEqual = require('lodash/isEqual')

/**
 * 常用辅助函数
 * @module utils/util
 */

/**
 * 判断两个对象是否相等
 * @param {*} object
 * @param {*} other
 * @return {boolean}
 */
export function isEqual(object, other) {
  return _isEqual(object, other)
}

/**
 * 防抖函数
 * @param {function} fn 事件处理函数
 * @param {number} [delay=20] 延迟时间
 * @param {boolean} [isImmediate=false] 是否立刻执行
 * @param {object} [context=this] 上下文对象
 * @returns {Function} 事件处理函数
 */
export function debounce(fn, delay = 20, isImmediate = false, context = this) {
  // 使用闭包，保存执行状态，控制函数调用顺序
  let timer;
  
  return function () {
    const _args = [].slice.call(arguments)
    
    clearTimeout(timer);
    
    const _fn = function () {
      timer = null;
      if (!isImmediate) fn.apply(context, _args);
    };
    
    // 是否滚动时立刻执行
    const callNow = !timer && isImmediate;
    
    timer = setTimeout(_fn, delay);
    
    if (callNow) fn.apply(context, _args);
  }
}

const raFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) {
  return window.setTimeout(callback, 1000 / 60);
};

/**
 * 动画延时函数
 * @function
 * @param {function} callback 动画回调函数
 * @return {number} id
 */
export const requestAnimationFrame = raFrame

/**
 * 清除动画延时
 * @function
 * @param {number} id
 */
export const cancelAnimationFrame = window.cancelAnimationFrame || window.webkitRequestAnimationFrame || function (id) {
  window.clearTimeout(id);
};

/**
 * 节流函数
 * @param {function} fn 事件处理函数
 * @param {object} [context=this] 上下文对象
 * @param {boolean} [isImmediate=false] 是否立刻执行
 * @returns {Function} 事件处理函数
 */
export function throttle(fn, context = this, isImmediate = false) {
  let isLocked;
  return function () {
    const _args = arguments
    
    if (isLocked) return
    
    isLocked = true
    raFrame(function () {
      isLocked = false;
      fn.apply(context, _args)
    })
    
    isImmediate && fn.apply(context, _args)
  }
}

/**
 * 遍历树数据节点，查找符合条件的节点
 * @param {Array|Object} data 数据树，如 {id:1, children:[{id:2}]}
 * @param {Boolean} isFindOne 是否只找最先符合条件的一个
 * @param {Function} fn 查找回调函数，回调参数：item 节点，index节点当前兄弟节点中的索引，data 查找的数据树，函数返回true表示符合条件
 * @param {string} [field=children] 子级字段名称
 * @returns {Array|Object} 查找结果，isFindOne为true时返回Object， false时返回Array
 */
export function traverse(data = [], isFindOne, fn, field = 'children') {
  let result = []
  data = Array.isArray(data) ? data : [data]
  for (let i = 0, len = data.length; i < len; i++) {
    const item = data[i],
      checked = fn(item, i, data),
      children = item[field]
    if (checked) {
      result.push(item)
      if (isFindOne) break
    }
    if (children) {
      const child = traverse(children, isFindOne, fn, field)
      if (child) result = result.concat(child)
    }
  }
  return isFindOne ? result[0] || null : result
}

/**
 * 查找节点在树结构数组的路径
 * @param {Array|Object} data 树数据数组， 如 {id:1, children:[{id:2}]}
 * @param {Function} fn 查找回调函数，回调参数：item 节点，index节点当前兄弟节点中的索引，data 查找的数据树，函数返回true表示符合条件
 * @param {string} [field=children] 子级字段名称
 * @return {Array} 节点路径数组
 */
export function findPath(data, fn, field = 'children') {
  let path = []
  
  function find(array, parent) {
    parent && path.push(parent)
    for (let i = 0, len = array.length; i < len; i++) {
      const item = array[i],
        checked = fn(item, i, array),
        children = item[field]
      // 找到，记录路径，退出循环
      if (checked) {
        path.push(item)
        return true
      }
      if (children && children.length > 0) {
        // 在子级找到，退出循环，自己没有，删除记录的父级
        if (find(children, item)) {
          return true
        } else {
          path.pop()
        }
      }
    }
  }
  
  find([].concat(data))
  return path
  
}

/**
 * 检测字符串是否url
 * @param {string} str 需要检测的字符串
 * @returns {boolean}
 */
export function isUrl(str) {
  return (/^(http|https):\/\/*/.test(str))
}

/**
 * 检测字符串是否邮箱
 * @param {string} str 需要检测的字符串
 * @returns {boolean}
 */
export function isEmail(str) {
  return (/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(str))
}

/**
 * 检测字符串是否身份证号码
 * @param {string} str 需要检测的字符串
 * @returns {boolean}
 */
export function isIdCard(str) {
  return (/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(str))
}

/**
 * 检测字符串是否手机号码
 * @param {string} str 需要检测的字符串
 * @returns {boolean}
 */
export function isPhoneNumber(str) {
  return (/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(str))
}

/**
 * 生成随机GUID
 * @return {string}
 */
export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  }).toUpperCase();
}
