(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2b92d554"],{8353:function(t,i,e){"use strict";e.r(i);var a=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticStyle:{height:"100%"}},[e("el-container",{staticStyle:{border:"1px solid #eee",height:"100%"}},[e("el-scrollbar",[e("div",{staticStyle:{height:"100%",width:"200px",border:"1px solid rgb(241, 241, 241)"}},[e("div",{staticStyle:{"background-color":"rgb(241, 241, 241)",height:"30px"}},[e("span",{staticStyle:{"line-height":"30px","font-size":".8rem"}},[t._v("表单列表")])]),0==t.formList.length?e("div",[e("span",{staticStyle:{"font-size":".8rem"}},[t._v("列表为空")])]):e("div",[e("div",[e("ul",{staticClass:"form-list"},t._l(t.formList,(function(i,a){return e("li",{key:a,on:{click:function(e){return t.enterForm(i)}}},[t._v(t._s(i.name))])})),0)])])])]),e("el-container",[e("el-main",[e("el-scrollbar",{staticStyle:{height:"100%"}},[e("div",[e("div",{staticStyle:{display:"flex","flex-flow":"wrap"}},[e("div",{staticStyle:{margin:"10px"}},[e("div",{staticClass:"newapp",on:{click:function(i){t.dialogVisible=!0}}},[e("div",[e("i",{staticClass:"el-icon-plus text icon"})]),e("div",[e("span",{staticClass:"text"},[t._v("新建表单")])])])])])]),e("div",[e("el-dialog",{attrs:{title:"新建表单",visible:t.dialogVisible,width:"500px",center:""},on:{"update:visible":function(i){t.dialogVisible=i}}},[e("div",{staticStyle:{height:"32px"}},[e("div",{staticStyle:{float:"left"}},[e("span",{staticStyle:{"line-height":"32px"}},[t._v("表单名称:")])]),e("div",{staticStyle:{float:"left",width:"86%"}},[e("el-input",{attrs:{placeholder:"请填写信息",size:"small"},model:{value:t.name,callback:function(i){t.name=i},expression:"name"}})],1)]),e("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[e("el-button",{on:{click:function(i){t.dialogVisible=!1}}},[t._v("取 消")]),e("el-button",{attrs:{type:"primary"},on:{click:t.sure}},[t._v("确 定")])],1)])],1)])],1)],1)],1)],1)},n=[],s=(e("b0c0"),{name:"vtitle",data:function(){return{dialogVisible:!1,value:"123",name:"",formList:[]}},mounted:function(){this.getFormLit()},methods:{sure:function(){var t=this;this.dialogVisible=!1,console.log(this.global),this.axios.post(this.global.url+"/app/newAppForm",{name:this.name,parentId:this.$route.query.id}).then((function(i){0==i.data.state&&t.$message(i.data.message),t.name="",t.getFormLit()}))},getFormLit:function(){var t=this;console.log(this.$route.query.id),this.axios.post(this.global.url+"/app/getAppForm",{id:this.$route.query.id}).then((function(i){1==i.data.state&&(t.formList=i.data.data)}))},enterForm:function(t){this.$router.push({path:"/designApp/newApplication",query:{id:t.id}})}}}),l=s,o=(e("a3b9"),e("2877")),r=Object(o["a"])(l,a,n,!1,null,"682fa4f8",null);i["default"]=r.exports},a3b9:function(t,i,e){"use strict";var a=e("fef0"),n=e.n(a);n.a},b0c0:function(t,i,e){var a=e("83ab"),n=e("9bf2").f,s=Function.prototype,l=s.toString,o=/^\s*function ([^ (]*)/,r="name";!a||r in s||n(s,r,{configurable:!0,get:function(){try{return l.call(this).match(o)[1]}catch(t){return""}}})},fef0:function(t,i,e){}}]);
//# sourceMappingURL=chunk-2b92d554.c96891c6.js.map