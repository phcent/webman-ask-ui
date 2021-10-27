<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="感谢"
    width="500px"
    append-to-body
    :before-close="handleClose"
    destroy-on-close
  >
    <el-alert title="我们应该多多支持小伙伴的分享及热心帮助！" type="warning" :closable="false">
    </el-alert>
    <div>
      <div class="user flex flex-col-center flex-col flex-row-center p-20">
        <el-avatar :size="90"></el-avatar>
        <span class="fz-12 m-t-5">昵称</span>
      </div>
      <div class="price-box">
        <el-radio-group v-model="priceId" class="price-list">
          <el-radio v-for="price in priceList" :key="price.id" :label="price.id" class="price-list-item">￥{{ price.num }}元</el-radio>
        </el-radio-group>
        <el-input v-model="message" placeholder="请输入你的留言，可选"/>
      </div>
      <div class="pay-box">
        <el-radio-group v-model="payId" class="pay-type">
          <el-radio v-for="pay in payType" :key="pay.id" :label="pay.id" class="m-t-20">{{ pay.name }}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer  flex flex-col-center">
        <el-button type="primary" @click="dialogVisible = false" size="small">立即支付</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script>
export default {
  name: 'ThankModal',
  data(){
    return{
      dialogVisible: false,
      priceList:[
        {
          id:1,
          num:1
        },
        {
          id:2,
          num:5
        },
        {
          id:3,
          num:10
        },
        {
          id:4,
          num:20
        },
        {
          id:5,
          num:50
        },
        {
          id:6,
          num:100
        }
      ],
      priceId:1,
      message:'',
      payType:[
        {
          id:1,
          name:'微信'
        },
        {
          id:2,
          name:'支付宝'
        },
        {
          id:3,
          name:'余额支付'
        }
      ],
      payId:1
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
.price-box{
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 20px;
  .price-list{
    width: 100%;
    .price-list-item{
      width: 30%;
      margin-bottom: 20px;
      background-color: rgba($--color-primary,0.1);
      margin-right: 5%;
      border-radius: 3px;
      color:$--color-primary;
      &:hover{
        background-color: $--color-primary;
        ::v-deep .el-radio__label{
          color: $--color-white;
        }
      }
      ::v-deep .el-radio__input{
        display: none;
      }
      ::v-deep .el-radio__label{
        padding: 0;
        display: flex;
        width: 100%;
        height: 35px;
        align-items: center;
        justify-content: center;
      }
      &:nth-child(3n){
        margin-right: 0;
      }
      &.is-checked{
        background-color: $--color-primary;
        ::v-deep .el-radio__label{
          color: $--color-white;
        }
      }
    }
  }
}
.pay-type{
  width: 100%;
  display: flex;
  justify-content: space-around;
}
</style>
