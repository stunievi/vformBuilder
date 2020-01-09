import ElDatePicker from 'element-ui/lib/date-picker'

export default {
  ...ElDatePicker.mixins[0].props,
  ...ElDatePicker.props,
  dataType: {
    type: 'select',
    default: 'text',
    options: ['number', 'date', 'time', 'text', 'timePicker']
  },
  minPlaceholder: {
    type: String,
    default: '最小值'
  },
  maxPlaceholder: {
    type: String,
    default: '最大值'
  },
  separator: {
    type: String,
    default: '-'
  },
  separatorWidth: {
    type: [Number, String],
    default: 12
  },
  value: {
    type: Array
  }
}
