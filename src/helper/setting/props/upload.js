import ElUpload from 'element-ui/lib/upload'

export default {
  ...ElUpload.props,
  uploadText: {
    type: String,
    default: '点击上传'
  },
  selectText: {
    type: String,
    default: '选取文件'
  },
  submitText: {
    type: String,
    default: '上传到服务器'
  },
  tipText: {
    type: String,
    default: '只能上传jpg/png文件，且不超过500kb'
  },
  size: String
}
