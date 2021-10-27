<template>
  <el-dialog :visible.sync="dialogVisible"
             :title="title"
             width="500px"
             append-to-body
             :before-close="handleClose"
             :close-on-click-modal="false"
             destroy-on-close>
    <el-form ref="form" :model="ruleForm" label-width="120px" class="mange-form" v-loading="loading">
      <el-form-item label="操作目标">
        <span>{{userInfo.name}}</span>
        <div>
          <span class="color-warning">可用积分：{{userInfo.available_points}} </span>
          <span class="color-primary">冻结积分：{{userInfo.freeze_points}} </span>
        </div>
      </el-form-item>
      <el-form-item label="操作方式">
        <el-select v-model="ruleForm.operation">
          <el-option label="增加积分" value="increase"></el-option>
          <el-option label="减少积分" value="decrease"></el-option>
          <el-option label="冻结积分" value="freeze"></el-option>
          <el-option label="解冻积分" value="unfreeze"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作数量">
        <el-input-number v-model="ruleForm.amount" :min="1" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary"  :loading="subLoading" @click="onsubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

import { urlAdminSysUser } from '@/api/admin/system'

export default {
  name: 'UserPointsModal',
  emits:['changeOk'],
  data(){
    return{
      dialogVisible:false,
      loading:true,
      subLoading:false,
      title:'操作积分',
      userInfo:{},
      ruleForm:{
        name:1,
        operation:'increase',
        amount:0,
        user_id:0
      },
      menuList:[]
    }
  },
  methods:{
    open(row){
      this.dialogVisible = true
      this.userInfo=row
      this.ruleForm.user_id = row.id;
      this.loading=false
    },
    edit(){

    },
    handleClose(){
      this.dialogVisible = false
    },
    onsubmit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.subLoading=true
          this.$axios.post(urlAdminSysUser+'/points', this.ruleForm).then(res => {
            this.$message.success('操作积分成功')
            this.$emit('changeOk')
            this.dialogVisible = false
          }).finally(()=>{
            this.subLoading=false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-dialog__header{
  display: flex;
  padding-top: 15px;
  padding-bottom: 15px;
}
::v-deep .el-form--label-top .el-form-item__label{
  padding: 0;
}
</style>


