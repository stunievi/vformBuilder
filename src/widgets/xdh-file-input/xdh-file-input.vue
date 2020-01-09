<template>
  <div :class="`xdh-file-input ${upload?'is-upload':''}`">
    <el-input :size="size" v-model="name" class="xdh-file-input__input" :placeholder="placeholder">
      <template slot="prepend">
        <input class="xdh-file-input__file" type="file" @change="fileChange" ref="file" :multiple="multiple" :accept="accept"/>
      </template>
      <template slot="append">
        <el-button class="xdh-file-input__browse">浏览</el-button>
      </template>
    </el-input>
    <el-button v-if="upload" class="xdh-file-input__upload" type="info" @click="handleUpload">上传</el-button>
  </div>
</template>

<script>
  export default {
    name: 'XdhFileInput',
    /**
     * 属性参数
     * @member props
     * @property {String}  value 绑定值
     * @property {String}  accept 上传的文件类型
     * @property {Boolean} [multiple = false] 同时选择多个文件
     * @property {String}  size 输入框尺寸, 可选:medium / small / mini
     * @property {String}  [placeholder = '未选择任何文件'] 输入框占位文本
     * @property {Boolean}  [upload = false] 显示上传按钮
     */
    props: {
      value: {
        type: String,
        default: ''
      },
      accept: {
        type: String,
        default: ''
      },
      multiple: {
        type: Boolean,
        default: false
      },
      size: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: '未选择任何文件'
      },
      upload: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        files: null,
        name: ''
      }
    },
    watch: {},
    methods: {
      fileChange(file) {
        this.files = file.target.files
        this.name = ''
        if (this.files && this.files.length) {
          for (let i = 0; i < this.files.length; i++) {
            if (i !== 0) this.name += '，'
            this.name += this.files[i].name
          }
        }
        this.$emit('input', this.name)
        /**
         * 上传文件变化
         * @event on-change
         * @property {Object} files 上传的文件数据对象
         */
        this.$emit('on-change', this.files, file)
      },
      handleUpload() {
        /**
         * 开始上传
         * @event on-upload
         * @property {Object} files 上传的文件数据对象
         */
        this.$emit('on-upload', this.files)
      }
    },
    mounted() {
      if (this.value) this.name = this.value
    }
  }
</script>

