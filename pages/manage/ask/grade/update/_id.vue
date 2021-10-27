<template>
  <div>
    <user-page title="编辑会员等级" :btn-list="['return']" :show-explain="false" :right-options="false"></user-page>
    <el-card class="p-t-10" v-loading="loading">
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
        <el-form-item label="添加时间"  prop="created_at" >
          {{ruleForm.created_at}}
        </el-form-item>
        <el-form-item label="更新时间"  prop="updated_at" >
          {{ruleForm.updated_at}}
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" size="mini" :loading="loading" @click="onsubmit">提交</el-button>
          <el-button size="mini">重置</el-button>
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
  name: '_id',
  components: { UploadImg, SelectIcon, UserPage },
  layout: "admin",
  head: {
    titleTemplate: '修改会员等级 - 管理中心  - %s',
  },
  data(){
    return{
      loading:true,
      ruleForm:{

      },
      subLoading:false
    }
  },
  mounted() {
    this.getCreate()
  },
  methods:{
    getCreate(){
      this.loading = true
      this.$axios.get(urlAdminAskGrade+'/update/'+this.$route.params.id).then(res=>{
        this.ruleForm = res.data.info
        this.loading = false
      })
    },
    onsubmit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.subLoading=true
          this.$axios.put(urlAdminAskGrade+'/update/'+this.$route.params.id, this.ruleForm).then(res => {
            this.$confirm('编辑等级成功，是否继续?', '提示', {
              confirmButtonText: '继续编辑',
              cancelButtonText: '返回列表',
              type: 'warning'
            }).then(() => {
              this.getCreate()
            }).catch(() => {
              this.$router.push('/manage/ask/grade')
            })
          }).finally(()=>{
            this.subLoading=false
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


