<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="签到排行榜"
    width="500px"
    append-to-body
    :before-close="handleClose"
    destroy-on-close
  >
    <el-table :data="tableData" stripe style="width: 100%" size="small">
      <el-table-column prop="avatar" label="头像" width="100" >
        <template slot-scope="scope">
          <el-avatar :size="30" :src="scope.row.avatar_url"/>
        </template>
      </el-table-column>
      <el-table-column prop="user_name" label="昵称" />
      <el-table-column prop="num" label="连续签到" width="100" align="center" >
        <template slot-scope="scope">
          {{scope.row.days}}天
        </template>
      </el-table-column>
    </el-table>
<!--    <template #footer>-->
<!--      <span class="dialog-footer  flex flex-col-center">-->
<!--        <el-button type="primary" @click="dialogVisible = false" size="small"-->
<!--        >提交反馈</el-button-->
<!--        >-->
<!--      </span>-->
<!--    </template>-->
  </el-dialog>

</template>

<script>

export default {
  name: 'SignRankingModal',
  props:{
    tableData:{
      type:Array,
      default(){
        return []
      }
    }
  },
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
</style>


