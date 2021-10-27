<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="邀请解答"
    width="500px"
    append-to-body
    :before-close="handleClose"
    destroy-on-close
  >
    <el-alert title="邀请好友来解答问题吧！每天可以发送10次邀请！付费邀请无限制" type="warning" :closable="false">
    </el-alert>
    <el-table v-loading="loading" :data="dataList" stripe style="width: 100%" size="small">
      <el-table-column prop="avatar" label="头像" width="100" >
        <template slot-scope="scope">
          <el-avatar :size="30" :src="scope.row.avatar_url"/>
        </template>
      </el-table-column>
      <el-table-column prop="nick_name" label="昵称" />
      <el-table-column prop="num" label="操作" width="200" align="center" fixed="right" >
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="inviteSubmit(scope.row)">邀请TA</el-button>
          <el-button size="mini" type="danger" @click="invitePrice(scope.row)">付费邀请</el-button>
        </template>
      </el-table-column>
    </el-table>
    <invite-price-modal ref="invitePriceModal" @change="priceChange"/>
  </el-dialog>

</template>

<script>

import { urlWebAskUser } from '~/api/ask'
import InvitePriceModal from '~/components/ask/InvitePriceModal'

export default {
  name: 'InviteModal',
  components: { InvitePriceModal },
  emits:['select'],
  data(){
    return{
      loading:false,
      dialogVisible: false,
      dataList:[],
      inviteSelectUser:{}
    }
  },
  methods:{
    open(){
      this.dialogVisible = true
      this.getList()
    },
    getList(){
      this.loading=true
      this.$axios.get(urlWebAskUser,{params:this.query}).then(res=>{
        this.dataList=res.data.list
        this.loading=false
      })
    },
    handleClose(){
      this.dialogVisible = false
    },
    // 邀请
    inviteSubmit(row){
      this.inviteSelectUser = row
      this.inviteSelectUser.invitePrice=0
      this.$emit('select',this.inviteSelectUser)
      this.dialogVisible = false
    },
    // 付费邀请
    invitePrice(row){
      this.inviteSelectUser = row
      this.inviteSelectUser.invitePrice = 0
      this.$refs.invitePriceModal.open()
    },
    //付费回调
    priceChange(price){
      this.inviteSelectUser.invitePrice = price
      this.$emit('select',this.inviteSelectUser)
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
