<template>
  <div :class="wrapClasses" style="touch-action: none;">
    <div
      :class="scrollContainerClasses"
      :style="{height: containerHeight}"
      @scroll="handleScroll"
      @wheel="onWheel"
      @touchstart="onPointerDown"
      ref="scrollContainer"
    >
      <div :class="loaderClasses" :style="{paddingTop: wrapperPadding.paddingTop}" ref="toploader"
           v-loading.body="showTopLoader"
           :element-loading-text="loadingText"
           :element-loading-spinner="loadingSpinner">
      </div>
      <div :class="slotContainerClasses" ref="scrollContent">
        <slot></slot>
      </div>
      <div :class="loaderClasses" :style="{paddingBottom: wrapperPadding.paddingBottom}" ref="bottomLoader"
           v-loading.body="showBottomLoader"
           :element-loading-text="loadingText"
           :element-loading-spinner="loadingSpinner">
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * scroll 滚动（加载）组件
   * @module widgets/xdh-scroll
   */
  import {throttle} from '@/utils/util'
  import {on, off} from 'element-ui/lib/utils/dom'

  const prefixCls = 'xdh-scroll'
  const dragConfig = {
    sensitivity: 10,
    minimumStartDragOffset: 5 // minimum start drag offset
  }
  const noop = () => Promise.resolve()
  /**
   * 插槽
   * @member slot
   * @property {string} [default] scrollContent 的内容
   */
  export default {
    name: 'XdhScroll',
    /**
     * 属性参数
     * @property {Number | String} [height = 300] 组件的高度（默认300px）,数字默认为px 可以用百分比
     * @property {Function} [onReachTop] 到达顶部时触发， 必须返回 promise
     * @property {Function} [onReachBottom] 到达底部是触发，必须返回 promise
     * @property {Function} [onReachEdge] 到达边缘时触发，必须返回 Promise
     * @property {String} [loadingText = '加载中...'] 到达边缘时显示的文字（根据onReachBottom、onReachTop/onReachEdge的值来定义展示的位置）
     * @property {String} [loadingText = 'el-icon-loading'] 自定义加载图标类名
     * @property {Number | Array} [distanceToEdge] 从边缘到触发回调的距离。如果是负的，回调将在到达边缘之前触发。值最好在 24 以下。(array时，必须传Number，arr0表示top,arr1是bottom)
     */
    props: {
      height: {
        type: [Number, String],
        default: 300
      },
      onReachTop: {
        type: Function
      },
      onReachBottom: {
        type: Function
      },
      onReachEdge: {
        type: Function
      },
      loadingText: {
        type: String,
        default: '加载中...'
      },
      loadingSpinner: {
        type: String,
        default: 'el-icon-loading'
      },
      distanceToEdge: [Number, Array]
    },
    data() {
      const distanceToEdge = this.calculateProximityThreshold()
      return {
        showTopLoader: false,
        showBottomLoader: false,
        showBodyLoader: false,
        lastScroll: 0,
        reachedTopScrollLimit: true,
        reachedBottomScrollLimit: false,
        topRubberPadding: 0,
        bottomRubberPadding: 0,
        rubberRollBackTimeout: false,
        isLoading: false,
        pointerTouchDown: null,
        touchScroll: false,
        end: false,
        handleScroll: () => {
        },
        pointerUpHandler: () => {
        },
        pointerMoveHandler: () => {
        },

        // near to edge detectors
        topProximityThreshold: distanceToEdge[0],
        bottomProximityThreshold: distanceToEdge[1]
      }
    },
    computed: {
      wrapClasses() {
        return `${prefixCls}-wrapper`
      },
      scrollContainerClasses() {
        return `${prefixCls}-container`
      },
      slotContainerClasses() {
        return [
          `${prefixCls}-content`,
          {
            [`${prefixCls}-content-loading`]: this.showBodyLoader
          }
        ]
      },
      loaderClasses() {
        return `${prefixCls}-loader`
      },
      wrapperPadding() {
        return {
          paddingTop: this.topRubberPadding + 'px',
          paddingBottom: this.bottomRubberPadding + 'px'
        }
      },
      containerHeight() {
        return typeof this.height === 'number'
          ? `${this.height}px`
          : this.height
      }
    },
    methods: {
      // just to improve feeling of loading and avoid scroll trailing events fired by the browser
      waitOneSecond() {
        return new Promise(resolve => {
          setTimeout(resolve, 1000)
        })
      },

      /**
       * 计算上下边距的相应距离函数
       * @function calculateProximityThreshold
       * @returns {Array}
       */
      calculateProximityThreshold() {
        const dte = this.distanceToEdge
        if (typeof dte === 'undefined') return [20, 20]
        return Array.isArray(dte) ? dte : [dte, dte]
      },
      /**
       * 在接触边缘时触发的回调函数
       * @function onCallback
       * @param {Number} [dir = 1/-1] 表示方向： 1为toTop -1为toBottom
       */
      onCallback(dir) {
        this.isLoading = true
        this.showBodyLoader = true
        if (dir > 0) {
          this.showTopLoader = true
          this.topRubberPadding = 20
        } else {
          this.showBottomLoader = true
          this.bottomRubberPadding = 20

          // to force the scroll to the bottom while height is animating
          let bottomLoaderHeight = 0
          const container = this.$refs.scrollContainer
          const initialScrollTop = container.scrollTop
          for (let i = 0; i < 20; i++) {
            setTimeout(() => {
              bottomLoaderHeight = Math.max(
                bottomLoaderHeight,
                this.$refs.bottomLoader.getBoundingClientRect().height
              )
              container.scrollTop = initialScrollTop + bottomLoaderHeight
            }, i * 50)
          }
        }
        // 将要执行的cb函数放入队列(callbacks数组)
        const callbacks = [this.waitOneSecond(), this.onReachEdge ? this.onReachEdge(dir) : noop()]
        // dir为上且‘onReachTop’存在则添加onReachTop(否则添加noop), dir为下且‘onReachBottom’存在则添加onReachBottom(否则添加noop)
        callbacks.push(dir > 0 ? this.onReachTop ? this.onReachTop() : noop() : this.onReachBottom ? this.onReachBottom() : noop())

        // 设置5后回调执行失败的延时执行的reset()
        let tooSlow = setTimeout(() => {
          this.reset()
        }, 5000)

        Promise.all(callbacks).then(() => {
          clearTimeout(tooSlow) // cbs队列执行成功，清除 reset()的延时执行
          this.reset() // 自动执行reset()
        })
      },

      reset() { // 重置 loading等prop的值
        [
          'showTopLoader',
          'showBottomLoader',
          'showBodyLoader',
          'isLoading',
          'reachedTopScrollLimit',
          'reachedBottomScrollLimit'
        ].forEach(prop => (this[prop] = false))

        this.lastScroll = 0
        this.topRubberPadding = 0
        this.bottomRubberPadding = 0
        clearInterval(this.rubberRollBackTimeout)

        // if we remove the handler too soon the screen will bump
        if (this.touchScroll) {
          setTimeout(() => {
            off(window, 'touchend', this.pointerUpHandler)
            this.$refs.scrollContainer.removeEventListener('touchmove', this.pointerMoveHandler)
            this.touchScroll = false
          }, 500)
        }
      },

      onWheel(event) {
        if (this.isLoading) return

        // get the wheel direction
        const wheelDelta = event.wheelDelta ? event.wheelDelta : -(event.detail || event.deltaY)
        this.stretchEdge(wheelDelta)
      },

      /**
       * 到达边缘时执行的函数, 在scroll过程中监听到边缘，在到达临界点是触发 onCallBack()函数
       * @function stretchEdge
       * @param {Number} [direction] 边缘的距离
       */
      stretchEdge(direction) {
        clearTimeout(this.rubberRollBackTimeout)

        // check if set these props
        if (!this.onReachEdge) {
          if (direction > 0) {
            if (!this.onReachTop) return
          } else {
            if (!this.onReachBottom) return
          }
        }

        // if the scroll is not strong enough, lets reset it
        this.rubberRollBackTimeout = setTimeout(() => {
          if (!this.isLoading) this.reset()
        }, 250)
        // to give the feeling its ruberish and can be puled more to start loading
        if (direction > 0 && this.reachedTopScrollLimit) {
          this.topRubberPadding += 5 - this.topRubberPadding / 5
          if (this.topRubberPadding >= this.topProximityThreshold) this.onCallback(1)
        } else if (direction < 0 && this.reachedBottomScrollLimit) {
          this.bottomRubberPadding += 6 - this.bottomRubberPadding / 4
          if (this.bottomRubberPadding >= this.bottomProximityThreshold) this.onCallback(-1)
        } else {
          this.onScroll()
        }
      },

      /**
       * 滚动过程中的监听函数，用来在滚动发生中动态改变内部属性
       * @function onScroll
       */
      onScroll(e) {
        // console.log('onScroll', e)
        if (this.isLoading) return
        const el = this.$refs.scrollContainer
        const scrollDirection = Math.sign(this.lastScroll - el.scrollTop) // IE has no Math.sign, check that webpack polyfills this (Math.sign(num)判断num的正负)
        const displacement = el.scrollHeight - el.clientHeight - el.scrollTop

        const topNegativeProximity = this.topProximityThreshold < 0 ? this.topProximityThreshold : 0
        const bottomNegativeProximity = this.bottomProximityThreshold < 0 ? this.bottomProximityThreshold : 0
        if (scrollDirection === -1 && displacement + bottomNegativeProximity <= dragConfig.sensitivity) {
          this.reachedBottomScrollLimit = true
          if (e && this.onReachBottom && !this.end) {
            this.end = true
            this.onCallback(-1)
          }
        } else if (scrollDirection >= 0 && el.scrollTop + topNegativeProximity <= 0) {
          this.reachedTopScrollLimit = true
          if (e && this.onReachTop && !this.end) {
            this.end = true
            this.onCallback(1)
          }
        } else {
          this.reachedTopScrollLimit = false
          this.reachedBottomScrollLimit = false
          this.lastScroll = el.scrollTop
          this.end = false
        }
      },

      getTouchCoordinates(e) {
        return {
          x: e.touches[0].pageX,
          y: e.touches[0].pageY
        }
      },

      onPointerDown(e) {
        // we just use scroll and wheel in desktop, no mousedown
        if (this.isLoading) return
        if (e.type === 'touchstart') {
          // if we start do touchmove on the scroll edger the browser will scroll the body
          // by adding 5px margin on pointer down we avoid this behaviour and the scroll/touchmove
          // in the component will not be exported outside of the component
          const container = this.$refs.scrollContainer
          if (this.reachedTopScrollLimit) container.scrollTop = 5
          else if (this.reachedBottomScrollLimit) container.scrollTop -= 5
        }
        if (e.type === 'touchstart' && this.$refs.scrollContainer.scrollTop === 0) {
          this.$refs.scrollContainer.scrollTop = 5
        }

        this.pointerTouchDown = this.getTouchCoordinates(e)
        on(window, 'touchend', this.pointerUpHandler)
        this.$refs.scrollContainer.parentElement.addEventListener('touchmove', e => {
          e.stopPropagation()
          this.pointerMoveHandler(e)
        }, {passive: false, useCapture: true})
      },

      onPointerMove(e) {
        if (!this.pointerTouchDown) return
        if (this.isLoading) return

        const pointerPosition = this.getTouchCoordinates(e)
        const yDiff = pointerPosition.y - this.pointerTouchDown.y

        this.stretchEdge(yDiff)

        if (!this.touchScroll) {
          const wasDragged = Math.abs(yDiff) > dragConfig.minimumStartDragOffset
          if (wasDragged) this.touchScroll = true
        }
      },

      onPointerUp() {
        this.pointerTouchDown = null
      }
    },
    created() {
      this.handleScroll = throttle(this.onScroll, this, true)
      this.pointerUpHandler = this.onPointerUp.bind(this) // because we need the same function to add and remove event handlers
      this.pointerMoveHandler = throttle(this.onPointerMove, this, true)
    }
  }
</script>
