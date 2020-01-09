<template>
    <el-input v-model="value" :rows="data.rows" type="textarea" class="v" :placeholder="data.hint"/>
</template>
<script>
    export default {
        props:["data"],
        data(){
            return {
                value:""
            }
        },
        created() {
            this.data = this.data||{};
             this.value = this.data.value || ""
        }
    }

</script>
<style scoped>

</style>
