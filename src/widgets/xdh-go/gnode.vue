
<script>
/**
 *     diagram.nodeTemplate =
        $(go.Node, "Auto",  // the Shape automatically fits around the TextBlock
          $(go.Shape, "RoundedRectangle",  // use this kind of figure for the Shape
            // bind Shape.fill to Node.data.color
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { margin: 3 },  // some room around the text
            // bind TextBlock.text to Node.data.key
            new go.Binding("text", "key"))
        );
 */
import go from 'gojs'
let $ = go.GraphObject.make
export default {
  components: {},
  props: {
    mapKey: String,
    gtype: {
      type: [Object, Function],
      default() {
        return go.Node
      }
    },
    gname: {
      type: String
    },
    gparam: {
      type: Object
    }
  },
  data() {
    return {
      go,
      template: null,
      refs: {}
    }
  },
  render(h) {
    return h('div', { style: { display: 'none' } }, this.$slots.default)
  },
  computed: {},
  methods: {
    // 获取节点或节点片段
    getTemplate() {
      let vm = this
      if (!vm.$options || !vm.$options.propsData) {
        return
      }
      let propsData = vm.$options.propsData
      let attrs = vm.$attrs
      let params = []
      propsData['gtype'] && params.push(propsData['gtype'])
      propsData['gname'] && params.push(propsData['gname'])
      propsData['gparam'] && params.push({ ...propsData['gparam'] })
      for (let i in attrs) {
        let p = attrs[i]
        if (typeof p === 'string') {
          params.push(new go.Binding(i, p))
        } else if (typeof p === 'object') {
          let bindParam = []
          bindParam.push(i)
          if (!p['target']) {
            bindParam.push(i)
          } else {
            bindParam.push(p['target'])
          }
          p['parse'] && bindParam.push(p['parse'])
          let bind
          if (!p['fun']) {
            bind = new go.Binding(...bindParam)
          } else {
            let funName = p['fun'][0]
            let funArgs = p['fun'][1] || []
            bind = new go.Binding(...bindParam)[funName](...funArgs)
          }
          params.push(bind)
        }
      }
      let children = vm.$children
      let nodes = []
      if (children && children.length !== 0) {
        children.forEach(node => {
          let n = node.getTemplate()
          nodes.push(n)
        })
      }
      let gnode = $(...params, ...nodes)
      this.template = gnode
      return gnode
    }
  },
  mounted() {
    this.getTemplate()
  }
}
</script>
<style type="text/scss" lang="scss" scoped>
</style>