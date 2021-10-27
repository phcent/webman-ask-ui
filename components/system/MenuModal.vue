<template>
  <el-dialog :visible.sync="dialogVisible"
             :title="title"
             width="500px"
             append-to-body
             :before-close="handleClose"
             :close-on-click-modal="false"
             destroy-on-close>
    <el-form v-loading="loading" ref="form" :model="ruleForm" label-width="120px" class="mange-form">
      <el-form-item label="菜单名称">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="菜单图标">
        <select-icon v-model="ruleForm.icon"></select-icon>
      </el-form-item>
      <el-form-item label="父级菜单">
        <el-cascader v-model="ruleForm.pid"
                     :options="menuList"
                     :props="{ checkStrictly: true,value:'id',label:'name',emitPath:false }"
                     clearable></el-cascader>
      </el-form-item>
      <el-form-item label="前端路由">
        <el-input v-model="ruleForm.path"></el-input>
      </el-form-item>
      <el-form-item label="菜单路由">
        <el-input v-model="ruleForm.controller"></el-input>
      </el-form-item>
      <el-form-item label="状态"  prop="status" >
        <el-radio-group v-model="ruleForm.status" size="mini">
          <el-radio-button :label="1">开启</el-radio-button>
          <el-radio-button :label="2">关闭</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" size="mini" :loading="subLoading" @click="onsubmit">提交</el-button>
        <el-button size="mini">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { urlAdminSysMenu } from '~/api/admin/system'
import { getTree } from '~/plugins/phcent'
import SelectIcon from '~/components/SelectIcon'

export default {
  name: 'MenuModal',
  components: { SelectIcon },
  emits:['changeOk'],
  props:{
    menuList:{
      type:Array,
      default(){
        return []
      }
    }
  },
  data(){
    return{
      loading:false,
      dialogVisible:false,
      title:'新增菜单',
      ruleForm:{
        status:1
      },
      subLoading:false
    }
  },
  destroyed() {
    this.ruleForm={}
  },
  methods:{
    open(){
      this.loading=true
      this.title='新增菜单'
      this.ruleForm={
        status:1
      }
      this.loading=false
      this.dialogVisible = true
    },
    edit(row){
      this.loading=true
      // this.$axios.get(urlAdminSysMenu+'/update/'+row.id).then(res=>{
      //   this.ruleForm = res.data.info
      //   this.loading=false
      // })
      this.ruleForm={
        id:row.id,
        name:row.name,
        icon:row.icon,
        pid:row.pid,
        path:row.path,
        controller:row.controller,
        status:row.status
      }
      this.title='编辑菜单'
      this.loading=false
      this.dialogVisible = true
    },
    handleClose(){
      this.dialogVisible = false
    },
    onsubmit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.subLoading=true
          this.ruleForm.pid=this.ruleForm.pid||0
          if(this.ruleForm.id>0){
            this.$axios.put(urlAdminSysMenu+'/update/'+this.ruleForm.id, this.ruleForm).then(res => {
              this.$message.success('编辑菜单成功')
              this.ruleForm = {
                name: '',
                path: '',
                controller: '',
                perm: '',
              }
              this.$emit('changeOk')
            }).finally(()=>{
              this.subLoading=false
              this.dialogVisible = false
            })
          }else{
            this.$axios.post(urlAdminSysMenu+'/create', this.ruleForm).then(res => {
              this.$message.success('添加菜单成功')
              this.ruleForm = {
                name: '',
                path: '',
                controller: '',
                perm: '',
              }
              this.$emit('changeOk')
            }).finally(()=>{
              this.subLoading=false
              this.dialogVisible = false
            })
          }
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
