export default {
  // 内容
  value: {
    type: String,
    default: ''
  },
  // simple classic  document
  toolbar: {
    type: [String, Array],
    default: 'classic'
  },
  // 高度
  height: {
    type: String
  },
  readonly: {
    type: Boolean,
    default: false
  }
}
