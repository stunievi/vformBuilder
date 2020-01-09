<template>
  <div class="xdh-header__nav">
    <slot>
      <xdh-menu mode="horizontal"
                :data="data"
                popper-class="xdh-header__popper"
                :props="props"
                :router="router"
                :default-active="defaultActive"
                @select="handleSelect"></xdh-menu>
    </slot>
  </div>
</template>

<script>
  import XdhMenu from '../../xdh-menu'

  export default {
    components: {
      XdhMenu
    },
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      },
      props: Object,
      router: Boolean,
      defaultActive: String
    },
    methods: {
      handleSelect(index, indexPath) {
        this.$emit('select', index, indexPath)
      }
    }
  }
</script>
