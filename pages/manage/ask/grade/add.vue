<template>
  <div>
    <user-page title="新增等级" :btn-list="['return']" :show-explain="false" :right-options="false"></user-page>
    <el-card class="p-t-10">
      <el-form ref="form" :model="ruleForm" label-width="120px" class="mange-form">
        <el-form-item label="等级名称"  prop="name" :rules="[{ required: true, message: '请输入话题名称', trigger: 'blur' }]">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="等级图片"  prop="image_name">
          <upload-img></upload-img>
        </el-form-item>
        <el-form-item label="所需积分"  prop="points" >
          <el-input-number v-model="ruleForm.points" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" size="mini" @click="onsubmit">提交</el-button>
          <el-button size="mini" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import UserPage from '~/components/ask/UserPage'
import { urlAdminAskGrade } from '~/api/admin/ask'
import SelectIcon from '~/components/SelectIcon'
import UploadImg from '~/components/UploadImg'
export default {
  name: 'add',
  components: { UploadImg, SelectIcon, UserPage },
  layout: "admin",
  head: {
    titleTemplate: '添加会员等级 - 管理中心  - %s',
  },
  data(){
    return{
      categoryType:{},
      ruleForm:{
        hot_sort:0,
        status:1
      }
    }
  },
  mounted() {
    this.getCreate()
  },
  methods:{
    getCreate(){
      this.$axios.get(urlAdminAskGrade + '/create').then(res=>{
        this.categoryType = res.data.categoryType
      })
    },
    onsubmit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$axios.post(urlAdminAskGrade + '/create', this.ruleForm).then(res => {
            this.$confirm('添加等级成功，是否继续?', '提示', {
              confirmButtonText: '继续添加',
              cancelButtonText: '返回列表',
              type: 'warning'
            }).then(() => {
              this.resetForm()
            }).catch(() => {
              this.$router.push('/manage/ask/grade')
            })
          }).catch(err => {
            this.$message.error('添加等级失败')
          })
        } else {
          return false
        }
      })
    },
    resetForm(){
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style scoped lang="scss">
.mange-form{
  max-width: 20rem;
}
</style>
