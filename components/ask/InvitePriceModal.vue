<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="付费邀请"
    width="500px"
    append-to-body
    :before-close="handleClose"
    destroy-on-close
  >
    <el-alert title="温馨提示" type="error" :closable="false">
      <div>
        1.被邀请者回答提问后将直接得到邀请赏金，与是否采纳无关
      </div>
      <div>
        2.如果被邀请者在采纳最佳答案前仍未回答，赏金将退还给邀请者
      </div>
    </el-alert>
    <div>
      <div class="fz-14 p-t-10 p-b-5">请输入邀请赏金 <span class="color-info">金额必须在￥1-10区间</span></div>
      <el-input-number v-model="price" :min="1" :max="10" controls-position="right" />
    </div>
    <template #footer>
      <span class="dialog-footer  flex flex-col-center">
        <el-button type="primary" @click="submit" size="small">确定</el-button>
        <el-button  @click="handleClose" size="small">取消</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script>


export default {
  name: 'InvitePriceModal',
  emits:['change'],
  data(){
    return{
      dialogVisible: false,
      dataList:[],
      price:1
    }
  },
  methods:{
    open(){
      this.dialogVisible = true
    },
    submit(){
      this.$emit('change',this.price)
      this.dialogVisible = false
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
</style>

