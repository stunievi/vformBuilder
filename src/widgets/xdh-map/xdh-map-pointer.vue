<template>
  <div class="xdh-map-pointer">
    <span>{{loc.join(', ')}}</span>
    <el-button type="text" icon="iconfont icon-copy"></el-button>
    <el-button type="text" icon="iconfont icon-recall"></el-button>
  </div>
</template>

<script>
  export default {
    name: 'XdhMapPointer',
    props: {
      // 显示位置：lt:左上, lb:左下， rt:右上，rb:右下
      placement: {
        type: String,
        validator(val) {
          return ['lb', 'lt', 'rt', 'rb'].includes(val)
        },
        default: 'lb'
      }
    },
    data() {
      return {
        loc: []
      }
    },
    mounted() {
    }
  }
</script>

<style lang="scss" scoped>
  .xdh-map-pointer {
    position: absolute;
    height: 30px;
    background: rgba(0, 0, 0, 0.8);
    z-index: 3000;
    bottom: 0;
    left: 0;
    color: #fff;
  }
</style>
