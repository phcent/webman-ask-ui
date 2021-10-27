<template>
  <div>
    <user-page title="编辑文章" :btn-list="['return']" :show-explain="false" :right-options="false"></user-page>
    <el-card v-loading="loading">
      <el-form ref="form"  :model="ruleForm" label-width="120px" class="mange-form">
        <el-form-item label="会员"  prop="user_id" :rules="[{ required: true, message: '请输入文章名称', trigger: 'blur' }]">
          <el-input v-model="ruleForm.user_id"></el-input>
        </el-form-item>
        <el-form-item label="标题"  prop="title" :rules="[{ required: true, message: '请输入文章名称', trigger: 'blur' }]">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="分类"  prop="cate_id" :rules="[{ required: true, message: '请输入文章名称', trigger: 'blur' }]">
          <el-select v-model="ruleForm.cate_id" placeholder="Select">
            <el-option
              v-for="item in category"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容"  prop="content" :rules="[{ required: true, message: '请输入问题内容', trigger: 'blur' }]">
          <span style="width: 100%">
            <div ref="aContent" style="position: relative; z-index: 6"></div>
          </span>
          <el-button size="small" @click="contentImage">插入图片</el-button>
        </el-form-item>
        <el-form-item label="付费金额"  prop="reward_balance" >
          <el-input-number v-model="ruleForm.reward_balance" :min="0" :precision="2" :step="0.1" controls-position="right" />
        </el-form-item>
        <el-form-item label="积分"  prop="reward_points" >
          <el-input-number v-model="ruleForm.reward_points" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="付费次数"  prop="pay_num" >
          <el-input-number v-model="ruleForm.pay_num" :min="0" controls-position="right" />
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
        <el-form-item label="分享次数"  prop="share_num" >
          <el-input-number v-model="ruleForm.share_num" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="热门权重"  prop="hot_sort">
          <el-input v-model="ruleForm.hot_sort"></el-input>
        </el-form-item>
        <el-form-item label="置顶权重"  prop="top_sort">
          <el-input v-model="ruleForm.top_sort"></el-input>
        </el-form-item>
        <el-form-item label="权重"  prop="sort">
          <el-input v-model="ruleForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="seo关键词"  prop="keyword">
          <el-input v-model="ruleForm.keyword"></el-input>
        </el-form-item>
        <el-form-item label="seo描述"  prop="description">
          <el-input v-model="ruleForm.description" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="添加时间"  prop="created_at">
          {{ruleForm.created_at}}
        </el-form-item>
        <el-form-item label="更新时间"  prop="updated_at">
          {{ruleForm.updated_at}}
        </el-form-item>
        <el-form-item label="状态"  prop="status" >
          <el-radio-group v-model="ruleForm.status" size="mini">
            <el-radio-button :label="1">正常</el-radio-button>
            <el-radio-button :label="2">隐藏</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" size="mini" @click="onsubmit">提交</el-button>
          <el-button size="mini">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!--    选择图片-->
    <choose-image ref="chooseImage" :max-num="imageNum" @change="selectImage"></choose-image>
  </div>
</template>

<script>
import UserPage from '~/components/ask/UserPage'
import { urlAdminAskArticle } from '~/api/admin/ask'
import ChooseImage from '~/components/chooseImage'
export default {
  name: 'index',
  components: { ChooseImage, UserPage },
  layout: "admin",
  head: {
    titleTemplate: '修改文章 - 管理中心  - %s',
  },
  data(){
    return{
      loading:true,
      category:[],
      ruleForm:{
        content:''
      },
      editor:'',
      imageNum:1,
      imageType:'content',
    }
  },
  mounted() {
    this.initEditor()
    this.getCreate()
  },
  methods:{
    getCreate(){
      this.loading=true
      this.$axios.get(urlAdminAskArticle+'/update/'+this.$route.params.id).then(res=>{
        this.category = res.data.category
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
          this.$axios.put(urlAdminAskArticle+'/update/'+this.$route.params.id, this.ruleForm).then(res => {
            this.$confirm('编辑文章成功，是否继续?', '提示', {
              confirmButtonText: '继续编辑',
              cancelButtonText: '返回列表',
              type: 'warning'
            }).then(() => {
              this.getCreate()
            }).catch(() => {
              this.$router.push('/manage/ask/article')
            })
          })
        } else {
          return false
        }
      })
    },

  }
}
</script>

<style scoped lang="scss">
.mange-form{
  max-width: 20rem;
}

</style>


