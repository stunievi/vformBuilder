/**
 *  高阶组件的构建方法
 *  @module utils/hoc
 */


/**
 * 高阶组件的构建方法
 * 在源组件的基础上，扩展功能，保持源组件的 props、event 以及 slots 不变
 * @param {VueComponent} Component 源Vue组件
 * @param {object} options 扩展功能选项
 * @return {*} 新组件
 */
export default function (Component, options = {}) {
  return {
    mixins: [options],
    props: Component.props,
    render(h) {
      const slots = Object.keys(this.$slots)
        .reduce((arr, key) => arr.concat(this.$slots[key]), [])
        .map(vnode => {
          vnode.context = this._self
          return vnode
        })
      
      return h(Component, {
        on: this.$listeners,
        props: this.$props,
        // 透传 scopedSlots
        scopedSlots: this.$scopedSlots,
        attrs: this.$attrs
      }, slots)
    }
  }
}
