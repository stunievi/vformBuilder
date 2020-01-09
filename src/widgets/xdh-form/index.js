import Form from './xdh-form.vue'

import FormItem from './xdh-form-item'
import FormArray from './xdh-form-array'
import FormObject from './xdh-form-object'
import FormGroup from './xdh-form-group'
import FormDivider from './xdh-form-divider'

Form.install = function (Vue) {
  Vue.component(Form.name, Form)
}

export default Form


export const XdhForm = Form
export const XdhFormItem = FormItem
export const XdhFormArray = FormArray
export const XdhFormObject = FormObject
export const XdhFormGroup = FormGroup
export const XdhFormDivider = FormDivider

