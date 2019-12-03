
<template>
    <draggable class="list-group templates" :list="info.items" group="element" >
          <div
            class="list-group-item "
            v-for="(element,item) in info.items"
            :key="item"

          >
          <div class="templates-item" >
            <div class="edit">
              <span @click="editItem(item)">编辑</span>
              <span @click="deleteItem(item)">删除</span>
            </div>
            <formBuilder :rule="element">
            </formBuilder>
            
          </div>
          
          </div>
        </draggable>

</template>
<script>
import draggable from "vuedraggable";
import formBuilder from './core.js'
  export default {
      name:"draggableItems",
    props:{
        info:Object
    },
    component:{
      draggable,
      formBuilder
    },
    data() {
      return {
        
      };
    },
    methods: {
      
    }
  };
</script>