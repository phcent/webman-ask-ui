<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="举报"
    width="450px"
    append-to-body
    :before-close="handleClose"
    destroy-on-close
  >
    <el-alert title="让我们一起共建文明社区！您的反馈至关重要！" type="success" :closable="false">
    </el-alert>
    <div class="reason-list p-l-10">
      <el-radio-group v-model="query.reason">
        <el-radio v-for="(reason,key) in reasonList" :key="key" :label="Number(key)" class="m-t-20" style="width: 40%">{{ reason }}</el-radio>
      </el-radio-group>
      <el-input v-model="reasonContent" class="m-t-20" placeholder="其它信息，可选"/>
    </div>
    <template #footer>
      <span class="dialog-footer  flex flex-col-center">
        <el-button type="primary" @click="submit" size="small"
        >提交反馈</el-button
        >
      </span>
    </template>
  </el-dialog>

</template>

<script>
import { urlUserAskReport } from '~/api/user/ask'

export default {
  name: 'ReportModal',
  props:{
    reasonList:{
      type:Object,
      default(){
        return {
          1:"色情低俗",
          2:"政治敏感",
          3:"违法暴力",
          4:"恐怖血腥",
          5:"非法贩卖",
          6:"仇恨言论",
          7:"打小广告",
          8:"其他"
        }
      }
    }
  },
  data(){
    return{
      dialogVisible: false,
      reasonContent:'',
      loading:false,
      query:{
        type:1,
        theme_id:0,
        reason:1
      }
    }
  },
  methods:{
    open(type,theme_id){
      this.dialogVisible = true
      this.query={
        type:type,
        theme_id:theme_id,
        reason:1
      }
    },
    handleClose(){
      this.dialogVisible = false
    },
    submit(){
      this.loading=true
      this.$axios.post(urlUserAskReport+'/create',this.query).then(res=>{
        this.$message.success('提交成功!')
        this.dialogVisible = false
      }).finally(()=>{
        this.loading=false
      })
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



