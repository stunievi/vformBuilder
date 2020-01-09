<template>
  <div class="xdh-cropper-uploader">
    <i class="el-icon-plus avatar-uploader-icon"></i>
    <img v-if="value" class="xdh-cropper-uploader__img" :src="value">
    <input ref="input" :accept="accept" type="file" name="file" class="xdh-cropper-uploader__input" @change="handleChange">
  </div>
</template>

<script>
  export default {
    name: 'uploader',
    props: {
      value: {
        type: String
      },
      accept: {
        type: String,
        default: 'image/gif,image/png,image/jpg,image/jpeg'
      }
    },
    methods: {
      handleChange(e) {
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.onload = () => {
          this.$emit('on-change', file, reader.result)
          reader.onload = null
          this.$refs.input.value = ''
        }
        reader.readAsDataURL(file);
      }
    }
  }
</script>
