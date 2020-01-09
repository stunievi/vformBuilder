<template>
  <div class="xdh-cropper-core">
    <img :src="src" ref="img">
  </div>
</template>

<script>
  import Cropper from 'cropperjs'
  import 'cropperjs/dist/cropper.min.css'

  export default {
    name: 'cropper',
    props: {
      src: {
        type: String
      },
      options: {
        type: Object
      }
    },
    data() {
      return {
        instance: null,
        listeners: []
      }
    },
    methods: {
      bind() {
        const img = this.$refs.img
        Object.keys(this.$listeners).forEach(name => {
          const listener = e => this.$emit(name, e, this.instance)
          img.addEventListener(name, listener, false)
          this.listeners.push({
            name: name,
            listener: listener
          })
        })
      },
      unbind() {
        const img = this.$refs.img
        this.listeners.forEach(item => {
          img.addEventListener(item.name, item.listener, false)
        })
      }
    },
    mounted() {
      this.instance = new Cropper(this.$refs.img, {
        aspectRatio: 1,
        ...this.options
      })
      this.bind()
    },
    beforeDestroy() {
      this.unbind()
      this.instance && this.instance.destroy()
    }
  }
</script>
