<script>
  import 'animate.css'
  /**
   * timeline时间线组件
   * @module widgets/xdh-timeline
   */

  /**
   * 插槽
   * @member slots
   * @property {string} default 默认 轴线内容插槽, 作用域插槽，参数：item 当前数据项对象
   * @property {string} dot 轴线上节点, 作用域插槽，参数：item 当前数据项对象
   * @property {string} opposite 内容对向区域, 作用域插槽，参数：item 当前数据项对象
   *
   */
  const prefixCls = 'xdh-timeline'
  export default {
    name: 'XdhTimeline',
    /**
     * 属性参数
     * @property {Array} data 数据项配置集合
     * @property {Object} props 数据项配置字段映射
     * @property {String} size 节点尺寸,可选： default / small / large
     * @property {String} icon 节点icon,可以从文档图标库中选择
     * @property {String} [sign-align = 'top'] 指向箭头放置位置  可选： top / middle / bottom
     * @property {String} align 项目排列方式,可选： startLeft / startRight / left / right
     * @property {String} body-color 数据项容器颜色值，当为 'transparent' 时指向箭头不会显示
     * @property {Boolean} [fold = false] 开启折叠功能, 自动把 data 次级 children 内容收缩起来, 可以指定某一组能够折叠
     * @property {Array} [animate-class = ['fadeIn', 'fadeOut']] 折叠收缩数据项动画class,[入场动画，退出动画] 参考组件库动效 -> Animate.css
     */
    props: {
      data: {
        type: Array,
        default() {
          return [{}]
        }
      },
      /**
       * props 映射关系
       */
      props: {
        type: Object,
        default() {
          return {}
        }
      },
      size: String,
      icon: String,
      signAlign: {
        type: String,
        default: 'top'
      },
      align: String,
      // 轴线联动到 align 布局,align 为 left / right 有效, 可以改变轴的位置
      axisLinkage: {
        type: Boolean,
        default: true
      },
      bodyColor: String,
      fold: {
        type: Boolean,
        default: false
      },
      animateClass: {
        type: Array,
        default() {
          return ['fadeIn', 'fadeOut']
        }
      }
    },
    computed: {
      classes() {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}-axis-align__${this.align}`]: this.axisLinkage && ['left', 'right'].includes(this.align)
          }
        ]
      },
      innerDotClasses() {
        return `${prefixCls}-item__inner-dot`
      },
      bodyClasses() {
        return `${prefixCls}-item__body`
      },
      oppositeClasses() {
        return `${prefixCls}-item__opposite`
      },
      model() {
        let result = {
          size: 'size',
          icon: 'icon',
          align: 'align',
          signAlign: 'signAlign',
          bodyColor: 'bodyColor',
          children: 'children',
          fold: 'fold',
          animateClass: 'animateClass'
        }
        return Object.assign(result, this.props)
      }
    },
    methods: {
      /**
       * 设置参数
       * @param partial 局部设定
       * @param global 全局设置
       * @returns {*}
       */
      filterParam(partial, global) {
        return typeof partial !== 'undefined' ? partial : global
      },
      itemClasses(item) {
        // startLeft / startRight / left / right
        let signAlign = this.filterParam(item && item[this.model.signAlign], this.signAlign)
        if (signAlign !== 'middle' && signAlign !== 'bottom') signAlign = 'top'
        let itemAlign = (item && item[this.model.align])
        let align = ['left', 'right'].includes(itemAlign) ? this.filterParam(itemAlign, this.align) : this.align
        if (!['startRight', 'left', 'right'].includes(align)) align = ''
        return [
          `${prefixCls}-item`,
          {
            [`${prefixCls}-item--fill-dot`]: true,
            [`${prefixCls}-item--align-${signAlign}`]: signAlign,
            [`${prefixCls}-item__align--${align}`]: align
          }
        ]
      },
      dotClasses(item) {
        let size = this.filterParam(item && item[this.model.size], this.size)
        return [
          `${prefixCls}-item__dot`,
          {
            [`${prefixCls}-item__dot--${size}`]: size && (size !== 'default')
          }
        ]
      },
      dotIconClasses(item) {
        let icon = this.filterParam(item && item[this.model.icon], this.icon)
        return [
          `${prefixCls}-item__dot-icon`,
          {
            [icon]: icon
          }
        ]
      },
      bodyStyle(item) {
        // transparent
        let bodyColor = this.filterParam(item && item[this.model.bodyColor], this.bodyColor) || '#ffffff'
        return {
          background: bodyColor,
          borderColor: bodyColor
        }
      },
      createItems(h, item, index, fold = false) {
        let result = []

        // 判断是否传递 dot 具名插槽
        let dotSlot = this.$scopedSlots.dot && this.$scopedSlots.dot({
          item: item
        })

        // dot
        let dot = h('div', {
          class: [{
            'fold-box': fold
          }].concat(this.dotClasses(item)),
          on: {
            click: e => {
              e.stopPropagation()
              if (fold) this.handlerFold(e, item)
            }
          }
        }, dotSlot || [h('div', {
          class: this.innerDotClasses
        }, [h('i', {
          class: this.dotIconClasses(item)
        })])])

        // bodydotIconClasses
        let body = h('div', {
          class: this.bodyClasses,
          style: this.bodyStyle(item)
        }, this.$scopedSlots.default && this.$scopedSlots.default({
          item: item
        }))

        // opposite
        let opposite = h('div', {
          class: this.oppositeClasses
        }, this.$scopedSlots.opposite && this.$scopedSlots.opposite({
          item: item
        }))

        result = [dot, body, opposite]
        return result
      },
      // 折叠收起子节点
      handlerFold(e, item) {
        let _animateClass = this.filterParam(item && item[this.model.animateClass], this.animateClass) || []
        let dom = e.target.parentNode
        if (dom.tagName !== 'LI') {
          dom = dom.parentNode
        }
        const items = dom.parentNode.children
        let nextDOM = dom.nextElementSibling
        for (let i = 0; i < items.length; i++) {
          if (nextDOM && nextDOM.classList.contains('xdh-timeline-item--fold')) {
            nextDOM.classList.remove('animated', _animateClass[0], _animateClass[1])
            // 处理子集节点
            if (nextDOM.classList.contains('is-fold')) {
              nextDOM.classList.remove('is-fold')
              nextDOM.classList.add('animated', _animateClass[0])
              if (i === 0) {
                /**
                 * 节点折叠状态发生变化时触发
                 * @event on-state
                 * @property {Boolean} state true: 展开  false：折叠
                 */
                this.$emit('on-state', true)
              }
            } else {
              nextDOM.classList.add('is-fold')
              nextDOM.classList.add('animated', _animateClass[1])

              if (i === 0) {
                this.$emit('on-state', false)
              }
            }
            nextDOM = nextDOM.nextElementSibling
          } else {
            return false
          }
        }
      },
      createNodes(h, data) {
        let result = []
        // 遍历 数据项
        data.forEach((item, index) => {
          let foldTF = this.filterParam(item && item[this.model.fold], this.fold)
          result.push(h('li', {
            class: this.itemClasses(item),
            key: index
          }, this.createItems(h, item, index, foldTF || this.fold)))

          // 是否折叠处理
          let children = item[this.model.children]
          if (children) {
            children.forEach((item2, index2) => {
              let _animateClass = this.filterParam(item2 && item2[this.model.animateClass], this.animateClass) || []
              result.push(h('li', {
                class: [
                  'xdh-timeline-item--fold',
                  {
                    'is-fold': foldTF,
                    [`animated ${_animateClass[0]}`]: !foldTF
                  }
                ].concat(this.itemClasses(item2)),
                key: index + '-' + index2
              }, this.createItems(h, item2, index + '-' + index2, false)))
            })
          }
        })
        return result
      }
    },
    render(h) {
      return h(
        'ul',
        {
          class: [...this.classes],
          ref: 'itemBox'
        }, this.createNodes(h, this.data))
    }
  }
</script>
