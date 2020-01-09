<template>
  <div class="xdh-anchor" :style="styles">
    <ul>
      <li class="xdh-anchor__start"></li>
      <li v-for="(item, index) in data"
          :key="index"
          class="xdh-anchor__item"
          :class="{'is-active': activeIndex === index }"
          @click="handleClick(item, index)">
        {{item.text}}
        <slot name="tag" :item="item"></slot>
      </li>
      <li class="xdh-anchor__end"></li>
    </ul>
  </div>
</template>

<script>
  import {scrollTop, offsetTop} from '@/utils/dom'
  import {throttle} from '@/utils/util'

  /**
   * 描点定位菜单组件
   * @module widgets/xdh-anchor
   * @author 陈华春
   */

  export default {
    name: 'XdhAnchor',
    /**
     * 参数属性
     * @property {Object[]} data 菜单数据，数组形式, 项目对象包含{id, text}
     * @property {string} data.id 定位到的Dom id
     * @property {string} data.text 菜单显示文字
     * @property {String|HTMLElement|Window} container 滚动内容区容器，字符串类型时，是DOM的id
     * @property {String} [width=100%] 菜单显示宽度
     */
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      },
      width: {
        type: String,
        default: '100%'
      },
      container: {
        type: [String, HTMLElement, Window]
      }
    },
    data() {
      return {
        activeIndex: -1
      }
    },
    computed: {
      styles() {
        return {
          width: this.width
        }
      }
    },
    watch: {
      container(newVal, oldVal) {
        this.offContainerEvent(oldVal)
        this.initContainerEvent(newVal)
      },
      activeIndex(val) {
        /**
         *  定位发生改变时触发
         *  @event on-change
         *  @param {number} index
         */
        this.$emit('on-change', val)
      }
    },
    methods: {
      getContainer(container) {
        return typeof container === 'string'
          ? document.getElementById(container)
          : container
      },
      handleScroll() {
        const wrapper = this.getContainer(this.container)
        const wrapperOffsetTop = offsetTop(wrapper)
        const currentTop = wrapper.scrollY || wrapper.scrollTop || 0
        const topArray = this.data.map(item => {
          const el = document.getElementById(item.id)
          if (el) {
            return offsetTop(el) - wrapperOffsetTop
          }
        })
        let index = 0;
        if (topArray.length > 0) {
          if (currentTop <= topArray[0]) {
            index = 0
          } else if (currentTop >= topArray[topArray.length - 1]) {
            index = topArray.length - 1
          } else {
            index = topArray.findIndex(item => {
              return item > currentTop
            })
            --index
          }
        }
        this.activeIndex = index
      },
      scrollTo(id) {
        let el = document.getElementById(id)
        if (!el) return
        const wrapper = this.getContainer(this.container)
        scrollTop(wrapper, wrapper.scrollY || wrapper.scrollTop, el.offsetTop)
      },
      handleClick(item, index) {
        this.activeIndex = index
        this.scrollTo(item.id)
      },
      initContainerEvent(container) {
        const wrapper = this.getContainer(container)
        if (!wrapper) return
        wrapper.addEventListener('scroll', this.handleScroll)
      },
      offContainerEvent(container) {
        const wrapper = this.getContainer(container)
        if (!wrapper) return
        wrapper.removeEventListener('scroll', this.handleScroll)
      },
      /**
       * 定位到第一项
       * @function toFirst
       */
      toFirst() {
        const first = this.data[0]
        if (first) {
          this.scrollTo(first.id)
        }
      }
    },
    mounted() {
      this.proxyHandleScroll = throttle(this.handleScroll, this)
      this.initContainerEvent(this.container)
      this.proxyHandleScroll()
    },
    beforeDestroy() {
      this.offContainerEvent(this.container)
    }
  }
</script>

