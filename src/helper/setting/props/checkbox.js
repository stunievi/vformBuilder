import ElCheckboxGroup from 'element-ui/lib/checkbox-group'

export default {
  button: Boolean,
  ...ElCheckboxGroup.props,
  value: Array
}
