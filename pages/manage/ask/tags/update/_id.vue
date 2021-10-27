<template>
  <div>
    <user-page title="编辑话题" :btn-list="['return']" :show-explain="false" :right-options="false"></user-page>
    <el-card v-loading="loading">
      <el-form ref="form" :model="ruleForm" label-width="120px" class="mange-form">
        <el-form-item label="话题名称"  prop="name" :rules="[{ required: true, message: '请输入话题名称', trigger: 'blur' }]">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="话题图标"  prop="icon">
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
        <el-form-item label="问题数量"  prop="question_num">
          <el-input-number v-model="ruleForm.question_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="文章数量"  prop="article_num">
          <el-input-number v-model="ruleForm.article_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="关注数量"  prop="follow_num">
          <el-input-number v-model="ruleForm.follow_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="举报数量"  prop="report_num">
          <el-input-number v-model="ruleForm.report_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="热门权重"  prop="hot_sort">
          <el-input v-model="ruleForm.hot_sort"></el-input>
        </el-form-item>
        <el-form-item label="话题状态"  prop="status">
          <el-radio-group v-model="ruleForm.status" size="mini">
            <el-radio-button :label="1">正常</el-radio-button>
            <el-radio-button :label="2">隐藏</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="添加时间"  prop="created_at" >
          {{ruleForm.created_at}}
        </el-form-item>
        <el-form-item label="更新时间"  prop="updated_at" >
          {{ruleForm.updated_at}}
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" size="mini" :loading="subLoading" @click="onsubmit">提交</el-button>
          <el-button size="mini">重置</el-button>
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
  name: '_id',
  components: { UploadImg, SelectIcon, UserPage },
  layout: "admin",
  head: {
    titleTemplate: '修改话题 - 管理中心  - %s',
  },
  data(){
    return{
      subLoading:false,
      loading:true,
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
      this.loading = true
      this.$axios.get(urlAdminAskTags+'/update/'+this.$route.params.id).then(res=>{
        this.categoryType = res.data.categoryType
        this.ruleForm = res.data.info
        this.loading = false
      })
    },
    onsubmit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.subLoading=true
          this.$axios.put(urlAdminAskTags+'/update/'+this.$route.params.id, this.ruleForm).then(res => {
            this.$confirm('编辑话题成功，是否继续?', '提示', {
              confirmButtonText: '继续编辑',
              cancelButtonText: '返回列表',
              type: 'warning'
            }).then(() => {
              this.getCreate()
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
    }
  }
}
</script>

<style scoped lang="scss">
.mange-form{
  max-width: 20rem;
}
</style>


