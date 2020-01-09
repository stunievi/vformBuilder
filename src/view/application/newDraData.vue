<template>
  <el-row>
    <el-col :span="12">
      <el-form ref="form" class="b-a" label-width="80px">
        <draggable :clone="cloneData" :list="form_list" :options="dragOptions1">
          <transition-group class="form-list-group" type="transition" :name="'flip-list'" tag="div">
            <renders
              v-for="(items, index) in form_list"
              :key="index"
              :ele="items.ele"
              :obj="items.obj"
            ></renders>
          </transition-group>
        </draggable>
      </el-form>
    </el-col>
    <el-col :span="12">
      <el-form ref="form" :model="formData" class="b-a" label-width="80px">
        <draggable :clone="cloneData" :list="list2" :options="dragOptions2">
          <transition-group class="form-list-group" type="transition" :name="'flip-list'" tag="div">
            <renders
              v-for="(items, index) in list2"
              :key="index"
              :ele="items.ele"
              :obj="items.obj"
              @handleChangeVal="val => handleChangeVal(val,items)"
            ></renders>
          </transition-group>
        </draggable>
        <el-form-item>
          <el-button @click="handleSubmit('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
// @ is an alias to /src
import draggable from "vuedraggable";
import form_list from "@/components/FormList";
import renders from "@/components/Render";

export default {
  name: "home",
  data() {
    return {
      form_list,
      list2: [],
      formData: {}
    };
  },
  components: {
    draggable,
    renders
  },
  methods: {
    handleSubmit(name) {
      //保存
      console.log(JSON.stringify(this.list2));
      this.$refs[name].validate(valid => {
        if (valid) {
          localStorage.setItem(
            "template_form",
            JSON.stringify(this.sortable_item)
          );
          console.log(this.sortable_item); //表单中的内容
        } else {
          console.log("验证不通过");
        }
      });
    },
    // https://github.com/SortableJS/Vue.Draggable#clone
    // 克隆,深拷贝对象
    cloneData(original) {
      // 深拷贝对象，防止默认空对象被更改
      return JSON.parse(JSON.stringify(original));
    },
    // 控件回填数据
    handleChangeVal(val, element) {
      this.$set(this.formData, element.obj.name, val);
    }
  },
  computed: {
    // 拖拽表单1
    dragOptions1() {
      return {
        animation: 0,
        ghostClass: "ghost",
        // 分组
        group: {
          name: "shared",
          pull: "clone",
          revertClone: false
        },
        // 禁止拖动排序
        sort: false
      };
    },
    // 拖拽表单2
    dragOptions2() {
      return {
        animation: 0,
        ghostClass: "ghost",
        group: {
          // 只允许放置shared的控件,禁止pull
          put: ["shared"]
        }
      };
    }
  }
};
</script>
<style>
.form-list-group {
  min-height: 200px;
  padding: 20px !important;
}

.b-a {
  border: 1px solid #ccc;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
