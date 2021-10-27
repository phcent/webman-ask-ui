<template>
  <div>
    <user-page title="新增话题" :btn-list="['return']" :show-explain="false" :right-options="false"></user-page>
    <el-card class="p-t-10">
      <el-form ref="form" :model="ruleForm" label-width="120px" class="mange-form">
        <el-form-item label="话题名称"  prop="name" :rules="[{ required: true, message: '请输入话题名称', trigger: 'blur' }]">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="话题图标"  prop="icon" >
          <select-icon v-model="ruleForm.icon"/>
        </el-form-item>
        <el-form-item label="话题图片"  prop="image">
          <upload-img></upload-img>
        </el-form-item>
        <el-form-item label="seo关键词"  prop="keyword" >
          <el-input v-model="ruleForm.keyword"></el-input>
        </el-form-item>
        <el-form-item label="话题描述"  prop="description">
          <el-input v-model="ruleForm.description" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="热门权重"  prop="hot_sort">
          <el-input-number v-model="ruleForm.hot_sort" :min="0" :max="999" controls-position="right" />
        </el-form-item>
        <el-form-item label="话题状态"  prop="status">
          <el-radio-group v-model="ruleForm.status" size="mini">
            <el-radio-button label="1">正常</el-radio-button>
            <el-radio-button label="2">隐藏</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" size="mini" :loading="subLoading" @click="onsubmit">提交</el-button>
          <el-button size="mini" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import UserPage from '~/components/ask/UserPage'
import { urlAdminAskTags } from '~/api/admin/ask'
import SelectIcon from '~/components/SelectIcon'
import UploadImg from '~/components/UploadImg'
export default {
  name: 'add',
  components: { UploadImg, SelectIcon, UserPage },
  layout: "admin",
  head: {
    titleTemplate: '添加话题 - 管理中心  - %s',
  },
  data(){
    return{
      loading:true,
      categoryType:{},
      ruleForm:{
        hot_sort:0,
        status:1
      },
      subLoading:false
    }
  },
  mounted() {
    this.getCreate()
  },
  methods:{
    getCreate(){
      this.loading=true
      this.$axios.get(urlAdminAskTags + '/create').then(res=>{
        this.categoryType = res.data.categoryType
        this.loading=false
      })
    },
    onsubmit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.subLoading=true
          this.$axios.post(urlAdminAskTags + '/create', this.ruleForm).then(res => {
            this.$confirm('添加话题成功，是否继续?', '提示', {
              confirmButtonText: '继续添加',
              cancelButtonText: '返回列表',
              type: 'warning'
            }).then(() => {
              this.resetForm()
            }).catch(() => {
              this.$router.push('/manage/ask/tags')
            })
          }).finally(()=>{
            this.subLoading=false
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
