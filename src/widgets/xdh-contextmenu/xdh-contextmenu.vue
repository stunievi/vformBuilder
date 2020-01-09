<script>
  import {
    Contextmenu,
    ContextmenuItem,
    ContextmenuSubmenu,
    ContextmenuGroup
  } from 'v-contextmenu'
  import 'v-contextmenu/dist/index.css'

  /**
   * 鼠标右键菜单组件
   * @author 吴杰
   * @module widgets/xdh-contextmenu
   */
  export default {
    name: 'XdhContextmenu',
    components: {
      Contextmenu,
      ContextmenuItem,
      ContextmenuSubmenu,
      ContextmenuGroup
    },
    /**
     * 属性参数
     * @member
     * @property {array} data  菜单列表对象数组 必填
     * @property {object} prop data属性映射可选
     * @property {string} [prop.id=id] 数据唯一主键
     * @property {string} [prop.icon=icon] 字体图标calss
     * @property {string} [prop.text=text] 显示文案
     * @property {string} [prop.children=children] 子集
     * @property {string} [prop.divider=divider] 是否为分隔线
     * @property {string} [prop.disabled=disabled] 是否禁用
     * @property {string} [prop.autoHide=autoHide] 被点击后菜单是否自动隐藏
     * @property {string} [theme=default]  主题  default / bright
     * @property {string} [event-type=contextmenu]  触发其显示的事件类型
     * @property {boolean} [auto-placement = true]  自动切换显示方位
     */
    props: {
      // 菜单列表对象数组
      data: {
        type: Array,
        default() {
          return []
        }
      },
      // 属性映射
      prop: {
        type: Object,
        default() {
          return {
            id: 'id',
            icon: 'icon',
            text: 'text',
            divider: 'divider',
            disabled: 'disabled',
            autoHide: 'autoHide',
            children: 'children'
          }
        }
      },
      // 主题
      theme: {
        type: String,
        default: 'default'
      },
      // 触发其显示的事件类型
      eventType: {
        type: String,
        default: 'contextmenu'
      },
      // 自动切换显示方位
      autoPlacement: {
        type: Boolean,
        default: true
      }
    },
    mixins: [],
    data() {
      return {
        parameter: null
      }
    },
    computed: {},
    watch: {},
    methods: {
      /**
       * 添加 包含子集的节点
       * @param h
       * @param item
       * @returns {*}
       */
      createSubmenu(h, item) {
        let prop = this.prop
        return h('contextmenu-submenu', {
          key: item[prop.id],
          props: {
            disabled: item[prop.disabled]
          },
          on: {
            mouseenter: (vm, e) => {
              this.onMouseenter(item, vm, e)
            },
            mouseleave: (vm, e) => {
              this.onMouseleave(item, vm, e)
            }
          }
        }, [this.createIcon(h, item, 'title'), this.createNodes(h, item[prop.children])])
      },
      /**
       * 添加 不包含子集的节点
       * @param h
       * @param item
       * @returns {*}
       */
      createItem(h, item) {
        let prop = this.prop
        return h('contextmenu-item', {
          key: item[prop.id],
          props: {
            disabled: item[prop.disabled],
            autoHide: item[prop.autoHide]
          },
          on: {
            click: (vm, e) => {
              this.onClick(item, vm, e)
            },
            mouseenter: (vm, e) => {
              this.onMouseenter(item, vm, e)
            },
            mouseleave: (vm, e) => {
              this.onMouseleave(item, vm, e)
            }
          }
        }, [this.createIcon(h, item)])
      },
      /**
       * 添加 分隔线
       * @param h
       * @returns {*}
       */
      createDivider(h) {
        return h('contextmenu-item', {
          props: {
            divider: true
          }
        })
      },
      /**
       *  添加 icon
       * @param h
       * @param obj
       * @param slotName
       * @returns {*}
       */
      createIcon(h, obj, slotName = '') {
        let _slot = {}
        if (slotName) _slot = {slot: slotName}
        /**
         * 插槽
         * @name text 插槽名称 用于自定义菜单数据
         * @param {object} item 插槽响应作用域数据对象
         */
        if (this.$scopedSlots.text) {
          return h('transition', _slot, [this.$scopedSlots.text({
            item: obj
          })])
        }
        let prop = this.prop
        return h('span', Object.assign({
          'class': [obj[prop.icon], 'icon']
        }, _slot), obj[prop.text])
      },
      /**
       * 添加 菜单节点
       * @param h
       * @param arr
       * @returns {*}
       */
      createNodes(h, arr) {
        if (!arr) return false
        let nodes = [], _arr = arr
        if (!Array.isArray(_arr)) {
          _arr = [_arr]
        }
        let prop = this.prop
        _arr.forEach((item, index) => {
          if (item[prop.children]) {
            nodes.push(this.createSubmenu(h, item))
          } else {
            nodes.push(this.createItem(h, item))
          }
          if (item[prop.divider]) {
            nodes.push(this.createDivider(h))
          }
        })
        return nodes
      },
      onClick(item, vm, event) {
        /**
         * 菜单被点击时触发的事件
         * @event on-click
         * @param {object} item 点击的原数据对象
         * @param {object} parameter 显示时候附加参数
         * @param {object} vm 菜单组件的VM
         * @param {object} event 触发的事件对象
         */
        this.$emit('on-click', item, this.parameter, vm, event)
      },
      onMouseenter(item, vm, event) {
        /**
         * 鼠标移动到菜单上时触发的事件
         * @event on-mouseenter
         * @param {object} item 点击的原数据对象
         * @param {object} parameter 显示时候附加参数
         * @param {object} vm 菜单组件的VM
         * @param {object} event 触发的事件对象
         */
        this.$emit('on-mouseenter', item, this.parameter, vm, event)
      },
      onMouseleave(item, vm, event) {
        /**
         * 鼠标从菜单上离开时触发的事件
         * @event on-mouseleave
         * @param {object} item 点击的原数据对象
         * @param {object} parameter 显示时候附加参数
         * @param {object} vm 菜单组件的VM
         * @param {object} event 触发的事件对象
         */
        this.$emit('on-mouseleave', item, this.parameter, vm, event)
      },
      onShow(vm) {
        /**
         * 菜单显示时触发的事件
         * @event on-show
         * @param {object} vm 菜单组件的VM
         */
        this.$emit('on-show', vm)
      },
      onHide(vm) {
        /**
         * 菜单隐藏时触发的事件
         * @event on-hide
         * @param {object} vm 菜单组件的VM
         */
        this.parameter = null // 菜单隐藏是清除参数
        this.$emit('on-hide', vm)
      },
      onContextmenu(vnode) {
        /**
         * contextmenu 事件被触发
         * @event on-trigger
         * @param {object} vnode 触发 contextmenu 事件区域的 vnode
         */
        this.$emit('on-trigger', vnode)
      },
      /**
       * 显示菜单的方法
       * @method show
       * @param {object} position  菜单相对浏览器窗口的坐标 { top: number, left: number }
       * @param {object/array/string} [parameter = null]  请求方法附加参数
       */
      show(position, parameter = null) {
        this.parameter = parameter
        setTimeout(() => {
          this.$refs.contextmenu.show(position)
        }, 0)
      },
      /**
       * 隐藏菜单
       * @method hide
       */
      hide() {
        this.$refs.contextmenu.hide()
      },
      /**
       * 隐藏所有菜单
       * @method hideAll
       */
      hideAll() {
        this.$refs.contextmenu.hideAll()
      }
    },
    render(h) {
      return h('contextmenu', {
        ref: 'contextmenu',
        props: {
          theme: this.theme,
          eventType: this.eventType,
          autoPlacement: this.autoPlacement
        },
        on: {
          show: this.onShow,
          hide: this.onHide,
          contextmenu: this.onContextmenu
        }
      }, this.createNodes(h, this.data) || '')
    }
  }
</script>

<style type="text/css" scoped lang="scss">
  .v-contextmenu {
    .v-contextmenu-item {
      .icon {
        font-size: 100%;
        margin-right: 1rem;
        margin-left: 1.3rem;
        &:before {
          margin-left: -1.3rem;
          position: absolute;
        }
      }
    }
    .v-contextmenu-submenu {
      .icon {
        margin-right: 0;
      }
    }
  }
</style>
