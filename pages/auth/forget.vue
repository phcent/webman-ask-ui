<template>
  <div class="find">
    <div class="find-box">
      <!--      内容区-->
      <div class="find-box-wrap">
        <!--        标题-->
        <div class="find-box-wrap-title">
          <i class="ri-lock-unlock-line"></i>
          <span>找回密码</span>
        </div>
        <!--        进度条-->
        <div class="find-box-wrap-steps">
          <ul class="ul">
            <li class="ul-text" :class="{'active':active<4}">
              <div class="ul-text-box">1</div>
              身份验证
            </li>
            <li class="ul-line" :class="{'active':active>=2}"></li>
            <li class="ul-text" :class="{'active':active>=2}">
              <div class="ul-text-box">2</div>
              重置密码
            </li>
            <li class="ul-line" :class="{'active':active==3}"></li>
            <li class="ul-text" :class="{'active':active==3}">
              <div class="ul-text-box">3</div>
              完成找回
            </li>
          </ul>
        </div>
        <!--        表单区-->
        <div class="find-box-wrap-form">
          <!--          身份验证-->
          <el-form :model="accountForm" v-if="active===1" ref="accountForm" label-width="120px">
            <el-form-item label="手机号码/邮箱" class="switch" prop="name" :rules="[{ required: true, message: '请输入手机号码或邮箱', trigger: 'blur' }]">
              <el-input class="no-bor" type="text" v-model="accountForm.name"
                        placeholder="请输入验证邮箱/手机号码"
              ></el-input>
            </el-form-item>
            <div class="code">
              <el-form-item label="验证码" class="switch" prop="code" :rules="[{ required: true, message: '请输入手机号码或邮箱', trigger: 'blur' }]">
                <el-input class="no-bor" type="text" v-model="accountForm.code"
                          placeholder="请输入验证码"
                ></el-input>
              </el-form-item>
              <div class="btn" @click="getCode">{{ codeMsg }}</div>
            </div>
          </el-form>
          <!--          重置密码-->
          <el-form :model="accountForm" v-else-if="active===2" ref="passwordForm" label-width="120px">
            <el-form-item label="新密码" class="switch" prop="password" :rules="[{ required: true, message: '新密码', trigger: 'blur' }]">
              <el-input show-password class="no-bor" type="password" v-model="accountForm.password"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" class="switch" prop="password_confirmation" :rules="[{ validator:validatePhone , trigger: ['blur','change'] }]">
              <el-input show-password class="no-bor" type="password" v-model="accountForm.password_confirmation"
              ></el-input>
            </el-form-item>
          </el-form>
          <!--          流程完成-->
          <div v-else class="error-ok">
            <div class="top p-t-20">
              <i class="ri-checkbox-circle-fill" style="font-size: 1rem;"></i>
              <div>您的密码已重置成功！</div>
            </div>
            <p>账号：{{accountForm.name}}</p>
          </div>
          <div class="nextStep">
            <el-button type="primary" @click="nextStep">{{active===3?'登录':'下一步'}}</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { urlGetSmsCode,urlPostForget } from '~/api'
