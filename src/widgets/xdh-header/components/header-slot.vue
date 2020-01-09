<script>
  export default {
    render(h) {
      return (
        this.$parent.$slots.default
          ? this.$parent.$slots.default[0]
          : ''
      );
    }
  }
</script>

