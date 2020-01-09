/**
 * 切换皮肤mixin
 * @module utils/skin
 * @author chenhuachun@xdh.net.cn
 * @example
 *
 * // 需要在src/style/skins 目录下建立皮肤scss文件，并在src/style/index.scss引入
 *
 * import skinMixin from '@/utils/skin'
 * export default {
 *    mixins: [skinMixin()]
 * }
 */
import {save, get, LOCAL} from './storage'
import {addClass, removeClass} from 'element-ui/lib/utils/dom'

function createStoreModule(defaultSkin) {
  return {
    namespaced: true,
    state: {
      skin: defaultSkin
    },
    mutations: {
      change(state, skin) {
        state.skin = skin
      }
    }
  }
}

/**
 * 切换皮肤mixin
 * @param {string} defaultSkin 默认皮肤名称
 * @param {string} [moduleName] store 模块名称
 * @param {string} [cacheKey] 缓存key
 * @return {Object}
 */
export function mixin(defaultSkin = '', moduleName = 'uiSkin', cacheKey = 'xdh-web-skin') {
  return {
    created() {
      if (!this.$store.state[moduleName]) {
        this.$store.registerModule(moduleName, createStoreModule(defaultSkin))
      }
      const skin = get(cacheKey, LOCAL)
      if (skin) {
        this.$store.commit(`${moduleName}/change`, skin)
      }
    },
    watch: {
      [`$store.state.${moduleName}.skin`](val, oldVal) {
        const body = document.body
        oldVal && removeClass(body, oldVal)
        val && addClass(body, val)
        save(cacheKey, val, LOCAL)
      }
    },
    methods: {
      changeSkin(skin) {
        this.$store.commit(`${moduleName}/change`, skin)
      }
    }
  }
}

export default mixin