export default {
  name: "forget",
  layout:"login",
  head: {
    titleTemplate: '找回密码 - %s',
  },
  data(){
    // 重密码判断
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if(value !== this.accountForm.password){
        callback(new Error("两次密码不一致"));
      }else {
        callback()
      }

    }
    return{
      validatePhone:validatePhone,
      active:1,
      //倒计时秒数
      countdown:60,
      //按钮上的文字
      codeMsg:'获取验证码',
      //定时器
      timer:null,
      accountForm:{
        name:'',
        code:'',
        password:'',
        password_confirmation:'',
      },
    }
  },
  methods:{
    // 获取验证码
    getCode() {
      this.$refs.accountForm.validateField('name',(errMsg)=>{
        if(errMsg){
          return false
        }else {
          // 验证码60秒倒计时
          if (!this.timer) {
            let postData = {
              'name':this.accountForm.name,
              'type':3
            }
            this.$axios.post(urlGetSmsCode,postData).then(res=>{
              this.setTime()
              this.$message.success(res.msg)
            }).catch(res=>{
              this.$message.error(res.msg)
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
    nextStep(){
      if (this.active===1){
        this.$refs.accountForm.validate((val)=>{
          if(val){
            this.active = this.active+=1
          } else {
            return false;
          }
        })
      }else if(this.active===2){
        this.$refs.passwordForm.validate((val)=>{
          if(val){
            this.$axios.post(urlPostForget,this.accountForm)
              .then(res=>{
                this.active = 3
              }).catch(res=>{
              this.$message.error(res.msg)
            })
          } else {
            return false;
          }
        })
      }else if(this.active===3){
        this.$router.push({path:'/auth/login'})
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }

}
</script>

<style scoped lang="scss">

::v-deep .el-tabs__header,.el-form-item{
  margin-bottom: 0.6rem;
}
.find{
  padding-top: 3rem;
  &-box{
    max-width: 800px;
    height: auto;
    margin:1rem auto 0 auto;
    padding-top: 1rem;

    //内容区
    &-wrap{
      width: 100%;height: auto;
      box-shadow: 0 0 9px 0 rgb(92 128 255 / 17%);
      background-color: #fff;
      border-radius: 2px; margin-top: 12px;
      border-top: 3px solid $--color-primary;
      padding: 0 1rem .5rem 1rem;
      //找回密码提示
      &-title{
        display: flex;
        justify-content: center;
        padding: .7rem 0;
        color: #738299;
        span{
          font-size: .4rem;
        }
        i{
          display: block;
          font-size: .5rem;
          margin-right: 10px;
        }
      }
      //进度条
      &-steps{
        .ul{
          display: flex;
          justify-content: center;
          &-text{
            color: #CCD2DC;
            width: max-content;
            font-size: .35rem;
            &-box{
              margin: 0 auto;
              width: 0.8rem;
              height: 0.8rem;
              border-radius: 50%;
              font-size: 0.4rem;
              color: #fff;
              background-color: #CCD2DC;
              text-align: center;
              line-height: 0.8rem;
            }
          }
          &-text.active{
            color: $--color-primary;
            .ul-text-box{background-color: $--color-primary;}
          }
          &-line{
            max-width: 3.5rem;
            width: 20%;
            height: 3px;
            background-color: #CCD2DC;
            margin-top: .35rem;
          }
          &-line.active{
            background-color: $--color-primary;
          }
        }
      }
      //  表单区
      &-form{
        margin: .5rem auto;
        width: 100%;
        max-width: 11rem;
        .code{
          display: flex;
          position: relative;
          .btn{
            width: 2.5rem;
            font-size: .3rem;
            line-height: 30px;
            text-align: center;
            height: 30px;
            color: $--color-primary;
            border:1px solid #A7CFFF;
            margin-left: 30px;
            cursor: pointer;
          }
          .btn:hover{
            border:1px solid $--color-primary;
            background-color: $--color-primary;
            color: #fff;
          }
        }
        .nextStep{
          width:60%;
          margin:1rem auto auto auto;
          .el-button{
            width: 100%;
          }
        }
        .error-ok{
          text-align: center;
          width: 75%;
          margin: 0 auto;
          .top{
            display: flex;
            justify-content: center;
            font-size: .7rem;
            color: $--color-primary;
          }
          p{
            margin: 20px 0;
            color: #738299;
            font-size: 14px;
          }
        }
      }
    }
  }
}
.no-bor ::v-deep .el-input__inner {
  border: none;
  border-bottom: 1px solid #ddd;
  border-radius: 0;
  height: 23px;
}
//控制布局
@media screen and (max-width: 980px) {
  .find{
    padding: 0 1rem;
  }
  //小屏改变发送短信按钮布局
  .code .btn{
    position: absolute;
    bottom:1rem;
    right:0;
  }
  .find-box-wrap-form{
    //小屏表单label提升为上下
    ::v-deep .switch{
      margin-bottom: .2rem !important;
      .el-form-item__label-wrap{
        float: none;
        margin-left: 0 !important;
      }
      .el-form-item__content{
        margin-left: 0 !important;
      }
    }
    .code .btn{
      margin-left: 0 !important;
    }
  }
}

</style>
