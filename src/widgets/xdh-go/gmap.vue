
<script>
import go from 'gojs'
export default {
  components: {},
  props: {
    keyType: {
      type: String
    },
    valueType: {
      type: [Object, String, Function]
    }
  },
  render(h) {
    return h('div', { style: { display: 'none' } }, this.$slots.default)
  },
  data() {
    return {
      go
    }
  },
  computed: {
    mapParam() {
      let param = []
      this.keyType && param.push(this.keyType)
      this.valueType && param.push(this.valueType)
      return param
    }
  },
  methods: {
    getMap() {
      let map = new go.Map(...this.mapParam)
      let children = this.$children
      // 添加节点模板
      children.forEach(r => {
        if (r.$options && r.$options.propsData.mapKey !== undefined) {
          map.add(r.$options.propsData.mapKey, r.getTemplate())
        }
        console.log(r.$options.propsData.mapKey, r.getTemplate());
      })
      return map
    }
  },
  created() {}
}
</script>
<style type="text/scss" lang="scss" scoped>
</style>