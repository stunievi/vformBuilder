<template>
  <div class="xdh-form-divider">
    <el-divider direction="horizontal" :content-position="contentPosition">
      <slot>
        <i v-if="icon" :class="icon"></i>
        {{content}}
      </slot>
    </el-divider>
    <slot name="body"></slot>
  </div>
</template>

<script>
  export default {
    props: {
      icon: String,
      contentPosition: {
        type: String,
        default: 'center',
        validator(val) {
          return ['left', 'right', 'center'].includes(val)
        }
      },
      content: {
        type: String,
        default: ''
      }
    }
  }
</script>
