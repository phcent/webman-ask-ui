<template>
  <div>
    <user-page title="编辑评论" :btn-list="['return']" :show-explain="false" :right-options="false"></user-page>
    <el-card v-loading="loading">
      <el-form ref="form" :model="ruleForm" label-width="120px" class="mange-form">
        <el-form-item label="来源编号"  prop="theme_id" :rules="[{ required: true, message: '请输入评论名称', trigger: 'blur' }]">
          <el-input v-model="ruleForm.theme_id"></el-input>
        </el-form-item>
        <el-form-item label="会员编号"  prop="user_id" :rules="[{ required: true, message: '请输入评论名称', trigger: 'blur' }]">
          <el-input v-model="ruleForm.user_id"></el-input>
        </el-form-item>
        <el-form-item label="回答内容"  prop="content" :rules="[{ required: true, message: '请输入评论名称', trigger: 'blur' }]">
          <span style="width: 100%">
            <div ref="aContent" style="position: relative; z-index: 6"></div>
          </span>
          <el-button size="small" @click="contentImage">插入图片</el-button>
        </el-form-item>
        <el-form-item label="回复会员"  prop="replay_user_id" :rules="[{ required: true, message: '请输入评论名称', trigger: 'blur' }]">
          <el-input v-model="ruleForm.replay_user_id"></el-input>
        </el-form-item>
        <el-form-item label="回复对象"  prop="type" :rules="[{ required: true, message: '请输入评论名称', trigger: 'blur' }]">
          <el-input v-model="ruleForm.type"></el-input>
        </el-form-item>
        <el-form-item label="点赞次数"  prop="digg_num" >
          <el-input-number v-model="ruleForm.digg_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="点踩次数"  prop="step_num" >
          <el-input-number v-model="ruleForm.step_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="浏览次数"  prop="view_num" >
          <el-input-number v-model="ruleForm.view_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="分享次数"  prop="share_num" >
          <el-input-number v-model="ruleForm.share_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="举报次数"  prop="report_num" >
          <el-input-number v-model="ruleForm.report_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="收藏次数"  prop="collection_num" >
          <el-input-number v-model="ruleForm.collection_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="感谢次数"  prop="thank_num" >
          <el-input-number v-model="ruleForm.thank_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="评论次数"  prop="reply_num" >
          <el-input-number v-model="ruleForm.reply_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="添加时间"  prop="created_at" >
          {{ruleForm.created_at}}
        </el-form-item>
        <el-form-item label="更新时间"  prop="updated_at" >
          {{ruleForm.updated_at}}
        </el-form-item>
        <el-form-item label="状态"  prop="status" >
          <el-radio-group v-model="ruleForm.status" size="mini">
            <el-radio-button label="1">正常</el-radio-button>
            <el-radio-button label="2">隐藏</el-radio-button>
          </el-radio-group>
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
import { urlAdminAskReply } from '~/api/admin/ask'
export default {
  name: '_id',
  components: { UserPage },
  layout: "admin",
  head: {
    titleTemplate: '修改评论 - 管理中心  - %s',
  },
  data(){
    return{
      loading:true,
      categoryType:{},
      ruleForm:{

      }
    }
  },
  mounted() {
    this.initEditor()
    this.getCreate()
  },
  methods:{
    getCreate(){
      this.$axios.get(urlAdminAskReply+'/update/'+this.$route.params.id).then(res=>{
        this.categoryType = res.data.categoryType
        this.ruleForm = res.data.info
        let that=this
        setTimeout(function(){
          that.editor.txt.html(that.ruleForm.content)
        },100)
        this.loading=false
      })
    },
    initEditor() {
      this.editor = this.$wangEditor(this.$refs.aContent)
      this.editor.config.onchange = (html) => {
        this.ruleForm.content = html
      }
      this.editor.create()
      this.editor.txt.html(this.ruleForm.content)
    },
    contentImage() {
      this.imageNum = 0
      this.imageType = 'content'
      this.$refs.chooseImage.open()
    },
    selectImage(data) {
      if (this.imageType === 'banner') {
        this.ruleForm.image_name = data[0].name
        this.ruleForm.image_url = data[0].files_url
        this.$forceUpdate()
      } else {
        data.forEach(item => {
          let value = '<img src="' + item.files_url + '" data-name="' + item.name + '" alt=""/>'
          this.editor.cmd.do('insertHTML', value)
        })
      }
    },
    onsubmit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$axios.put(urlAdminAskReply+'/update/'+this.$route.params.id, this.ruleForm).then(res => {
            this.$confirm('编辑评论成功，是否继续?', '提示', {
              confirmButtonText: '继续编辑',
              cancelButtonText: '返回列表',
              type: 'warning'
            }).then(() => {
              this.getCreate()
            }).catch(() => {
              this.$router.push('/manage/ask/reply')
            })
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


