<template>
  <div>
    <user-page title="编辑权限组" :btn-list="['return']" :show-explain="false" :right-options="false"></user-page>
    <el-card v-loading="loading">
      <el-form ref="form" :model="ruleForm" label-width="120px" class="mange-form">
        <el-form-item label="名称"  prop="name" :rules="[{ required: true, message: '请输入权限组名称', trigger: 'blur' }]">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="权限组权限">
          <el-cascader v-model="selectMenu"
                       :options="menuList"
                       :props="{ multiple: true,value:'id',label:'name',emitPath:false }"
                       collapse-tags
                       clearable></el-cascader>
          {{ruleForm.pid}}
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
  name: '_id',
  components: { UserPage },
  layout: "admin",
  head: {
    titleTemplate: '修改权限组 - 管理中心  - %s',
  },
  data(){
    return{
      loading:true,
      menuAll:[],
      menuList:[],
      selectMenu:[],
      ruleForm:{

      }
    }
  },
  mounted() {
    this.getCreate()
  },
  methods:{
    getCreate(){
      this.loading=true
      this.$axios.get(urlAdminSysTeam+'/update/'+this.$route.params.id).then(res=>{
        this.menuAll = res.data.menuList.map(item=>{
          item.perm=['GET','POST','PUT','DELETE']
          res.data.teamList.forEach(team=>{
            if(item.id==team.menu_id){
              item.perm=team.perm.split(',')
            }
          })
          return item
        })
        this.menuList = getTree(res.data.menuList,'pid',0,'id','pid')
        this.selectMenu=res.data.teamList.map(item=>{
          return Number(item.menu_id)
        })
        this.ruleForm = res.data.info
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
          this.$axios.put(urlAdminSysTeam+'/update/'+this.$route.params.id, this.ruleForm).then(res => {
            this.$confirm('编辑权限组成功，是否继续?', '提示', {
              confirmButtonText: '继续编辑',
              cancelButtonText: '返回列表',
              type: 'warning'
            }).then(() => {
              this.getCreate()
            }).catch(() => {
              this.$router.push('/manage/system/team')
            })
          }).catch(err => {
            this.$message.error('编辑权限组失败')
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


