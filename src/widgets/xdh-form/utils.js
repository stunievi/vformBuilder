export function toCame(str) {
  const r = /-[\w]?/g
  const arr = str.match(r) || []
  arr.forEach(n => {
    const w = n.split('')[1].toUpperCase()
    str = str.replace(n, w)
  })
  return str
}

export function clean(obj) {
  const result = {}
  Object.keys(obj).forEach(k => {
    const val = obj[k]
    if (typeof val !== 'undefined' && val !== '') {
      result[toCame(k)] = val
    }
  })
  return result
}

export function normalOptions(options = []) {
  return options.map(o => {
    return typeof o === 'object' ? o : {
      label: o,
      value: o
    }
  })
}


export function getParent() {
  const names = ['XdhForm', 'XdhFormObject', 'XdhFormArray']
  let parent = this.$parent
  while (parent && !names.includes(parent.$options.name)) {
    parent = parent.$parent
  }
  return parent
}

export function getParentGroup() {
  const names = ['XdhForm', 'XdhFormGroup', 'XdhFormObject', 'XdhFormArray']
  let parent = this.$parent
  while (parent && !names.includes(parent.$options.name)) {
    parent = parent.$parent
  }
  return parent
}


export function getExtendAttrs() {
  const parent = getParentGroup.call(this)
  return {
    ...clean(parent.extendAttrs || {}),
    ...clean(this.$props),
    ...clean(this.$attrs)
  }
  
}
