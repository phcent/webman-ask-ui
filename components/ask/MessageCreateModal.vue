<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="发送私信"
    width="500px"
    append-to-body
    :before-close="handleClose"
    destroy-on-close
  >
    <el-input v-model="content" type="textarea" :rows="5" placeholder="请输入私信内容"/>
    <template #footer>
      <span class="dialog-footer  flex flex-col-center">
        <el-button type="primary" @click="submit" size="small">确定</el-button>
        <el-button  @click="handleClose" size="small">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { urlUserAskMessage } from '~/api/user/ask'

export default {
  name: 'MessageCreateModal',
  data(){
    return{
      dialogVisible:false,
      content:'',
      to_user_id:''
    }
  },
  methods:{
    open(id){
      this.to_user_id = id
      this.dialogVisible = true
    },
    submit(){
      this.$axios.post(urlUserAskMessage+'/create',{
        content:this.content,
        to_user_id:this.to_user_id
      }).then(res=>{
        this.$message.success('已发送')
        this.content=''
        this.dialogVisible = false
      })
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
