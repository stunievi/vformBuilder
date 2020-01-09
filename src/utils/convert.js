/**
 * 数据转换工具函数模块
 * @module utils/convert
 * @author 陈华春
 */

/**
 * 把列表数据转换成树结构, 列表数据必须有父节点标识
 * @param {Object[]} list 列表数组数据
 * @param {String|Number} parentId 根节点的父节点id标识
 * @param {Number} [level=0] 指定第一层级别的索引，可选，默认值：0
 * @param {Object} [map={id:'id' ,parentId:'parentId', children:'children', level:'level', order:'order'}] 属性映射, 可选
 * @param {String} map.id 节点标识
 * @param {String} map.parentId 父节点标识
 * @param {Object[]} map.children 子节点数组
 * @param {Number} map.level 层级索引
 * @param {Number} map.order 排序标识
 * @returns {Object[]} 树结构数组
 *
 * @example
 * // 基础用法
 *  let list = [{id:1, parentId:null, text:'node 1'}, {id:2, parentId:1, text:'node 2'}]
 *  let tree = listToTree(list, null)
 *  // tree： [{id:1, parentId:null, text:'node 1', level:0, children:[
 *  //           {id:2, parentId:1, text:'node 2', level:1}
 *  //           ]
 *  //        }]
 */
export function listToTree(list, parentId, level = 0, map) {
  const prop = {
    id: 'id',
    parentId: 'parentId',
    children: 'children',
    level: 'level',
    order: 'order',
    path: 'path',
    ...map
  }
  
  // 判断是否需要排序
  if (list.length > 0 && list[0][prop.order]) {
    list.sort((a, b) => {
      return a[prop.order] - b[prop.order]
    })
  }
  
  let temp = Object.create(null), tree = [];
  list.forEach(item => {
    temp[item[prop.id]] = item
  })
  
  
  for (let key in temp) {
    const item = temp[key]
    const pId = item[prop.parentId]
    if (pId === parentId) {
      item[prop.level] = level
      item[prop.path] = [item[prop.id]]
      tree.push(item)
    } else {
      const parent = temp[pId]
      if (parent) {
        if (!parent[prop.children]) {
          parent[prop.children] = []
        }
        const path = (parent[prop.path] || []).concat(item[prop.id])
        
        item[prop.level] = parent[prop.level] + 1
        item[prop.path] = path
        parent[prop.children].push(item)
      }
    }
  }
  return tree
  
}

/**
 * 简单 列表转换树结构
 * @param {Object[]} list 列表数据，约定字段名称： id/parentId/children
 * @param {*} [parentId=null] 父节点的值
 * @param {string} [idKey=id] id字段名称
 * @param {string} [parentIdKey=parentId] parentId字段名称
 * @return {Array}
 */
export function buildTree(list = [], parentId = null, idKey = 'id', parentIdKey = 'parentId') {
  let temp = Object.create(null), tree = []
  list.forEach(item => {
    temp[item[idKey]] = {...item}
  })
  
  for (let key in temp) {
    const item = temp[key]
    if (item[parentIdKey] === parentId) {
      tree.push(item)
    } else {
      const parent = temp[item[parentIdKey]]
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(item)
      }
    }
  }
  
  return tree
}

/**
 * 列表数据转换成表格数结构（不建议再使用），请使用 [listToTree]{@link module:utils/convert.listToTree}
 * @deprecated
 * @param {Object[]} list 列表数组数据
 * @param {String|Number} parentId 根节点的父节点id标识
 * @param {Number} [level=0] 指定第一层级别的索引，可选，默认值：0
 * @param {Object} [prop={id:'id' ,parentId:'parentId', children:'children', level:'level', order:'order'}] 属性映射, 可选
 * @param {String} prop.id 节点标识
 * @param {String} prop.parentId 父节点标识
 * @param {Object[]} prop.children 子节点数组
 * @param {Number} prop.level 层级索引
 * @param {Number} prop.order 排序标识
 * @returns {Object[]} 树结构数组
 * @see [utils/convert.listToTree]{@link module:utils/convert.listToTree}
 */
export function listToTableTree(list, parentId, level = 0, prop = {
  id: 'id',
  parentId: 'parentId',
  children: 'children',
  level: 'level',
  order: 'order'
}, idPath) {
  let temp, result = []
  if (!list || list.length === 0) {
    return result
  }
  list.forEach(item => {
    if (item[prop.parentId] === parentId) {
      let obj = Object.assign({}, item)
      obj[prop.level] = level
      obj.idPath = (idPath || '') + '_' + item[prop.id]
      result.push(obj)
      temp = listToTableTree(list, obj[prop.id], level + 1, prop, obj.idPath)
      if (temp.length > 0) {
        result = result.concat(temp)
      }
    }
  })
  return result.sort((a, b) => {
    return a[prop.order] - b[prop.order]
  })
}

/**
 * 深度拷贝对象或数组，采用JSON.parse 和 JSON.stringify 实现, 相同功能的方法 [deepCop]{@link module:utils/convert.deepCopy}
 * @param {Object|Array} obj 要拷贝的对象或数组
 * @returns {Object|Array} 拷贝后的对象副本
 */
