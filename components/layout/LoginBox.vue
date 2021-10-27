<template>
  <div class="phcent-login">
    <div class="phcent-login-icon">
      <div class="phcent-login-icon--scan">
        <phcent-svg v-if="boxTab==='account'" name="wx_l" size="1.25rem" @click.native="boxTab='scan'"></phcent-svg>
        <phcent-svg v-else name="web_l" size="1.25rem" @click.native="boxTab='account'"></phcent-svg>
      </div>
      <div class="phcent-login-icon--box flex flex-col-center">
        <i class="ri-wechat-fill phcent-icon"
           v-if="boxTab === 'account'"></i><span>{{ boxTab === 'account' ? '微信扫码登录' : '帐号密码登录' }}</span>
      </div>
    </div>
    <!--  扫码登入-->
    <div class="phcent-login-scan" v-if="boxTab === 'scan'">
      <div class="phcent-login-scan--tip">
        <i class="ri-wechat-fill"></i><span>微信扫码登录</span>
      </div>
      <div class="phcent-login-scan--box">
        <div class="scan-code">

        </div>
        <img class="scan-tips" src="@/static/login/login-wx-bg.png" />
      </div>
    </div>
    <!--  普通登入  -->
    <div class="phcent-login-user" v-if="boxTab === 'account'">
      <el-tabs v-model="loginTabIndex" stretch>
        <el-tab-pane label="密码登录" name="account">
          <el-form :model="accountForm" ref="accountForm">
            <el-form-item prop="name" :rules="[{ required: true, message: '请输入帐号/邮箱/手机号码', trigger: 'blur' }]">
              <el-input v-model="accountForm.name" placeholder="帐号/邮箱/手机号码" class="login-input">
                <template #prefix>
                  <i class="ri-user-4-fill phcent-icon" style="color: #C0C4CF"></i>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
              <el-input class="login-input" v-model="accountForm.password" placeholder="密码" show-password>
                <template #prefix>
                  <i class="ri-lock-2-line phcent-icon" style="color: #C0C4CF"></i>
                </template>
              </el-input>
            </el-form-item>
            <div class="login-remember">
              <el-checkbox v-model="remember">下次自动登录</el-checkbox>
              <nuxt-link to="/auth/forget">忘记密码？</nuxt-link>
            </div>
            <el-button type="primary" class="login-btn"  @click="handleSubmit('accountForm')">登  录</el-button>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="短信码登录" name="sms">
          <el-form :model="smsForm" ref="smsForm">
            <el-form-item prop="name" :rules="[{ validator: validatePhone, trigger: ['change','blur'] }]">
              <el-input v-model="smsForm.name" placeholder="手机号码" class="login-input">
                <template #prefix>
                  <i class="ri-cellphone-fill phcent-icon m-t-0" style="color: #C0C4CF"></i>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="code" :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]">
              <el-input class="login-input" v-model="smsForm.code" placeholder="短信码">
                <template #prefix>
                  <i class="ri-lock-2-line phcent-icon" style="color: #C0C4CF"></i>
                </template>
                <el-button type="primary" slot="append" @click="getCode">
                  {{ codeMsg }}
                </el-button>
              </el-input>
            </el-form-item>
            <div class="login-remember">
              <el-checkbox v-model="remember">下次自动登录</el-checkbox>
              <nuxt-link to="/auth/forget">忘记密码？</nuxt-link>
            </div>
            <el-button type="primary" class="login-btn"  @click="handleSubmit('smsForm')">登  录</el-button>
          </el-form>

        </el-tab-pane>
        <div class="other-login">
          <div class="other">
            <span>其他帐号登录</span>
            <i class="ri-qq-fill"/>
          </div>
          <nuxt-link to="/auth/register">立即注册</nuxt-link>
        </div>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { urlGetSmsCode } from '~/api'
import PhcentSvg from "~/components/PhcentSvg";

