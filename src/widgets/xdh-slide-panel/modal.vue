<template>
  <div class="xdh-slide-panel__modal"></div>
</template>

<script>
  export default {
    mounted() {
      document.body.appendChild(this.$el)
    },
    beforeDestroy() {
      if (this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el)
      }
    }
  }
</script>