export function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 检测数据类型
 * @param {*} obj 需要检测的数据
 * @returns {string} boolean / number / string / function / array / date / regExp / undefined / null / object
 */
export function typeOf(obj) {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}

/**
 * 深度拷贝对象或数据
 * @param {*} data 需要拷贝的数据
 * @returns {*} 拷贝后的数据副本
 * @see [clone]{@link module:utils/convert.clone}
 */
export function deepCopy(data) {
  const t = typeOf(data)
  let o
  
  if (t === 'array') {
    o = []
  } else if (t === 'object') {
    o = {}
  } else {
    return data
  }
  
  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]))
    }
  } else if (t === 'object') {
    for (let i in data) {
      o[i] = deepCopy(data[i])
    }
  }
  return o
}

/**
 * 对数组按制定字段名称进行分组
 * @param {Array} data 数组数组
 * @param {string} [field=group] 分组字段名称
 * @returns {object} 结果
 *
 * @example
 * [{name:1, group:'a'},{name:2, group:'a'}, {name:3, group:'b'}]  ->
 * {
 *  'a':[{name:1, group:'a'}, {name:2, group:'a'}]
 *  'b': [{name:3, group:'b'}]
 * }
 */
export function grouping(data = [], field = 'group') {
  let result = {
    'default': []
  }
  data.forEach(item => {
    let group = item[field]
    if (group) {
      if (!result[group]) {
        result[group] = []
      }
      result[group].push(item)
    } else {
      result['default'].push(item)
    }
  })
  return result
}


/**
 * 判断两个数组是否相等
 * @param {Array} arr1
 * @param {Array} arr2
 * @returns {boolean}
 */
export function arrayEqual(arr1, arr2) {
  if (arr1 === arr2) return true;
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; ++i) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}


/**
 * 分页获取数据
 * @param {Array} data 源数据
 * @param {number} [page=1] 当前页面，1开始
 * @param {number} [size=10] 页大小，默认10
 * @return {Array}
 */
export function pager(data, page = 1, size = 10) {
  if (!data) return []
  const start = (page - 1) * size
  const end = start + size
  return data.length > start ? data.slice(start, end) : []
}

/**
 * 循环从数组中取出指定数量项
 * @param {Array} data
 * @param {Number} num 提取几项
 * @param index 在中间的是第几项，从0开始
 * @return {Array}
 *
 * @example
 *
 * const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 * range(data, 5, 0) // -> [9, 10, 1, 2, 3]
 * range(data, 5, 1) // -> [10, 1, 2, 3, 4]
 * range(data, 5, 9) // -> [8, 9, 10, 1, 2]
 *
 */
export function range(data = [], num = 10, index = 0) {
  let len = data.length,
    count = Math.floor((num - 1) / 2),
    result = [],
    left = count,
    right = num - left - 1,
    i,
    j;
  
  i = j = index;
  result.push(data[index]);
  
  while (left > 0) {
    i--;
    i = i < 0 ? len - 1 : i;
    result.unshift(data[i]);
    left--;
  }
  
  while (right > 0) {
    j++;
    j = j > len - 1 ? 0 : j;
    result.push(data[j]);
    right--;
    
  }
  return result;
}

/**
 * 循环从数组中取出指定数量项
 * @param {Array} data
 * @param {Number} num 提取几项
 * @param index 在中间的是第几项，从0开始
 * @return {Array}
 *
 * @example
 *
 * const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 * rangeLeft(data, 5, 0) // -> [1, 2, 3, 4, 5]
 * rangeLeft(data, 5, 1) // -> [2, 3, 4, 5, 6]
 * rangeLeft(data, 5, 9) // -> [6, 7, 8, 9, 10]
 */
export function rangeLeft(data = [], num = 10, index = 0) {
  let len = data.length,
    result = [],
    right = data.length >= num ? num - 1 : data.length - 1,
    i = index;
  
  result.push(data[index]);
  
  while (right > 0) {
    i++;
    i = i > len - 1 ? 0 : i;
    result.push(data[i]);
    right--;
  }
  
  return result;
}

/**
 * 从数组中取出指定数量项
 * @param {Array} data
 * @param {Number} num 提取几项
 * @param index 当前是第几个
 * @return {Array}
 *
 * @example
 *
 * const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 * rangeFixed(data, 5, 0) // -> [1, 2, 3, 4, 5]
 * rangeFixed(data, 5, 1) // -> [1, 2, 3, 4, 5]
 * rangeFixed(data, 5, 6) // -> [5, 6, 7, 8, 9]
 * rangeFixed(data, 5, 9) // -> [6, 7, 8, 9, 10]
 */
export function rangeFixed(data = [], num = 10, index = 0) {
  let left = ((num - 1) / 2) | 0;
  left = index - left < 0 ? 0 : index - left;
  let right = left + num - 1, total = data.length, result = [];
  if (total > num) {
    while (left > total - num) {
      if (left > 0) {
        left--;
      }
      right--;
    }
  } else {
    left = 0;
    right = total - 1;
  }
  for (let i = left; i <= right; i++) {
    result.push(data[i]);
  }
  return result;
}
