<template>
  <div>
    <user-page title="编辑会员" :btn-list="['return']" :show-explain="false" :right-options="false"></user-page>
    <el-card v-loading="loading">
      <el-form ref="form" :model="ruleForm" label-width="120px" class="mange-form">
        <!--        <el-form-item label="类型">-->
        <!--          <el-select v-model="ruleForm.type" placeholder="请选择类型">-->
        <!--            <el-option v-for="(item,key) in categoryType" :key="key" :label="item" :value="key"></el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="会员等级"  prop="grade_id" :rules="[{ required: true, message: '请输入评论名称', trigger: 'blur' }]">
          <el-input v-model="ruleForm.grade_id"></el-input>
        </el-form-item>
        <el-form-item label="认证专家"  prop="is_expert" >
          <el-radio-group v-model="ruleForm.is_expert" size="mini">
            <el-radio-button :label="1">是</el-radio-button>
            <el-radio-button :label="2">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提问数量"  prop="question_num" >
          <el-input-number v-model="ruleForm.question_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="回答数量"  prop="answer_num" >
          <el-input-number v-model="ruleForm.answer_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="答案被采纳数量"  prop="answer_best_num" >
          <el-input-number v-model="ruleForm.answer_best_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="文章数量"  prop="article_num" >
          <el-input-number v-model="ruleForm.article_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="评论数量"  prop="reply_num" >
          <el-input-number v-model="ruleForm.reply_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="收藏数量"  prop="collection_num" >
          <el-input-number v-model="ruleForm.collection_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="关注数量"  prop="follow_num" >
          <el-input-number v-model="ruleForm.follow_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="被浏览数量"  prop="view_num" >
          <el-input-number v-model="ruleForm.view_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="粉丝数量"  prop="fans_num" >
          <el-input-number v-model="ruleForm.fans_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="热门权重"  prop="hot_sort" >
          <el-input-number v-model="ruleForm.hot_sort" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="是否超管"  prop="is_admin" >
          <el-radio-group v-model="ruleForm.is_admin" size="mini">
            <el-radio-button :label="1">是</el-radio-button>
            <el-radio-button :label="2">否</el-radio-button>
          </el-radio-group>
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
import { urlAdminAskUser } from '~/api/admin/ask'
export default {
  name: '_id',
  components: { UserPage },
  layout: "admin",
  head: {
    titleTemplate: '修改会员 - 管理中心  - %s',
  },
  data(){
    return{
      loading:false,
      subLoading:false,
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
      this.loading=true
      this.$axios.get(urlAdminAskUser+'/update/'+this.$route.params.id).then(res=>{
        // this.categoryType = res.data.categoryType
        this.ruleForm = res.data.info
        this.loading=false
      })
    },
    onsubmit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.subLoading=true
          this.$axios.put(urlMangeReply+'/update/'+this.$route.params.id, this.ruleForm).then(res => {
            this.$confirm('编辑评论成功，是否继续?', '提示', {
              confirmButtonText: '继续编辑',
              cancelButtonText: '返回列表',
              type: 'warning'
            }).then(() => {
              this.getCreate()
            }).catch(() => {
              this.$router.push('/manage/ask/user')
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


