<template>
  <div>
    <user-page title="新增会员" :btn-list="['return']" :show-explain="false" :right-options="false"></user-page>
    <el-card class="box-card" shadow="hover" v-loading="loading">
      <el-form :model="ruleForm" ref="addForm" label-width="150px" class="phcent-form">
        <el-form-item label="会员账号" prop="name" :rules="[{ required: true, message: '请输入会员账号', trigger: 'blur' }]">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="会员昵称" prop="nick_name" :rules="[{ required: true, message: '请输入会员昵称', trigger: 'blur' }]">
          <el-input v-model="ruleForm.nick_name"></el-input>
        </el-form-item>
        <el-form-item label="会员密码" prop="password" :rules="[{ required: true, message: '请输入会员密码', trigger: 'blur' }]">
          <el-input v-model="ruleForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="会员手机" prop="mobile" :rules="[{ validator: validatePhone, trigger: ['change','blur'] }]">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="会员邮箱" prop="email"
                      :rules="[{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="会员用户组" prop="current_team_id" :rules="[{ required: true, message: '请选择会员用户组', trigger: ['change','blur'] }]">
          <el-select v-model="ruleForm.current_team_id" placeholder="请选择">
            <el-option
              v-for="item in teamList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="允许登入" prop="status">
          <el-switch v-model="ruleForm.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" :loading="subLoading" @click="handleSubmit('addForm')">提交</el-button>
        </el-form-item>
      </el-form>

    </el-card>
  </div>
</template>

<script>
import { urlAdminSysUser  } from '~/api/admin/system'
import UserPage from '~/components/ask/UserPage'

export default {
  name: 'add',
  components: { UserPage },
  layout: "admin",
  head: {
    titleTemplate: '添加会员 - 管理中心  - %s',
  },
  data(){
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          callback();
        }
      }
    }
    return{
      loading:true,
      validatePhone:validatePhone,
      teamList:[],
      ruleForm:{
        name:'',
        nick_name:'',
        password:'',
        mobile:'',
        email:'',
        status:1,
        current_team_id:0,
      },
      cateInfo:{},
      subLoading:false
    }
  },
  mounted() {
    this.getTeam()

  },
  methods:{
    // 获取用户组
    getTeam(){
      this.loading=true
      this.$axios.get(urlAdminSysUser+'/create').then(res =>{
        this.teamList = res.data.teamList||[]
        if(this.teamList.length>0){
          this.ruleForm.current_team_id = this.teamList[0].id
        }
        this.loading=false
      })
    },
    handleSubmit(formName){
      this.$refs[formName].validate((valid)=>{
        if (valid) {
          this.subLoading=true
          let _this = this
          this.$axios.post(urlAdminSysUser+'/create',this.ruleForm).then(res=>{
            this.$confirm('新增会员成功，是否继续?', '提示', {
              confirmButtonText: '继续新增',
              cancelButtonText: '返回列表',
              type: 'warning'
            }).then(() => {
              _this.$refs.ruleForm.resetFields();
            }).catch(() => {
              _this.$router.push('/manage/system/user');
            });
          }).finally(()=>{
            this.subLoading=false
          })
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.phcent-form{
  width: 100%;
  max-width: 15rem;
  margin: 0 auto;
}
</style>
