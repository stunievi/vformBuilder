<template>
  <span class="xdh-tabs__tools">
    <slot></slot>
  </span>
</template>

<script>
  export default {
    name: 'TabsTool',
    methods: {
      insertDom() {
        const target = this.$parent.$refs.nav.$el
        const parent = target.parentNode
        parent.insertBefore(this.$el, target)
      },
      removeDom() {
        this.$el.parentNode.removeChild(this.$el)
      }
    },
    mounted() {
      this.insertDom()
    },
    beforeDestroy() {
      this.removeDom()
    }
  }
</script>
