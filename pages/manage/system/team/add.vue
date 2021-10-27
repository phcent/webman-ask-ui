<template>
  <div>
    <user-page title="新增权限组" :btn-list="['return']" :show-explain="false" :right-options="false"></user-page>
    <el-card class="p-t-10">
      <el-form ref="form" :model="ruleForm" label-width="120px" class="mange-form">
        <el-form-item label="权限组名称" prop="name" :rules="[{ required: true, message: '请输入权限组名称', trigger: 'blur' }]">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="权限组权限">
          <el-cascader v-model="selectMenu"
                       style="min-width: 300px"
                       :options="menuList"
                       :props="{ multiple: true,value:'id',label:'name',emitPath:false }"
                       collapse-tags
                       clearable></el-cascader>
          <template v-for="item in menuAll">
            <div :key="item.id" v-if="selectMenu.includes(item.id)" class="flex">
              <span class="m-r-20">{{item.name}}</span>
              <el-checkbox-group v-model="item.perm">
                <el-checkbox label="GET">查看</el-checkbox>
                <el-checkbox label="POST">新增</el-checkbox>
                <el-checkbox label="PUT">编辑</el-checkbox>
                <el-checkbox label="DELETE">删除</el-checkbox>
              </el-checkbox-group>
            </div>
          </template>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" size="mini" @click="onsubmit">提交</el-button>
          <el-button size="mini">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import UserPage from '~/components/ask/UserPage'
import { urlAdminSysTeam } from '~/api/admin/system'
import { getTree } from '~/plugins/phcent'
export default {
  name: 'add',
  components: { UserPage },
  layout: "admin",
  head: {
    titleTemplate: '新增权限组 - 管理中心  - %s',
  },
  data(){
    return{
      loading:true,
      menuAll:[],
      menuList:[],
      ruleForm:{
        role:[]
      },
      selectMenu:[],
    }
  },
  mounted() {
    this.getCreate()
  },
  methods:{
    getCreate(){
      this.loading=true
      this.$axios.get(urlAdminSysTeam+'/create').then(res=>{
        this.menuAll=res.data.menuList.map(item=>{
          item.perm=['GET','POST','PUT','DELETE']
          return item
        })
        this.menuList = getTree(res.data.menuList,'pid',0,'id','pid')
        this.loading=false
      })
    },
    onsubmit(){
      this.ruleForm.role=[]
      this.menuAll.forEach(item=>{
        if(this.selectMenu.includes(item.id)){
          this.ruleForm.role.push({
            menu_id:item.id,
            perm:item.perm.join(',')
          })
        }
      })
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$axios.post(urlAdminSysTeam+'/create', this.ruleForm).then(res => {
            this.$confirm('添加权限组成功，是否继续?', '提示', {
              confirmButtonText: '继续添加',
              cancelButtonText: '返回列表',
              type: 'warning'
            }).then(() => {
              this.ruleForm = {
                name: '',
                path: '',
                controller: '',
                perm: '',
              }
              this.selectMenu=[]
              this.$refs.form.resetFields()
            }).catch(() => {
              this.$router.push('/manage/system/team')
            })
          }).catch(err => {
            this.$message.error('添加权限组失败')
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
.mange-form{
  max-width: 20rem;
}
</style>
