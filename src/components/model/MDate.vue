<template>
    <el-date-picker
            v-model="value"
            type="date"
            :placeholder="data.hint">
    </el-date-picker>
</template>
<script>
    export default {
        props:["data"],
        data(){
            return {
                value:""
            }
        }
    }
</script>