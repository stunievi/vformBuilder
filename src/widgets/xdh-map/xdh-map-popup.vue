<template>
  <xdh-window class="xdh-map-popup" :closable="false" :title="title" shadow inline>
    <template slot="tools">
      <i class="el-icon-close" @click="handleClose"></i>
    </template>
    <slot>{{content}}</slot>
    <slot name="footer" slot="footer"></slot>
  </xdh-window>

</template>

<script>
  import XdhWindow from '../xdh-window'

  export default {
    name: 'popup',
    components: {
      XdhWindow
    },
    props: {
      ol: {
        type: Object,
        required: true
      },
      title: {
        type: String,
        default: '位置'
      },
      position: {
        type: Array
      },
      content: {
        type: String
      },
      closable: {
        type: Boolean,
        default: true
      },
      options: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        popup: null
      }
    },
    watch: {
      position(val) {
        this.popup && this.popup.setPosition(val)
      },
      options: {
        deep: true,
        handler(val) {
          if (val && val.offset && this.popup) {
            this.popup.setOffset(val.offset)
          }
        }
      }
    },
    methods: {
      handleClose() {
        this.popup.setPosition(null)
        this.$emit('on-close')
      }
    },
    mounted() {
      this.popup = this.ol.popup(this.$el, {stopEvent: true, ...this.options})
    }
  }
</script>

