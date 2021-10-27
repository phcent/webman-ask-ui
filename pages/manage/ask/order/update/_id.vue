<template>
  <div>
    <user-page title="编辑评论" :btn-list="['return']" :show-explain="false" :right-options="false"></user-page>
    <el-card class="p-t-10">
      <el-form ref="form" :model="ruleForm" label-width="120px" class="mange-form">
        <el-form-item label="类型">
          <el-select v-model="ruleForm.type" placeholder="请选择类型">
            <el-option v-for="(item,key) in categoryType" :key="key" :label="item" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称"  prop="title" :rules="[{ required: true, message: '请输入评论名称', trigger: 'blur' }]">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" size="mini" @click="onsubmit">提交</el-button>
          <el-button size="mini">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>

</template>

<script>
import UserPage from '~/components/ask/UserPage'
import { urlAdminAskOrder } from '~/api/admin/ask'
export default {
  name: '_id',
  components: { UserPage },
  layout: "admin",
  head: {
    titleTemplate: '修改订单 - 管理中心  - %s',
  },
  data(){
    return{
      categoryType:{},
      ruleForm:{

      }
    }
  },
  mounted() {
    this.getCreate()
  },
  methods:{
    getCreate(){
      this.$axios.get(urlAdminAskOrder+'/update/'+this.$route.params.id).then(res=>{
        this.categoryType = res.data.categoryType
        this.ruleForm = res.data.info
      })
    },
    onsubmit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$axios.put(urlAdminAskOrder+'/update/'+this.$route.params.id, this.ruleForm).then(res => {
            this.$confirm('编辑评论成功，是否继续?', '提示', {
              confirmButtonText: '继续编辑',
              cancelButtonText: '返回列表',
              type: 'warning'
            }).then(() => {
              this.getCreate()
            }).catch(() => {
              this.$router.push('/manage/ask/order')
            })
          }).catch(err => {
            this.$message.error('编辑评论失败')
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.mange-form{
  max-width: 20rem;
}
</style>


