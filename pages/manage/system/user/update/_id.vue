<template>
  <div>
    <user-page title="修改会员" :btn-list="['return']" :show-explain="false" :right-options="false"></user-page>
    <el-card class="box-card" shadow="hover" v-loading="loading">
      <el-form :model="ruleForm" ref="addForm" label-width="150px" class="phcent-form">
        <el-form-item label="会员账号" prop="name" :rules="[{ required: true, message: '请输入会员账号', trigger: 'blur' }]">
          <el-input v-model="ruleForm.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="会员昵称" prop="nick_name" :rules="[{ required: true, message: '请输入会员昵称', trigger: 'blur' }]">
          <el-input v-model="ruleForm.nick_name"></el-input>
        </el-form-item>
        <el-form-item label="会员密码" :rules="[{ required: true, message: '请输入会员密码', trigger: 'blur' }]">
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
        <el-form-item label="可用余额" prop="available_balance">
          <el-input-number v-model="ruleForm.available_balance" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="冻结余额" prop="freeze_balance">
          <el-input-number v-model="ruleForm.freeze_balance" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="可用积分" prop="available_points">
          <el-input-number v-model="ruleForm.available_points" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="冻结积分" prop="freeze_points">
          <el-input-number v-model="ruleForm.freeze_points" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="累计积分" prop="points">
          <el-input-number v-model="ruleForm.points" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="自我说明" prop="description">
          <el-input v-model="ruleForm.description" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="允许登入" prop="status">
          <el-switch v-model="ruleForm.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="handleSubmit('addForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { urlAdminSysUser } from '~/api/admin/system'
import UserPage from '~/components/ask/UserPage'

export default {
  name: '_id',
  components: { UserPage },
  layout: "admin",
  head: {
    titleTemplate: '修改会员 - 管理中心  - %s',
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
      loading:false,
      validatePhone:validatePhone,
      teamList:[],
      ruleForm:{
        name:'',
        nick_name:'',
        password:'',
        mobile:'',
        email:'',
        status:1
      }
    }
  },
  mounted() {
    this.getInfo()
  },
  methods:{
    getInfo(){
      this.loading=true
      this.$axios.get(urlAdminSysUser+'/update/'+this.$route.params.id).then(res =>{
        this.ruleForm = res.data.info
        this.teamList = res.data.teamList
        // if(!this.ruleForm.current_team_id){
        //   this.ruleForm.current_team_id = this.teamList[0].id
        // }
        this.loading=false
      })
    },
    goBack() {
      this.$router.go(0);
    },
    handleSubmit(formName){
      this.$refs[formName].validate((valid)=>{
        if (valid) {
          let _this = this
          this.$axios.put(urlAdminSysUser+'/update/'+this.$route.params.id,this.ruleForm).then(res=>{
            this.$confirm('编辑信息成功，是否继续?', '提示', {
              confirmButtonText: '继续编辑',
              cancelButtonText: '返回列表',
              type: 'warning'
            }).then(() => {
              _this.getInfo()
            }).catch(() => {
              _this.$router.push('/manage/system/user');
            });
          }).catch(err=>{

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