export default {
  name: 'LoginBox',
  components: {PhcentSvg},
  data() {
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          callback();
        }
      }
    }
    return {
      validatePhone:validatePhone,
      // 盒子类型 account表单登入 scan 扫码登入
      boxTab: 'account',
      // 登入类型 account 普通登入 sms手机登入
      loginTabIndex: 'account',
      // 是否记住登入
      remember:true,
      // 普通账号表单
      accountForm: {
        name: '',
        password: '',
        type: 1
      },
      // 短信表单
      smsForm: {
        name: '',
        code: '',
        type: 2
      },
      // 倒计时秒数
      countdown: 60,
      // 按钮上的文字
      codeMsg: '获取验证码',
      // 定时器
      timer: null
    }
  },
  methods: {
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const formData = formName === 'accountForm'? this.accountForm : this.smsForm;
          this.$auth.loginWith('laravelJWT',{data:formData}).then(res=>{
            this.$message.success('登入成功');
          }).catch(()=>{
            this.$message.error('登入失败');
          });
        } else {
          return false;
        }
      });
    },
    // 获取验证码
    getCode() {
      // 验证码60秒倒计时
      if (!this.timer) {
        let _this = this;
        this.$axios.$post(urlGetSmsCode,this.smsForm).then(res=>{
          console.log(res);
            this.setTime()
            this.$message.success(`发送成功`)
        }).catch(res=>{
          _this.$message.error(res.data)
        })
      }
    },
    setTime(){
      let _this = this;
      this.timer = setInterval(() => {
        if (_this.countdown > 0 && _this.countdown <= 60) {
          _this.countdown--;
          if (_this.countdown !== 0) {
            _this.codeMsg = "重新发送(" + _this.countdown + ")";
          } else {
            clearInterval(_this.timer);
            _this.codeMsg = "获取验证码";
            _this.countdown = 60;
            _this.timer = null;
          }
        }
      }, 1000)
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__header,.el-form-item{
  margin-bottom: 0.6rem;
}
::v-deep .el-input-group__append{
  border-radius:0 1rem 1rem 0;
}
::v-deep .el-tabs__item {
  font-size: 0.5rem;
  height: 1.5rem;
  line-height: 1.5rem;
  color:#a1a6bb;
}
::v-deep .el-input__inner {
      border-radius: 1rem;
      position: relative;
      padding-left: 40px;
      height: 1.25rem;
     line-height: 1.25rem;
    }
::v-deep .el-input--prefix .el-input__inner {
  padding-left: 1rem;
}
::v-deep .el-input__prefix{
  left: 0.25rem;
  display: flex;
  align-items: center;
}
.phcent-icon{
  font-size: 0.6rem;
  margin-top: 0;
  margin-left: 0.125rem;
}
.phcent-login {
  width: 100%;
  height: 100%;
  font-size: 0.65rem;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0;
  color: #3a405b;
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &-icon {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    height: 52px;
    width: 100%;
    cursor: pointer;

    &--scan {
      width: 1.25rem;
      height: 1.25rem;
      float: right
    }

    &--box {
      float: right;
      height: 0.7rem;
      margin-right: 0.25rem;
      border: 1px solid #F2F6FC;
      padding: 0 0.25rem;

      i {
        color: #51B675;
      }

      span {
        text-align: left;
        font-size: 0.25rem;
        line-height: 0.7rem;
        color: #738299;
        float: right;
        margin-left: 0.25rem;
      }
    }
  }

  //扫码登入
  &-scan {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: all 300ms linear;

    &--tip {
      i {
        color: #fff;
        background-color: #51B675;
        border-radius: 50%;
        vertical-align: middle;
        display: inline-block;
        padding: 0.2rem;
        width: 1rem;
        font-size: 0.6rem;
      }

      span {
        display: inline-block;
        padding-left: 0.25rem;
        font-size: 0.6rem;
      }
    }

    &--box {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 1.5rem;

      .scan-code {
        width: 6rem;
        height: 6rem;
        background-color: #fff;
        transition: all 300ms linear;
        border: 1px solid #e5e5e5;
      }

      .scan-tips {
        width: 0;
        height: 5.5rem;
        transition: all 300ms linear;
      }

      &:hover {
        .scan-tips {
          width: 6rem;
        }
      }
    }
  }

  &-user {
    width: 100%;
    max-width: 11rem;
    padding: 1rem;
  }
  .login-btn{
    width: 100%;
    border-radius: 2rem;
    margin-top: 0.6rem;
    font-size: 0.5rem;
  }
  .login-remember{
    display: flex;
    font-size: 14px;
    justify-content: space-between;
    padding: 0 0.5rem;
    a{
      color: #9ea1b1;
    }
  }
  .other-login{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 0.5rem 0;
    .other{
      display: flex;
      align-items: center;
      span{
        font-size: 0.35rem;
        color: #a1a6bb;
      }
      i{
        font-size: 0.45rem;
        width: .7rem;
        height: .7rem;
        background-color: $--color-primary;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        border-radius: 50%;
        margin-left: 0.6rem;
      }
    }
    a{
      font-size: 0.35rem;
    }
  }
}
</style>
