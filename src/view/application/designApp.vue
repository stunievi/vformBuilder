<template>
  <div style="height: 100%;">
    <el-container style="height: 100%;">
      <el-main>
          <div class="newapp" @click="dialogVisible = true">
              <div>
                  <i class="el-icon-plus text icon"></i>
              </div>
              <div>
                  <span class="text">新建应用</span>
              </div>
          </div>
      </el-main>
      <div>
          <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="60%"
            center
            >
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
            </el-dialog>
      </div>
    </el-container>
  </div>
</template>
<script>

export default {

  data() {
    return {
      dialogVisible:false
    };
  },
  methods: {
    
    
  }
};
</script>
<style lang="scss" scoped>
.newapp{
    border:1px solid #5da6ff;
    width:150px;
    height:200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 5px;
    cursor: pointer;
    .text{
        color:#5da6ff;
        font-size: 1.2rem;
    }
    .icon{
        font-size: 1.5rem;
    }
}
</style>