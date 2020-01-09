import ElDatePicker from 'element-ui/lib/date-picker'

export default {
  ...ElDatePicker.mixins[0].props,
  ...ElDatePicker.props
}
