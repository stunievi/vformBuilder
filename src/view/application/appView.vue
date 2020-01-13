<template>
    <div style="    height: 100%;">
        <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
        <!-- <form-create v-model="fApi" :rule="rule" :option="option"></form-create> -->
        <el-container style=" border: 1px solid #eee;height:100%">
            <el-scrollbar>
                <div style="height:100%;width:200px;border:1px solid rgb(241, 241, 241)">
                    <div style="background-color: rgb(241, 241, 241);height:30px">
                        <span style="line-height:30px;    font-size: .8rem;">表单列表</span>
                    </div>
                    <div v-if="formList.length == 0">
                        <span style="font-size: .8rem;">列表为空</span>
                    </div>
                    <div v-else>
                        <div>
                            <ul class="form-list">
                                <!-- <li @click="enterNewForm()">新版设计应用</li> -->
                                <li
                                        v-for="(list,item) in formList"
                                        :key="item"
                                        @click="enterForm(list)"
                                >{{list.title}}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
            <el-container>
                <el-main>
                    <el-scrollbar style="height:100%">
                        <div style="width:100%">
                            <el-button type="primary" @click="newData">
                                新建
                                <i class="el-icon-upload el-icon--right"></i>
                            </el-button>

                            <el-table
                                    :data="tableData"
                                    border
                                    style="width: 100%">
                                <el-table-column
                                        v-for="(value,key) in list"
                                        :key="key"
                                        :prop="value.name"
                                        :label="value.name">
                                </el-table-column>
                                <el-table-column label="操作" width="100" v-show="formList.length">
                                    <template slot-scope="scope">
                                        <el-button @click="handleClick(scope.row)" type="text" size="small">编辑
                                        </el-button>
                                        <el-button
                                                @click.native.prevent="deleteRow(scope.$index, tableData,scope.row)"
                                                type="text"
                                                size="small"
                                        >移除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-scrollbar>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    // import formBuilder from "../../function/core.js";
    export default {
        name: "vtitle",
        data() {
            return {
                dialogVisible: false,
                value: "123",
                name: "",
                formList: [],
                list: [],
                item: {},
                tableData: [
                    // {
                    //   goods_name: "张三",
                    //   BXFV7AYV: "20",
                    //   D_538PJN: "男",
                    //   ZPEADZ8X: "研发部",
                    //   W_JWCGLX: "工程师"
                    // }
                ]
            };
        },
        components: {
            //   formBuilder
        },
        mounted: function () {
            // 调用更新formlist
            this.getFormLite();
            this.getFormInfo();
        },
        methods: {
            sure: function () {
                this.dialogVisible = false;
                console.log(this.global);
                this.axios
                    .post(this.global.url + "/app/newAppForm", {
                        name: this.name,
                        parentId: this.$route.query.id
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
            getFormLite: function () {
                this.axios
                    .post(this.global.url + "/app/getAppForm", {
                        id: this.$route.query.id
                    })
                    .then(response => {
                        // dom根据formList长度判断是否为空
                        if (response.data.state == true) {
                            console.log("response.data.data", response.data.data)
                            this.formList = response.data.data;
                        }
                    });
            },
            getFormInfo: function () {
                this.axios
                    .post(this.global.url + "/app/getAppFormInfo", {
                        id: this.$route.query.item
                    })
                    .then(response => {
                        if (response.data.state == true) {
                            this.list = response.data.data.formDataList
                            this.getFormData();
                        } else {
                            this.$message(response.data.message);
                        }
                    });
            },
            getFormData: function () {
                this.axios
                    .post(this.global.url + "/app/getFormData", {
                        id: this.$route.query.item
                    })
                    .then(response => {
                        if (response.data.state == true) {
                            let data = response.data.data;
                            let FormDataList = new Array();
                            data.forEach(element => {
                                element.formData.id = element.id;
                                FormDataList.push(element.formData);
                            });

                            // let data = response.data.data;
                            // let FormDataList = new Array();
                            // data.forEach(element => {
                            //   FormDataList.push(element.formData);
                            // });

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
                this.$router.push({path: "/preview", query: {id: this.$route.query.item, type: "save"}})
                // this.$router.push({
                //     path: "/appView/testData",
                //     query: {id: this.$route.query.item, type: "save"}
                // });
            },
            handleClick(row) {
                this.$router.push({path: "/preview", query: {id: row.id, pId: this.$route.query.item, type: "edit"}})
                // this.$router.push({
                //     path: "/appView/testData",
                //     query: {id: row.id, type: "edit"}
                // });
            },
            deleteRow(index, rows, obj) {
                rows.splice(index, 1);
                this.axios
                    .post(this.global.url + "/app/deleteFormDataById", {
                        id: obj.id
                    })
                    .then(response => {
                        if (response.data.state == true) {
                            //   console.log(response.data.data.formData)
                            //   this.list = response.data.data.formListData
                            this.getFormData();
                        } else {
                            this.$message(response.data.message);
                        }
                    });
            },
            log: function () {
                console.log(this.list);
            }
        }
    };
</script>

<style lang="scss" scoped>
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