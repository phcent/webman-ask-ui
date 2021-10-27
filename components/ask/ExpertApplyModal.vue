<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="申请专家认证"
    width="500px"
    append-to-body
    :before-close="handleClose"
    destroy-on-close
  >
    <el-form label-position="top"
             :model="ruleForm">
      <el-form-item>
        <template #label>
          <b>技能 <span class="color-info">（你比较擅长的）</span></b>
        </template>
        <el-input v-model="ruleForm.name"  placeholder="例如：php/javascript/linux"></el-input>
      </el-form-item>
      <el-form-item>
        <template #label>
          <b>个人介绍 <span class="color-info">（将会显示在头像右侧）</span></b>
        </template>
        <el-input v-model="ruleForm.name" type="textarea" placeholder="建议不超过10个汉字"></el-input>
      </el-form-item>
      <el-form-item>
        <template #label>
          <b>作品集网址 <span class="color-info">（博客/Github/Gitee等）</span></b>
        </template>
        <el-input v-model="ruleForm.name" :rows="4" type="textarea" placeholder="请输入你的博客或Github相关地址"></el-input>
      </el-form-item>
      <el-form-item>
        <template #label>
          <b>QQ号 <span class="color-info">（用于应急联系）</span></b>
        </template>
        <el-input v-model="ruleForm.qq" placeholder="请输入你的QQ号"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer  flex flex-col-center">
        <el-button type="primary" @click="dialogVisible = false" size="small"
        >提交申请</el-button
        >
      </span>
    </template>
  </el-dialog>

</template>

<script>
export default {
  name: 'ExpertApplyModal',
  data(){
    return{
      dialogVisible: false,
      ruleForm:{

      }
    }
  },
  methods:{
    open(){
      this.dialogVisible = true
    },
    handleClose(){
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
.color-info{
  color: $--color-info;
}
::v-deep .el-dialog__header{
  display: flex;
  padding-top: 15px;
  padding-bottom: 15px;
}
::v-deep .el-form--label-top .el-form-item__label{
  padding: 0;
}
</style>


