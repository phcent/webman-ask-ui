<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="修改"
    width="500px"
    append-to-body
    :before-close="handleClose"
    destroy-on-close
  >
    <el-form ref="form" :model="form" label-width="120px" class="modal-form">
      <el-form-item v-if="type==='email'" label="新邮箱">
        <el-input/>
      </el-form-item>
      <el-form-item v-else label="新手机">
        <el-input/>
      </el-form-item>
      <el-form-item label="验证码" prop="code" :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]">
        <el-input class="login-input" v-model="form.code" placeholder="短信码">

          <el-button type="primary" slot="append" @click="getCode">
            {{ codeMsg }}
          </el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer  flex flex-col-center">
        <el-button type="primary" @click="submit" size="small">确定</el-button>
        <el-button  @click="handleClose" size="small">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { urlGetSmsCode } from '~/api'

export default {
  name: 'UserProfileModal',
  data(){
    return{
      dialogVisible:false,
      type:'email',
      form:{},
      // 倒计时秒数
      countdown: 60,
      // 按钮上的文字
      codeMsg: '获取验证码',
      // 定时器
      timer: null
    }
  },
  methods:{
    open(type){
      this.type=type
      this.dialogVisible = true
    },
    handleClose(){
      this.dialogVisible = false
    },
    // 获取验证码
    getCode() {
      // 验证码60秒倒计时
      if (!this.timer) {
        let _this = this;
        this.$axios.$post(urlGetSmsCode,this.smsForm).then(res=>{
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
    },
    submit(){

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
.modal-form{
  width: 80%;
}
</style>
