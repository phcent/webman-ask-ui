<template>
  <el-dialog :visible.sync="dialogVisible"
             :title="title"
             width="500px"
             append-to-body
             :before-close="handleClose"
             :close-on-click-modal="false"
             destroy-on-close>
    <el-form ref="form" :model="ruleForm" label-width="120px" class="mange-form" v-loading="loading">
      <el-form-item label="权限组名称">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="权限组权限">
<!--        {{menuList}}-->
        <el-cascader v-model="ruleForm.pid"
                     :options="menuList"
                     :props="{ multiple: true,value:'id',label:'name',emitPath:false }"
                     collapse-tags
                     clearable></el-cascader>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" size="mini" :loading="subLoading" @click="onsubmit">提交</el-button>
        <el-button size="mini">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { urlAdminSysTeam } from '~/api/admin/system'
import { getTree } from '~/plugins/phcent'

export default {
  name: 'TeamModal',
  emits:['changeOk'],
  data(){
    return{
      dialogVisible:false,
      loading:true,
      subLoading:false,
      title:'权限组',
      ruleForm:{},
      menuList:[]
    }
  },
  methods:{
    open(){
      this.dialogVisible = true
      this.loading=true
      this.$axios.get(urlAdminSysTeam+'/create').then(res=>{
        this.menuList = getTree(res.data.menuList,'pid',0,'id','pid')
        console.log(res.data.menuList)
        this.loading=false
      })
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
          this.$axios.post(urlAdminSysTeam+'/create', this.ruleForm).then(res => {
            this.$message.success('添加权限组成功')
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
