<template>
  <div>
      <h3>
          {{info.title}}:
      </h3>
  </div>
</template>

<script>
export default {
  name : 'vtitle',
  props: {
    info: Object
  },
  data(){
    return {
      value: '123'
    }
      
  },
  render:(h)=>{
      return h("h3","title")
  }
}
</script>

<style>

</style>