<template>
  <div class="xdh-breadcrumb" :class="{'is-background':this.background}">
    <div class="xdh-breadcrumb__tool" v-if="$slots.tool">
      <slot name="tool"></slot>
    </div>
    <el-breadcrumb :separator="separator" :separatorClass="separatorClass">
      <el-breadcrumb-item v-for="item in storeData" :key="item[props.text]" :to="item[props.to]">{{item[props.text]}}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
  /**
   * 面包屑组件
   * @module widgets/xdh-breadcrumb
   */
  import createStoreModule from './store'

  /**
   * 插槽
   * @member slots
   * @property {String} tool 定义右侧工具
   */

  export default {
    name: 'XdhBreadcrumb',
    /**
     * 属性参数
     * @property {string} [separator='/'] 分隔符
     * @property {string} [separatorClass] 图标分隔符 class
     * @property {Object[]} [data] 数据数组
     * @property {string} [data.text] item 名称
     * @property {string|object} [data.to] 路由跳转对象，同 vue-router 的 to
     * @property {object} [props] 数据字段映射 {text:'text', to:'to'}
     * @property {string} [store=xdhBreadcrumb] 数据存储store模块名称
     * @property {boolean} [background=false] 是否显示背景
     */
    props: {
      separator: String,
      separatorClass: String,
      // {text, to}
      data: {
        type: Array,
        default() {
          return []
        }
      },
      props: {
        type: Object,
        default() {
          return {
            text: 'text',
            to: 'to'
          }
        }
      },
      store: {
        type: String,
        default: 'xdhBreadcrumb'
      },
      background: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      storeData: {
        get() {
          return this.$store.state[this.store].data
        },
        set(val) {
          this.$store.commit(`${this.store}/replace`, val)
        }
      }
    },
    watch: {
      data(val) {
        this.$store.commit(`${this.store}/replace`, val)
      }
    },
    created() {
      if (!this.$store.state[this.store]) {
        this.$store.registerModule(this.store, createStoreModule())
      }
      this.$store.commit(`${this.store}/replace`, this.data)
    }
  }

</script>
