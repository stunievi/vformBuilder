import ElTimeSelect from 'element-ui/lib/time-select'

export default {
  picker: Boolean,
  start: String,
  end: String,
  step: String,
  minTime: String,
  maxTime: String,
  selectableRange: [String, Array],
  ...ElTimeSelect.mixins[0].props,
  ...ElTimeSelect.props
}
