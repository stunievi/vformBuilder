<template>
    <div class="container">
        <xdh-form v-bind="config" :model="model" :fields="fields" :load="load" @submit="handleSubmit"></xdh-form>
    </div>
</template>

<script>
    import XdhForm from '@/widgets/xdh-form'
    // import FormMixin from '@/base/mixin/forms'
    // import AppFormMixin from '@/base/mixin/app-form'
    // import {LOCAL_STORAGE} from '@/config'
    // import {getForms} from '@/helper/storage'
    import {load} from '../../helper/setting/dict'

    export default {
        // mixins: [AppFormMixin],
        components: {
            XdhForm
        },
        data() {
            return {
                config: {},
                fields: [],
                load: load,
                type: this.$route.query.type
            }
        },
        computed: {
            model() {
                const m = {}
                this.fields.forEach(item => {
                    if (!item) return
                    // 分隔线组件无值
                    if (item.type !== 'divider') {
                        m[item.prop] = (item.props || {}).value || item.value
                    }
                })
                return m
            }
        },
        methods: {
            handleSubmit(model) {
                let url = this.type == "save"
                        ? "/app/insertFormDataByParentId"
                        : "/app/updateFormDataByParentId";
                let data = {
                    model: model,
                    id:this.$route.query.id,
                    config: this.config,
                    fields: this.fields
                }
                this.axios
                    .post(this.global.url + url, data)
                    .then(response => {
                        // dom根据formList长度判断是否为空
                        if (response.data.state != true) {
                            this.$message("保存表单信息失败");
                        } else {
                            this.$message({
                                message: "保存成功",
                                type: "success"
                            });
                            this.back();
                        }
                        // console.log(this.formList)
                    });
            },
            back(){
                this.$router.go(-1);//返回上一层
            }
        },
        created() {
            const id = this.$route.query.id
            if (id) {
                this.axios.post(this.global.url + "/app/getAppFormInfo", {
                    id: this.$route.query.id,
                    pId: this.$route.query.pId,
                    type: this.type
                }).then(res => {
                    if (res.data.state == true) {
                        console.log("res.data.data", res.data.data)
                        // 获取第一个的表单
                        this.config = res.data.data.config || {}
                        this.fields = res.data.data.fields || []
                    } else {
                        this.$message(res.data.message)
                    }
                })
            }
            // const id = this.$route.params.id
            // if (id) {
            //   this.getAppForm(id).then(res => {
            //     // this.config = res.config || {}
            //     // this.fields = res.fields || []
            //   })
            // }
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        padding: 20px;
    }
</style>
