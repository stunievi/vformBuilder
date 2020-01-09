import template from 'lodash/template'

export default template(`
<template>
  <xdh-form :model="model" :fields="fields" v-bind="config" ></xdh-form>
</template>

<script>
  import XdhForm from '@/widgets/xdh-form'
  const config = <%=config%>
  const fields = <%=fields%>
  export default {
    components: {
      XdhForm
    },
    data() {
      return {
        config: config,
        fields: fields,
        model: <%=model%>
      }
    }
  }
</script>

<style lang="scss" scoped></style>
`)
