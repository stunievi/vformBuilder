<template>
  <div class="xdh-echarts" ref="chart" :style="styles"></div>
</template>

<script>
  /**
   * ECharts组件, 提供Vue组件封装，异步加载echarts库, 内置了标签云扩展
   * @module widgets/xdh-echarts
   * @author 陈华春
   */
  import echarts from 'echarts';
  import {addResizeListener, removeResizeListener} from 'element-ui/lib/utils/resize-event'
  import {debounce} from '@/utils/util'

  const FULLSCREEN = 'path://M909 959H780a30 30 0 0 1 0-60h99a20 20 0 0 0 20-20v-99a30 30 0 0 1 60 0v129a50 50 0 0 1-50 50z m20-685a30 30 0 0 1-30-30v-99a20 20 0 0 0-20-20h-99a30 30 0 0 1 0-60h129a50 50 0 0 1 50 50v129a30 30 0 0 1-30 30z m-157 28v420a50 50 0 0 1-50 50H302a50 50 0 0 1-50-50V302a50 50 0 0 1 50-50h420a50 50 0 0 1 50 50z m-60 30a20 20 0 0 0-20-20H332a20 20 0 0 0-20 20v360a20 20 0 0 0 20 20h360a20 20 0 0 0 20-20V332zM244 125h-99a20 20 0 0 0-20 20v99a30 30 0 0 1-60 0V115a50 50 0 0 1 50-50h129a30 30 0 0 1 0 60zM95 750a30 30 0 0 1 30 30v99a20 20 0 0 0 20 20h99a30 30 0 0 1 0 60H115a50 50 0 0 1-50-50V780a30 30 0 0 1 30-30z'
  const CANCEL_FULLSCREEN = 'path://M582.6 441.4v-320h50V356l274-274 35.4 35.4-274 274h234.6v50h-320zM117.4 942l274-274v234.6h50v-320h-320v50H356l-274 274 35.4 35.4zM132 132h302V82H82v352h50V132z m760 760H590v50h352V590h-50v302z'

  function loadGL() {
    return import('echarts-gl')
  }

  function loadWordCloud() {
    return import('echarts-wordcloud')
  }

  function loadLiquidFill() {
    return import('./extension/echarts-liquidfill')
  }

  function createToggleFeature(isFullscreen, clickHandler) {
    return {
      show: true,
      title: isFullscreen ? '取消全屏' : '全屏',
      icon: isFullscreen ? CANCEL_FULLSCREEN : FULLSCREEN,
      onclick: function () {
        clickHandler && clickHandler(isFullscreen)
      }
    }
  }

  // echarts 支持的事件
  const EVENTS = [
    'click',
    'dbclick',
    'mousedown',
    'mouseup',
    'mouseover',
    'mouseout',
    'globalout',
    'legendselectchanged',
    'legendselected',
    'legendunselected',
    'legendscroll',
    'datazoom',
    'datarangeselected',
    'timelinechanged',
    'timelineplaychanged',
    'restore',
    'dataviewchanged',
    'magictypechanged',
    'geoselectchanged',
    'geoselected',
    'geounselected',
    'pieselectchanged',
    'pieselected',
    'pieunselected',
    'mapselectchanged',
    'mapselected',
    'mapunselected',
    'axisareaselected',
    'focusnodeadjacency',
    'unfocusnodeadjacency',
    'brush',
    'brushselected'
  ]

  /**
   * XdhEcharts 组件
   */
  export default {
    name: 'XdhEcharts',
    /**
     * 参数属性
     * @property {object} [geo] 需要注册的地图geoJson， 目录 /widgets/xdh-echarts/map 下包含全国各地的地图
     * @property {string} [map] 需要注册的地图名称， map 和 geo 需要同时设置
     * @property {object|function} [options] echarts 配置项
     * @property {object} [theme] 主题配置对象，目录 /widgets/xdh-echarts/themes 下包含几种主题供选择
     * @property {string} [width=100%] 图表的宽度
     * @property {string} [height=100%] 图表的高度
     * @property {boolean} [loading] 是否显示loading效果
     * @property {string|number} [group] 分组标识
     * @property {boolean} [gl=false] 异步加载 ECharts GL， 在需要使用3D时设置为true
     * @property {boolean} [wordCloud=false] 异步加载 标签云，在需要做标签云效果时设置为true
     * @property {boolean} [liquidFill=false] 异步加载 液体充填，在需要做液体充填效果时设置为true
     * @property {boolean} [toggle=false] 是否开启全屏/取消全屏切换功能
     */
    props: {
      geo: {
        type: Object
      },
      map: {
        type: String
      },
      specialAreas: {
        type: Object
      },
      options: {
        type: [Object, Function]
      },
      theme: {
        type: Object
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '100%'
      },
      loading: {
        type: Boolean,
        default: false
      },
      group: {
        type: [String, Number]
      },
      wordCloud: {
        type: Boolean,
        default: false
      },
      liquidFill: {
        type: Boolean,
        default: false
      },
      gl: {
        type: Boolean,
        default: false
      },
      toggle: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        /**
         *  当前图表是否活动状态
         */
        active: true,

        isFullscreen: false,
        copyChart: null,
        copyDiv: null,
        copyWrapper: null
      }
    },
    watch: {
      // options发生改变时刷新图表
      options: {
        deep: true,
        handler(val) {
          this.setOption(val)
        }
      },
      // 更新loading状态
      loading(val) {
        this.setLoading(val)
      },
      isFullscreen(val) {
        this.setOption(this.options)
      }
    },
    computed: {
      styles() {
        return {
          width: this.width,
          height: this.height
        }
      }
    },
    methods: {
      /**
       * 注册地图
       * @function registerMap
       */
      registerMap() {
        if (this.map && this.geo && !echarts.getMap(this.map)) {
          echarts.registerMap(this.map, this.geo, this.specialAreas)
        }
      },
      /**
       * 初始化图表，实例化ECharts
       */
      init(el) {
        this.chart = echarts.init(el || this.$el, this.theme)
        this.group && this.setGroup(this.group)
        this.setLoading(this.loading)
        EVENTS.forEach(name => {
          this.chart.on(name, (params) => {
            this.$emit(name, params)
          })
        })
      },
      /**
       * 设置图表实例的配置项以及数据，万能接口，所有参数和数据的修改都可以通过setOption完成，ECharts 会合并新的参数和数据，然后刷新图表。
       * 如果开启动画的话，ECharts 找到两组数据之间的差异然后通过合适的动画去表现数据的变化。
       * @function setOption
       * @param {object} options 配置项，与echarts的配置项一致
       */
      setOption(options) {
        let opts = typeof options === 'function'
          ? options(echarts, this) || {}
          : options
        if (this.toggle) {
          if (!opts.toolbox) {
            opts.toolbox = {}
          }
          if (!opts.toolbox.feature) {
            opts.toolbox.feature = {}
          }
          opts.toolbox.feature.myToggle = createToggleFeature(this.isFullscreen, this.toggleFullscreen)
        }
        this.chart && this.chart.setOption(opts || {})
      },
      /**
       * 显示/关闭loading效果
       * @function setLoading
       * @param {boolean} loading 是否显示loading
       */
      setLoading(loading) {
        if (!this.chart) return
        loading ? this.chart.showLoading() : this.chart.hideLoading()
      },
      /**
       * 改变图表尺寸，在容器大小发生改变时将会自动调用。
       * @function resize
       */
      resize() {
        if (this.active) {
          this.chart && this.chart.resize()
        }
      },
      /**
       * 清空当前实例，会移除实例中所有的组件和图表。清空后调用 getOption 方法返回一个{}空对象。
       * @function clear
       */
      clear() {
        this.chart && this.chart.clear()
      },
      /**
       * 触发图表行为，例如图例开关legendToggleSelect, 数据区域缩放dataZoom，显示提示框showTip等等，更多见 action 和 events 的文档。
       * @function dispatchAction
       * @param {object} payload
       */
      dispatchAction(payload) {
        this.chart && this.chart.dispatchAction(payload)
      },
      /**
       * 图表的分组，用于联动
       * @function setGroup
       * @param {string|number} name
       */
      setGroup(name) {
        if (this.chart) {
          this.chart.group = name
        }
      },
      toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen
        console.log(this.isFullscreen)
        this.isFullscreen ? this.showFullscreen() : this.closeFullscreen()
      },
      showFullscreen() {
        const div = document.createElement('div')
        const wrapper = document.createElement('div')
        const style = {
          left: 0,
          top: 0,
          zIndex: 3000,
          position: 'fixed',
          height: '100%',
          width: '100%',
          background: '#fff'
        }
        Object.keys(style).forEach(key => {
          wrapper.style[key] = style[key]
          div.style[key] = style[key]
        })
        this.copyDiv = div
        this.copyWrapper = wrapper
        this.copyChart = this.chart
        wrapper.appendChild(div)
        document.body.appendChild(wrapper)
        this.init(div)
        this.setOption(this.options)
        addResizeListener(div, this.proxyResize)

      },
      closeFullscreen() {
        if (this.copyDiv) {
          removeResizeListener(this.copyDiv, this.proxyResize);
          this.chart && this.chart.dispose();
          this.chart = this.copyChart
        }
        if (this.copyWrapper) {
          this.copyWrapper.parentNode.removeChild(this.copyWrapper)
        }
      }
    },
    created() {
      /**
       * ECharts 实例对象
       * @member chart
       * @type {ECharts}
       */
      this.chart = null
      /**
       * 全局 echarts 对象
       * @member echarts
       * @type {object}
       */
      this.echarts = echarts

      this.proxyResize = debounce(this.resize, 100, false, this)
      this.registerMap()
    },
    mounted() {
      let promises = [Promise.resolve()]
      if (this.gl) {
        promises.push(loadGL())
      }
      if (this.wordCloud) {
        promises.push(loadWordCloud())
      }
      if (this.liquidFill) {
        promises.push(loadLiquidFill())
      }

      Promise.all(promises).then(() => {
        this.init()
        this.setOption(this.options)
        addResizeListener(this.$el, this.proxyResize)
      })
    },
    beforeDestroy() {
      removeResizeListener(this.$el, this.proxyResize);
      this.chart && this.chart.dispose();
    },
    activated() {
      this.active = true
    },
    deactivated() {
      this.active = false
    }
  }
</script>
