/**
 * 主题颜色更换工具函数, 通常在公共的组件或router-view入口组件加上该 mixin
 * @module utils/theme
 * @author chenhuachun@xdh.net.cn
 * @example
 *
 * import themeMixin from '@/utils/theme'
 * export default {
 *    mixins: [themeMixin()]
 * }
 */

import {save, get, LOCAL} from './storage'

/**
 * 计算指定颜色的浅化颜色
 * @param {string} color 颜色码，如：409eff
 * @param {number} level 浅化等级，0-1之间， 值越大，颜色越浅
 * @return {*}
 */
export function createLightColor(color, level) {
  if (level === 0) return `#${color}`
  const MAX_LEN = 255
  let red = Number.parseInt(color.slice(0, 2), 16)
  let green = Number.parseInt(color.slice(2, 4), 16)
  let blue = Number.parseInt(color.slice(4, 6), 16)
  
  red += Math.round(level * (MAX_LEN - red))
  green += Math.round(level * (MAX_LEN - green))
  blue += Math.round(level * (MAX_LEN - blue))
  
  red = red.toString(16).padStart(2, '0')
  green = green.toString(16).padStart(2, '0')
  blue = blue.toString(16).padStart(2, '0')
  
  return `#${red}${green}${blue}`
}

/**
 * 计算指定颜色的深化颜色
 * @param {string} color 颜色码，如：409eff
 * @param {number} level 简化等级，0-1之间， 值越大，颜色越深
 * @return {*}
 */
export function createDarkColor(color, level) {
  if (level === 0) return `#${color}`
  let red = Number.parseInt(color.slice(0, 2), 16)
  let green = Number.parseInt(color.slice(2, 4), 16)
  let blue = Number.parseInt(color.slice(4, 6), 16)
  
  red = Math.round((1 - level) * red);
  green = Math.round((1 - level) * green);
  blue = Math.round((1 - level) * blue);
  
  red = red.toString(16).padStart(2, '0')
  green = green.toString(16).padStart(2, '0')
  blue = blue.toString(16).padStart(2, '0')
  
  return `#${red}${green}${blue}`
}

/**
 * 获取主题的配色数组
 * @param {string} color 主题主色，如：#409eff
 * @return {Array}
 */
export function getThemeColors(color) {
  color = color.replace('#', '')
  let colors = []
  for (let i = 0; i < 10; i++) {
    colors.push(createLightColor(color, Number(i / 10)))
  }
  for (let i = 1; i < 3; i++) {
    colors.push(createDarkColor(color, Number(i / 10)))
  }
  return colors
}

/**
 * 替换新的颜色码
 * @param {string} styleText 样式内容文本
 * @param {array} oldColors 当前的主题颜色码数组
 * @param {array} newColors 需要更换成的颜色数组
 * @return {*}
 */
export function replaceColors(styleText, oldColors, newColors) {
  oldColors.forEach((color, index) => {
    styleText = styleText.replace(new RegExp(color, 'gi'), newColors[index])
  })
  return styleText
}

/**
 * 异步请求
 * @param {string} url 请求地址
 * @param {function} callback 请求成功回调函数
 */
export function async(url, callback) {
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304)) {
      callback && callback(xhr.responseText)
    }
  }
  xhr.open('GET', url)
  xhr.send(null)
}

/**
 * 切换主题
 * @param {string} val 需要切换到的主题主色颜色码
 * @param {string} oldVal 未切换前的主题主色颜色码
 */
export function theme(val, oldVal) {
  if (!val || !oldVal) return
  
  const head = document.getElementsByTagName('head')[0]
  const newColors = getThemeColors(val)
  const oldColors = getThemeColors(oldVal)
  const links = [].slice.call(head.getElementsByTagName('link'))
    .filter(link => link.getAttribute('rel') === 'stylesheet')
  
  const styles = [].slice.call(head.getElementsByTagName('style'))
  links.forEach((link, index) => {
    const id = `link-${index}`
    let el = document.getElementById(id)
    if (!el) {
      async(link.href, function (text) {
        // 清除字体文件的定义，减少内容长度
        text = text.replace(/@font-face{[^}]+}/gi, '')
        if (text) {
          el = document.createElement('style')
          el.id = id
          el.innerText = replaceColors(text, oldColors, newColors)
          head.appendChild(el)
        }
      })
    }
  })
  
  styles.forEach(el => {
    const text = el.innerText
    el.innerText = replaceColors(text, oldColors, newColors)
    
  })
}

/**
 * 创建主题store模块
 * @param {string} [defaultColor] 默认主题颜色
 * @return {Object}
 */
export function createStoreModule(defaultColor) {
  return {
    namespaced: true,
    state: {
      color: defaultColor
    },
    mutations: {
      change(state, color) {
        state.color = color
      }
    }
  }
}

/**
 * 创建组件主题 mixin
 * @param {string} [defaultColor] 默认主题颜色
 * @param {string} [moduleName] store模块名称
 * @param {string} [cacheKey] 缓存key
 * @return {Object}
 */
export function mixin(defaultColor = '#409eff', moduleName = 'uiTheme', cacheKey = 'xdh-web-theme') {
  return {
    created() {
      if (!this.$store.state[moduleName]) {
        this.$store.registerModule(moduleName, createStoreModule(defaultColor))
      }
      const color = get(cacheKey, LOCAL)
      if (color) {
        this.$store.commit(`${moduleName}/change`, color)
        theme(color, defaultColor)
      }
    },
    watch: {
      [`$store.state.${moduleName}.color`](val, oldVal) {
        const color = val || defaultColor
        theme(color, oldVal || defaultColor)
        save(cacheKey, color, LOCAL)
      }
    },
    methods: {
      changeTheme(color) {
        this.$store.commit(`${moduleName}/change`, color || defaultColor)
      }
    }
  }
}

export default mixin
