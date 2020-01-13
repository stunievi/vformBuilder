<template>
    <div style="    height: 100%;">

        <el-main>
            <el-scrollbar style="height:100%">
                <div style="width:1000px">
                    <el-button type="primary" @click="newData">
                        新建
                        <i class="el-icon-upload el-icon--right"></i>
                    </el-button>


                    <el-dialog
                            title="新建办公用品库"
                            :visible.sync="dialogVisible"
                            width="40%"
                            :before-close="reset">

                        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                            <el-form-item label="办公用品库名称" prop="name">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                            <el-form-item label="存放地点" prop="address">
                                <el-input v-model="form.address"></el-input>
                            </el-form-item>
                            <el-form-item label="备注" prop="desc">
                                <el-input v-model="form.desc"></el-input>
                            </el-form-item>
                        </el-form>

                        <span slot="footer" class="dialog-footer">
                            <el-button @click="resetForm()">取 消</el-button>
                            <el-button type="primary" @click="submitForm('form')">保存</el-button>
                        </span>
                    </el-dialog>

                    <el-table :data="tableData" border style="width: auto;" height="300">

                        <el-table-column
                                v-for="(value,key) in list"
                                :key="key"
                                :prop="value.field"
                                :label="value.name"
                        />
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.row ,scope.row)" type="text" size="small">编辑
                                </el-button>
                                <el-button
                                        @click.native.prevent="deleteRow(scope.$index, tableData,scope.row)"
                                        type="text"
                                        size="small"
                                >移除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-scrollbar>
        </el-main>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                rules: {
                    name: [
                        {required: true, message: '请填写名称', trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: '请填写存放地点', trigger: 'blur'}
                    ]
                },
                form: {
                    name: '',
                    address: '',
                    desc: ''
                },
                dialogVisible: false,
                value: "123",
                name: "",
                formList: [],
                list: [
                    {name: "办公用品库名称", "field": "name"},
                    {name: "存放地点", "field": "address"},
                    {name: "备注", "field": "desc"}
                ],
                item: {},
                tableData: [
                    // {办公用品库名称: "张三", 存放地点: "20"}
                ],
                id: '',
                type: 'fenlei',
                //设置编辑添加状态
                saveOrEdit: false
            };
        },
        mounted: function () {
            // 调用更新formlist
            this.getFormDataList()
            // this.getFormInfo();
        },
        methods: {
            sure: function () {
                this.dialogVisible = false;
                console.log(this.global);
                this.axios
                    .post(this.global.url + "/app/newAppForm", {
                        name: this.name,
                        parentId: "5e01bfa7d8725a121fcbc234"
                    })
                    .then(response => {
                        if (response.data.state == false) {
                            this.$message(response.data.message);
                        }
                        // 清空
                        this.name = "";
                        // 调用更新formlist
                        this.getFormLit();
                    });
            },
            resetForm() {
                this.dialogVisible = false
                this.reset()
            },
            tiaoAjax(formName){

                if (this.saveOrEdit) {
                    this.axios
                        .post(this.global.url + "/app/updateFormData", {
                            id: this.id,
                            type: this.type,
                            model: this.$refs[formName].model
                        })
                        .then(response => {
                            // dom根据formList长度判断是否为空
                            if (response.data.state == true) {
                                this.dialogVisible = false
                                this.getFormDataList()
                                this.$message({
                                    message: "修改成功",
                                    type: "success"
                                });
                            } else {
                                this.$message({message: "保存失败"});
                            }

                        });
                    this.saveOrEdit = false
                    this.reset();
                    return
                }
                this.axios
                    .post(this.global.url + "/app/addFromData", {
                        type: this.type,
                        model: this.$refs[formName].model
                    })
                    .then(response => {
                        // dom根据formList长度判断是否为空
                        if (response.data.state == true) {
                            this.dialogVisible = false
                            this.getFormDataList()
                            this.$message({
                                message: "保存成功",
                                type: "success"
                            });
                        } else {
                            this.$message({message: "保存失败"});
                        }
                        this.reset();
                    });
            },
            submitForm(formName) {

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.tiaoAjax(formName)
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });



            },
            getFormDataList: function () {

                this.axios
                    .post(this.global.url + "/app/getFromDataList", {
                        type: this.type
                    })
                    .then(response => {
                        // dom根据formList长度判断是否为空
                        if (response.data.state == true) {
                            this.tableData = []
                            response.data.data.forEach(e => {
                                e.model.id = e.id
                                console.log('eeeee', e.model)
                                this.tableData.push(e.model)
                            })
                        } else {
                            this.$message(response.data.message)
                        }

                    });
            },
            handleClick(row, obj) {
                this.id = obj.id
                console.log("objobj", obj)
                this.form = JSON.parse(JSON.stringify(row))
                this.saveOrEdit = true
                this.dialogVisible = true
            },
            reset() {
                this.form = {
                    name: '',
                    address: '',
                    desc: ''
                }
                this.dialogVisible = false
            },
            deleteRow(index, rows, obj) {
                console.log('objobj', obj)
                this.axios
                    .post(this.global.url + "/app/deleteFormDataById", {
                        id: obj.id,
                        type: this.type
                    })
                    .then(response => {
                        if (response.data.state == true) {
                            this.getFormDataList()
                            console.log('xxx')
                            rows.splice(index, 1);
                            this.$message({
                                message: "移除成功",
                                type: "success"
                            });
                        } else {
                            this.$message(response.data.message);
                        }
                    });
            },
            getFormInfo: function () {
                this.axios
                    .post(this.global.url + "/app/getAppFormInfo", {
                        id: "5e042f21b72b5056ca27e842"
                    })
                    .then(response => {
                        if (response.data.state == true) {
                            console.log(response.data.data)
                            this.list = response.data.data.formData
                            this.getFormData();
                        } else {
                            this.$message(response.data.message);
                        }

                    });
            },
            getFormData: function () {
                this.axios
                    .post(this.global.url + "/app/getFormData", {
                        id: "5e042ecfb72b5056ca27e841"
                    })
                    .then(response => {
                        if (response.data.state == true) {
                            let data = response.data.data;
                            let FormDataList = new Array();
                            data.forEach(element => {
                                element.formData.id = element.id;
                                FormDataList.push(element.formData);
                            });
                            this.tableData = FormDataList;
                        } else {
                            this.$message(response.data.message);
                        }
                    });
            },
            enterForm: function (list) {
                console.log(list);
                // this.item = list
                // this.$router.push({path:"/designApp/newApplication",query:{id:list.id}})
            },
            enterNewForm: function () {
                this.$router.push({path: "/designApp/design"});
            },
            newData: function () {
                this.dialogVisible = true
            },
            log: function () {
                console.log(this.list);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .el-form-item {
        width: 90%;
    }

    .newapp {
        border: 1px solid #5da6ff;
        width: 200px;
        height: 150px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 5px;
        cursor: pointer;

        .text {
            color: #5da6ff;
            font-size: 1.2rem;
        }

        .icon {
            font-size: 1.5rem;
        }
    }

    .form-list {
        list-style: none;
        padding: 0;
        font-size: 0.8rem;
        margin: 0;

        li {
            padding: 10px;
            border: 1px solid rgb(240, 240, 240);
            border-radius: 5px;
            margin: 2px 2px 0px 2px;
            cursor: pointer;
        }
    }
</style>