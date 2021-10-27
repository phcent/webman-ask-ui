<template>
  <div class="wrapper user-page">
    <div class="user-page-left">
      <user-left-nav></user-left-nav>
    </div>
    <div class="user-page-right">
      <div class="blog-page-left-tabs">
        <div class="blog-page-left-tabs-item tabs-on">
          <nuxt-link to="" class="item-a">
            修改密码
          </nuxt-link>
        </div>
      </div>
      <el-card class="user-card">
        <el-alert title="温馨提示" type="error" :closable="false">
          如果您通过微信或Github账号直接登录的，需先绑定手机号再在登录页选择 忘记密码
        </el-alert>
        <el-form ref="form" :model="form" label-width="120px" class="m-t-20">
          <el-form-item label="旧密码" prop="old_password" :rules="[{ required: true, message: '请输入旧密码', trigger: 'blur' }]">
            <el-input v-model="form.old_password" show-password style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password" :rules="[{ required: true, message: '请输入新密码', trigger: 'blur' }]">
            <el-input v-model="form.password" show-password style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="password_confirmation" :rules="[{ required: true, message: '请输入确认密码', trigger: 'blur' }]">
            <el-input v-model="form.password_confirmation" show-password style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" size="mini" :loading="subLoading" @click="submit">确认</el-button>
            <el-button size="mini" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import {urlUserAskInfoPwd} from '~/api/user/ask'
import { urlPostForget } from '~/api'
import UserLeftNav from '~/components/ask/UserLeftNav'

export default {
  name: "changepwd",
  components: { UserLeftNav },
  layout:"ask",
  head: {
    titleTemplate: '修改密码- 会员中心 - %s',
  },
  data(){
    return{
      form:{},
      subLoading:false
    }
  },
  methods:{
    submit(){
      this.$refs.form.validate((val)=>{
        if(val){
          this.subLoading=true
          this.$axios.post(urlUserAskInfoPwd,this.form).then(res=>{
            this.$message.success('修改成功')
            this.resetForm()
          }).finally(()=>{
            this.subLoading=false
          })
        } else {
          return false;
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields();
    }
  }
}
</script>

<style scoped lang="scss">
.user-page-right{
  .user-card {
    padding: 20px;
  }
}
</style>
