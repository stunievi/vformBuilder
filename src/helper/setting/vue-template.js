import template from 'lodash/template'


export default template(`
<template>
  <xdh-form :model="model" <%=bindProps(formModel)%>>
<%fieldsArray.forEach(function(item) { %>
   <xdh-form-item <%=bindProps(item)%>></xdh-form-item>
<%})%>
  </xdh-form>
</template>

<script>
  import XdhForm from '@/widgets/xdh-form'
  import XdhFormItem from '@/widgets/xdh-form/xdh-form-item'
  
  export default {
    components: {
      XdhForm,
      XdhFormItem
    },
    data() {
      return {
        model: <%=model%>
      }
    }
  }
</script>
`)
