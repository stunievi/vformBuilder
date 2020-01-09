<template>
<div :id="`xdh-async-img--${id}`" class="xdh-async-img" :style="{'backgroundImage': `url(${url})`}">
  <!--  -->
</div>
 
</template>

<style lang="scss" scoped>
.xdh-async-img{
  background: no-repeat;
  background-size: contain;
  background-position: center center;
  // background-clip: content-box;
}
</style>

<script>
  /**
   * XdhAsyncImg
   * @module widgets/xdh-async-img
   */
  export default {
    name: 'xdhAsyncImg',
    components: {
    },
    /**
     * 属性参数
     * @member
     * @property {String} id 图片获取id
     * @property {String} action store 中对应获取图片的action type
     * @property {String} default 自定义pending 图片
     * @property {Boolean} lazy 是否使用懒加载
     */
    props: {
      id: {
        type: String,
        default: ''
      },
      action: {
        type: String,
        default: 'GET_ASYNC_IMAGE'
      },
      default: {
        type: String,
        default: require('./default.jpg')
      },
      lazy: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isLoaded: false,
        isLoading: false,
        url: this.default,
        scrollParent: null,
        visitHeight: 0
      }
    },
    computed: {

    },
    watch: {
    },
    methods: {
      findScrollParent(el) {
        let obj = el
        while(obj.tagName !== 'BODY' && window.getComputedStyle(obj, null).overflow !== 'auto') {
          obj = obj.parentNode
        }
        return obj
      },
      loadImg() {
        if (!this.isLoaded && !this.isLoading) {
          this.isLoading = true
          this.$store.dispatch(this.action, {
            data: {id: this.id}
          }).then((res) => {
            this.isLoaded = true
            this.isLoading = false
            if (res.url) {
              this.url = res.url
            }
          })
        }
      }
    },
    mounted() {
      this.scrollParent = this.findScrollParent(this.$el)
      this.visitHeight = this.scrollParent.offsetHeight
      if (this.$el.getBoundingClientRect().top - this.scrollParent.offsetTop <= this.visitHeight + 20 || !this.lazy) {
        this.loadImg()
      }
      
      
      this.scrollParent && this.scrollParent.addEventListener('scroll', (e) => {
        if (this.lazy) {
          if (this.$el.getBoundingClientRect().top - this.scrollParent.offsetTop <= this.visitHeight + 20) {
            this.loadImg()
          }
        }
      })  
    }
  }
</script>

