<template>
  <div>
      <h3>
          {{title}}
      </h3>
  </div>
</template>

<script>
export default {
  name : 'vtitle',
  props: {
    title: String
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