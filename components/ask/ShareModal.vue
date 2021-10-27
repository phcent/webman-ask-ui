<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="分享"
    width="30%"
    append-to-body
    :before-close="handleClose"
    destroy-on-close
  >
    <div class="qr-share">
      <div class="qr-box"></div>
      扫码分享到微信
    </div>
    <div class="share-type">
      <a class="share-type-item">
        <div class="share-type-item-icon" style="background-color: #e74c3c">
          <i class="ri-weibo-fill"></i>
        </div>
        分享到微博
      </a>
      <a class="share-type-item">
        <div class="share-type-item-icon" style="background-color: #51b675">
          <i class="ri-wechat-fill"></i>
        </div>
        分享到微信
      </a>
      <a class="share-type-item">
        <div class="share-type-item-icon">
          <i class="ri-qq-fill"></i>
        </div>
        分享到QQ
      </a>
    </div>
    <template #footer>
      <span class="dialog-footer flex flex-col-center">
        <el-button type="primary" @click="dialogVisible = false" size="small">关闭</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script>
export default {
  name: 'ShareModal',
  data(){
    return{
      dialogVisible: false
    }
  },
  methods:{
    open(){
      this.dialogVisible = true
    },
    handleClose(){
      this.dialogVisible = false
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
.qr-share{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .qr-box{
    margin-bottom: 5px;
    width: 140px;
    height: 140px;
    background-color: #e0e0e0;
  }
}
.share-type{
  margin-top: 40px;
  display: flex;
  justify-content: space-around;
  &-item{
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 0.3rem;
    color:#333;
    &:hover{
      color: $--color-primary;
    }
    &-icon{
      width: 26px;
      height: 26px;
      background-color: #03a9f4;
      border-radius: 50%;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      margin-bottom: 5px;
    }
  }
}
</style>
