<template>
  <div class="reg">
    <div class="reg-box">
      <div class="reg-box-wrap">
        <div class="reg-box-wrap-icon">
          <div class="reg-box-wrap-icon--scan">
            <phcent-svg v-if="boxTab==='account'" name="wx_l" size="1.25rem" @click.native="boxTab='scan'"></phcent-svg>
            <phcent-svg v-else name="web_l" size="1.25rem" @click.native="boxTab='account'"></phcent-svg>
          </div>
          <div class="reg-box-wrap-icon--box">
            <i v-if="boxTab === 'account'" class="ri-wechat-fill phcent-icon" style="color: #51B675"></i>
            <span class="wx-tit">{{boxTab==='account' ? '微信扫码注册' : '手机/邮箱注册'}}</span>
          </div>
        </div>
        <!--        扫码注册-->
        <div class="reg-box-wrap-scan" v-if="boxTab==='scan'">
          <div class="reg-box-wrap-scan--tip">
            <i class="ri-wechat-fill"></i><span>微信扫码注册</span>
          </div>
          <div class="reg-box-wrap-scan--box">
            <div class="scan-code">

            </div>
            <img class="scan-tips" src="@/static/login/login-wx-bg.png" />
          </div>
        </div>
        <!--        普通注册-->
        <div class="reg-box-wrap-user" v-if="boxTab==='account'">
          <div class="pwd-login">
            <el-form :model="ruleForm" ref="form">
              <el-form-item prop="name" :rules="[{ validator:validatePhone, trigger: ['blur','change'] }]">
                <el-input v-model="ruleForm.name"
                          placeholder="请输入手机号码或邮箱"
                          class="login-input"
                >
                  <template #prefix>
                    <i class="ri-admin-line ipt-icon phcent-icon" style="color: #C0C4CF"></i>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="code" :rules="[{ required: true, message: '请输入短信码', trigger: 'blur' }]">
                <el-input class="login-input-code" v-model="ruleForm.code" placeholder="短信码">
                  <template #prefix>
                    <i class="ri-lock-2-line phcent-icon" style="color: #C0C4CF"></i>
                  </template>
                  <el-button type="primary" slot="append" @click="getCode">
                    {{ codeMsg }}
                  </el-button>
                </el-input>
              </el-form-item>
              <div class="class">
                <div class="automatic_logon">
                  <el-checkbox v-model="automatic_logon">我同意 <a href="">《象讯平台注册协议》</a></el-checkbox>
                </div>
              </div>
              <el-form-item>
                <el-button type="primary" @click="submitForm()" style="width: 100%;margin-top: 20px" round>免费注册</el-button>
              </el-form-item>
            </el-form>
            <div class="other-login" style="color: #9ea2b2;">
              已有账号？<a class="to-reg" href="/auth/login" style="color: #0076fe">立即登录</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { urlGetSmsCode, urlPostReg } from '~/api'
import PhcentSvg from "~/components/PhcentSvg";
export default {
  name: "register",
  components: {PhcentSvg},
  layout:"login",
  head: {
    titleTemplate: '注册 - %s',
  },
  data(){
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
    return{
      validatePhone:validatePhone,
      // 盒子类型 account表单注册 scan 扫码注册
      boxTab:'account',
      //倒计时秒数
      countdown:60,
      //按钮上的文字
      codeMsg:'获取验证码',
      //定时器
      timer:null,
      automatic_logon:false,
      ruleForm:{
        name:'',
        code:'',
      },
    }
  },
  methods:{
    // 获取验证码
    getCode() {
      this.$refs.form.validateField('name',(errMsg)=>{
        if(errMsg){
          return false
        }else {
          // 验证码60秒倒计时
          if (!this.timer) {
            let postData = {
              'name':this.ruleForm.name,
              'type':1
            }
            this.$axios.post(urlGetSmsCode,postData).then(res=>{
              this.setTime()
              this.$message.success(res.msg)
            }).catch(res=>{
              this.$message.error(res.data.message)
            })
          }
        }
      })
    },
    //倒计时
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
    },
    submitForm(){
      if(this.automatic_logon===true){
        this.$refs.form.validate(valid=>{
          if(valid){
            this.$axios.post(urlPostReg,this.ruleForm).then(res=>{
              this.$message.success(`注册成功`)
              this.$router.push({path:'/login'})
            }).catch(res=>{
              this.$message.error(res.data.message)
            })
          }else {
            return false
          }
        })
      }else {
        this.$message.error('必须同意象讯平台注册协议')
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input-group__append{
  border-top-right-radius: 1rem;
  border-bottom-right-radius:1rem;
}
::v-deep .login-input-code .el-input__inner{
  border-top-right-radius: 0rem;
  border-bottom-right-radius:0rem;
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
.reg{
  padding-top: 3rem;
  //内容区
  &-box{
    max-width: 800px;
    height: 13.5rem;
    margin:1.7rem auto 0 auto;
    //头部跳转按钮
    &-line{
      height: 1rem;
      text-align: right;
      width: 100%;
      font-size: .2rem;
      color: #c2c9d2;
      .number{
        font-size: .4rem;
        color: #afb6c0;
      }
    }
    //盒子内容区
    &-wrap{
      width: 100%;
      height: 100%;
      font-size: 0.65rem;
      font-weight: normal;
      border-top: 3px solid #0076fe;
      border-radius: 2px;
      background: #fff;
      box-shadow: 0 0 9px 0 rgb(92 128 255 / 17%);
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      &-icon{
        position: absolute;
        right: 0.5rem;
        top: 0.5rem;
        height: 52px;
        width: 100%;
        cursor: pointer;
        &--scan{
          width: 1.25rem;
          height: 1.25rem;
          float: right;
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

      //  扫码注册
      &-scan{
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        transition: all 300ms linear;
        &--tip {
          text-align: center;
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
      //  普通注册
      &-user{
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
        font-size: 0.35rem;
      }
    }
  }
}
//控制布局
@media screen and (max-width: 980px) {
  .reg{
    padding: 0 1rem;
  }
}
</style>
