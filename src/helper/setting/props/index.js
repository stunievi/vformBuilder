import input from './input'
import radio from './radio'
import checkbox from './checkbox'
import switchItem from './switch'
import select from './select'
import date from './date'
import time from './time'
import cascader from './cascader'
import divider from './divider'
import number from './number'
import rate from './rate'
import slider from './slider'
import upload from './upload'
import range from './range'
import tag from './tag'
import inputTag from './input-tag'
import color from './color'
import editor from './editor'
import tree from './tree'

const map = {
  input,
  radio,
  checkbox,
  switch: switchItem,
  select,
  date,
  time,
  cascader,
  divider,
  number,
  rate,
  slider,
  upload,
  range,
  tag,
  inputTag,
  color,
  editor,
  tree
}


function getConfig(props) {
  const result = []
  
  Object.keys(props).forEach(key => {
    
    
    let prop = props[key]
    // {}
    // {required:true}
    // {type: Number}
    // {type: [Number]}
    // [Number]
    // Number
    if (!prop.type) {
      const types = [Number, String, Boolean, Object, Function, Array]
      prop = {
        type: Array.isArray(prop) ? prop : (types.includes(prop) ? prop : String)
      }
    }
    prop.type = Array.isArray(prop.type) ? prop.type : [prop.type]
    if (prop.type.includes(String)) {
      result.push({
        label: key,
        prop: key,
        type: 'input'
      })
    } else if (prop.type.includes(Number)) {
      result.push({
        label: key,
        prop: key,
        type: 'number',
        props: {
          controlsPosition: 'right'
        }
      })
    } else if (prop.type.includes(Boolean)) {
      result.push({
        label: key,
        prop: key,
        type: 'switch',
        props: {}
        
      })
    } else if (prop.type.includes('select')) {
      result.push({
        label: key,
        prop: key,
        type: 'select',
        options: prop.options
      })
    } else if (key === 'value' && prop.type.includes(Array)) {
      result.push({
        label: key,
        prop: key,
        type: 'inputTag',
        props: {}
      })
    }
  })
  return result
}


function transform(map) {
  const result = {}
  Object.keys(map).forEach(key => {
    result[key] = getConfig(map[key])
  })
  return result
}

export default transform(map)
