<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="追加悬赏"
    width="30%"
    append-to-body
    :before-close="handleClose"
    destroy-on-close
  >
    <el-alert  type="warning" :closable="false">
      <template #title>
        <p>当前问题悬赏金额为：￥10元</p>
      </template>
      你可以继续追加悬赏金额，悬赏金额越高，越快得到高质量的回答哦！
    </el-alert>
    <div class="price-box p-t-20">
      <el-radio-group v-model="priceId" class="price-list">
        <el-radio v-for="price in priceList" :key="price.id" :label="price.id" class="price-list-item">￥{{ price.num }}元</el-radio>
      </el-radio-group>
    </div>
    <div class="balance">
      您当前账户余额为：￥234.22元
      <a>去充值</a>
    </div>
    <template #footer>
      <span class="dialog-footer  flex flex-col-center">
        <el-button type="primary" @click="dialogVisible = false" size="small">确认追加</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script>
export default {
  name: 'RewardModal',
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
.balance{
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}
</style>
