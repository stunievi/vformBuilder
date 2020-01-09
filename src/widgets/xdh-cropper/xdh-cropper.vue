<template>
  <div class="xdh-cropper" :style="styles">
    <uploader :value="value" @on-change="handleUploaderChange"></uploader>
    <xdh-dialog title="裁剪"
                :closed.sync="dialogClosed"
                draggable
                width="500px"
                height="400px">
      <cropper ref="cropper" :src="img" :options="options"></cropper>
      <template slot="footer">
        <el-button type="default" size="medium" @click="handleCancel">取消</el-button>
        <el-button type="primary" size="medium" @click="handleCrop">确定</el-button>
      </template>
    </xdh-dialog>
  </div>
</template>

<script>
  /**
   * 图片裁剪组件
   * @module widgets/xdh-cropper
   */

  import Uploader from './components/uploader'
  import Cropper from './components/cropper'
  import XdhDialog from '@/widgets/xdh-dialog'


  export default {
    name: 'XdhCropper',
    components: {
      Uploader,
      XdhDialog,
      Cropper
    },
    /**
     * 属性参数
     * @property {number} [width=150] 图片裁剪宽度
     * @property {number} [height=150] 图片裁剪高度
     * @property {string} [value] 图片资源或url
     * @property {string} [options] Cropper实例化参数
     */
    props: {
      // 宽度
      width: {
        type: Number,
        default: 150
      },
      // 高度
      height: {
        type: Number,
        default: 150
      },
      // 图片值
      value: {
        type: String
      },
      // Cropper 配置
      options: {
        type: Object
      }
    },
    data() {
      return {
        dialogClosed: true,
        img: null
      }
    },
    computed: {
      styles() {
        return {
          width: `${this.width}px`,
          height: `${this.height}px`
        }
      }
    },
    methods: {
      handleCancel() {
        this.dialogClosed = true
      },
      handleUploaderChange(file, src) {
        this.dialogClosed = false
        this.img = src;
      },
      handleCrop() {
        const cropper = this.$refs.cropper.instance
        const file = cropper.getCroppedCanvas({
          width: this.width,
          height: this.height,
          imageSmoothingEnabled: false,
          imageSmoothingQuality: 'high'
        }).toDataURL();
        this.dialogClosed = true
        this.$emit('input', file)
        /**
         * 裁剪完成时触发
         * @event on-crop
         * @param {string} file 图片base64
         */
        this.$emit('on-crop', file)
      }
    }
  }
</script>
