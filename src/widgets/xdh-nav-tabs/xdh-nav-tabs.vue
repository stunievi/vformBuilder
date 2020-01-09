<template>
  <div class="xdh-nav-tabs" v-if="tabs && tabs.list.length>0">
    <el-tabs class="xdh-nav-tabs__tabs"
             :class="{'has-tool':showTool}"
             type="card"
             v-model="selected"
             @tab-remove="handleTabRemove"
             @tab-click="handleTabClick">
      <el-tab-pane v-for="(item,index) in tabs.list" :key="item.name"
                   :closable="item.closable"
                   :name="item.name">
        <template slot="label">
          <slot name="label" :item="item" :index="index"><i v-if="item.icon" :class="item.icon"></i> {{item.label}}
          </slot>
        </template>
      </el-tab-pane>
    </el-tabs>
    <div class="xdh-nav-tabs__tool" v-if="showTool">
      <el-dropdown size="small" @command="handelToolCommand">
        <span class="el-dropdown-link">
          <i class="el-icon-setting"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <slot name="tool"></slot>
          <el-dropdown-item :divided="$slots.tool" command="close">清除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>

  /**
   * nav-tabs 导航标签页组件
   * @module widgets/xdh-nav-tabs
   */

  /*
   * @description 组件create后会自行创建一个命名store（默认名'xdhNavTab'）管理自身的数据。store.state的解构如下：
   *
   *
   * @property {Array} [list] 生成多个选项卡的数据列表
   * @property {String} [list.label] 选项卡显示名
   * @property {String} [list.name] 选项卡对应的路由路径
   * @property {Boolean} [list.closable] 选项卡是否可关闭
   * @property {String} [selected] 当前被选中的选项卡name
   *
   */

  /**
   * @example
   *
   * // 在 router.js 中动态注册 navs-tabs的 store
   * import store from '../store/index'
   * import createStoreModule from '@/widgets/xdh-nav-tabs/store' // 引入nav-tabs的store实例创建函数
   * const DEMO_TABS = 'demoTabs'
   * if (!store.state[DEMO_TABS]) { // 若导航选项卡的store未生成
   *   store.registerModule(DEMO_TABS, createStoreModule())
   * }
   * // 通过路由守卫向demoTabs.state添加tabs的列表数据
   * router.afterEach((to) => { store.commit(`${DEMO_TABS}/push`, toObj })
   *
   * scopeSlots
   * @member scopeSlots
   * @property {string} label 自定义选项卡标题内容, 参数：item 当前选项卡数据，index 数据所在数组索引
   *
   */
  import createStoreModule from './store'

  /**
   * slots
   * @member slots
   * @property {string} tool 定义工具项目内容，el-dropdown-item 组件
   */

  export default {
    name: 'XdhNavTabs',
    /**
     * 属性参数
     * @property {String} [label] 显示文字（可选），如果有值时，会作为当前默认选中标签页
     * @property {String} [name] 选项卡名称，通常设为路由的 path（可选），如果有值时，会作为当前默认选中标签页
     * @property {String} [icon] 文字旁边的图标
     * @property {Boolean} [closable = true] 是否能关闭
     * @property {String} [store = xdhNavTab] 默认模块名
     * @property {Boolean} [router = true] 是否使用 vue-router 的模式，启用该模式会在激活导航时以 name 作为 path 进行路由跳转
     */
    props: {
      label: {
        type: String
      },
      name: {
        type: String
      },
      icon: {
        type: String
      },
      closable: {
        type: Boolean,
        default: true
      },
      store: {
        type: String,
        default: 'xdhNavTab'
      },
      router: {
        type: Boolean,
        default: true
      },
      showTool: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      tabs() {
        const store = this.$store.state[this.store]
        if (store) {
          return store
        } else {
          return {
            list: [],
            selected: ''
          }
        }
      },
      selected: {
        get() {
          return this.$store.state[this.store].selected
        },
        set(selected) {
          this.$store.commit(`${this.store}/select`, selected)
        }
      }
    },
    methods: {
      handleTabRemove(name) {
        this.$store.commit(`${this.store}/remove`, {name: name})
        /**
         * 删除tab项触发
         * @event on-remove
         * @param {string} name 关闭的tab 名称
         * @param {string} selected 将要选中的tab名称
         */
        this.$emit('on-remove', name, this.tabs.selected)
        if (this.router) {
          this.$router.push(this.tabs.selected)
        }
      },
      handleTabClick(tab) {
        /**
         * 点击tab项触发
         * @event on-click
         * @param {object} tab 点击的tab Vue实例
         */
        this.$emit('on-click', tab)
        if (this.router) {
          // 由于el-tabs组件有自己的逻辑要处理
          this.$router.push(tab.name)
        }
      },
      /**
       * 添加tab
       * @function push
       * @param {Object} tab
       * @param {string} tab.label 显示文字
       * @param {string} tab.name 标识或路由path
       * @param {string} tab.icon 图标 className
       * @param {boolean} tab.closable 能否关闭
       *
       */
      push(tab) {
        this.$store.commit(`${this.store}/push`, {tab})
      },
      handelToolCommand(command) {
        switch (command) {
          case 'close':
            this.$store.commit(`${this.store}/close`)
            break;
        }
        /**
         * 点击工具项触发
         * @event on-command
         * @param {string} command 命令名称
         *
         */
        this.$emit('on-command', command)
      }
    },
    created() {
      /**
       * 创建时若 store中没有  ‘xdhNavTab’ 这个模块， 自行创建‘xdhNavTab’模块
       */
      if (!this.$store.state[this.store]) {
        this.$store.registerModule(this.store, createStoreModule())
      }
      if (this.label && this.name) {
        this.$store.commit(`${this.store}/push`, {
          tab: {
            label: this.label,
            name: this.name,
            icon: this.icon,
            closable: this.closable
          }
        })
      }
    }
  }
</script>
