<template>
  <div class="phcent-ask-box" v-loading="loading">
  <div class="p-30 wrapper add-page">
    <div class="box-card">
      <el-form :model="ruleForm" ref="ruleForm" label-width="auto" inline class="phcent-form"  label-position="top">
        <div class="card-header flex fz-26 flex-col-between">
          <span class="title">发布问题</span>
          <div class="phcent-ask-btn ask-btn-primary" @click="$refs.inviteModal.open()">邀请回答</div>
        </div>
        <div v-if="inviteSelectUser.id" class="m-t-20">
          <el-alert type="error" :closable="false">
            <div>
              你正在向
              <author-card :user-id="inviteSelectUser.id">
                <nuxt-link :to="'/u/'+inviteSelectUser.id" class="user-thumbnail-avatar">
                  {{inviteSelectUser.nick_name}}
                </nuxt-link>
              </author-card>
              提问,
              <span v-if="inviteSelectUser.invitePrice>0">付费邀请赏金为￥{{inviteSelectUser.invitePrice}}元</span>
              <el-button type="danger" size="mini" @click="$refs.invitePriceModal.open()">付费邀请</el-button>
              <el-button type="success" size="mini">取消邀请</el-button>
            </div>
          </el-alert>
        </div>
        <el-form-item label="问题分类" prop="cate_id" :rules="[{ required: true, message: '请选择问题分类', trigger: 'blur' }]"
                      style="width: 100%">
          <el-select v-model="ruleForm.cate_id" placeholder="选择问题分类" style="width: 100%">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.disabled"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题名称" prop="title" :rules="[{ required: true, message: '请输入问题名称', trigger: 'blur' }]"
                      style="width: 100%">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="问题标签" prop="tags"
                      style="width: 100%">
          <tags-box v-model="ruleForm.tags"/>
          <p class="color-info fz-12">标签最多添加3个；每个标签不超过8个字符；标签不能包含空格和特殊符号；按回车确认添加</p>
        </el-form-item>
        <el-form-item label="问题内容" prop="content" :rules="[{ required: true, message: '请输入问题内容', trigger: 'blur' }]" style="width: 100%" class="el-phcent-content">
            <div ref="aContent"></div>
          <el-button size="small" @click="contentImage">插入图片</el-button>
        </el-form-item>
        <el-form-item label="" prop="rewardId" style="width: 100%">
          <div>
            <el-select v-model="rewardType" placeholder="Select" size="mini"  style="width: 100px">
              <el-option label="悬赏金额" value="1"></el-option>
              <el-option label="悬赏积分" value="2"></el-option>
            </el-select>
            <span class="color-info">(价值越高越快得到高质量的回答哦)</span>
            <el-popover
              placement="right"
              :width="400"
              trigger="hover"
            >
              <template #default>
            <span class="cursor-pointer">
              <i class="ri-information-fill"></i>
              温馨提示
            </span>
                <ul class="fz-12">
                  <li>1、悬赏金额将在提问者采纳最佳答案后增加到最佳回答者账户余额</li>
                  <li>2、如果 7 天内没有任何回答者，悬赏金额将返回到提问者余额</li>
                  <li>3、如果提问者在 7 天内仍未采纳最佳答案，将由平台管理员选定最佳答案</li>
                </ul>
              </template>
              <template #reference>
            <span class="cursor-pointer">
              <i class="ri-question-fill"></i>
              悬赏规则
            </span>
              </template>
            </el-popover>
          </div>
          <div class="reward-list">
            <el-radio-group v-model="rewardId">
              <el-radio :label="-1" border class="reward-list-item">
                <span class="reward-list-item-value">无</span>
              </el-radio>
              <el-radio v-for="(item,index) in rewardType=='1'?recommendBalance:recommendPoints" :key="index" :label="item" border class="reward-list-item">
                <template v-if="item.id==6">
                  <template v-if="item.id === rewardId">
                    <el-input-number
                      v-if="rewardType==='1'"
                      v-model="item.price"
                      controls-position="right"
                    />
                    <el-input-number
                      v-else
                      v-model="item.point"
                      controls-position="right"
                    />
                  </template>
                  <span v-else class="reward-list-item-value">
                    自定义
                  </span>
                </template>
                <template v-else>
                  <span class="reward-list-item-value">
                  {{ rewardType === '1' ? '￥' + item : item + '积分' }}
                  </span>
                </template>
              </el-radio>
              <el-radio label="custom" border class="reward-list-item">
                <template v-if="rewardId==='custom'">
                  <el-input-number
                    v-if="rewardType==='1'"
                    v-model="custom"
                    controls-position="right"
                  />
                  <el-input-number
                    v-else
                    v-model="custom"
                    controls-position="right"
                  />
                </template>
                <span v-else  class="reward-list-item-value">
                  自定义
                </span>
              </el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="" prop="is_private" style="width: 100%">
          <el-checkbox v-model="ruleForm.is_private" label="私有答案" :true-label="1" :false-label="2"></el-checkbox>
          <span class="color-info">如果设定为私有答案则只有提问者和管理员可以查看答案</span>
        </el-form-item>
        <div class="fz-14 p-t-10 p-b-10 cursor-pointer flex flex-col-right" @click="showMore=!showMore">更多</div>
        <template v-if="showMore">
          <el-form-item label="seo关键词" prop="seo_title" style="width: 100%">
            <el-input v-model="ruleForm.seo_title"></el-input>
          </el-form-item>
          <el-form-item label="seo关键词" prop="seo_keyword" style="width: 100%">
            <el-input v-model="ruleForm.seo_keyword"></el-input>
          </el-form-item>
          <el-form-item label="seo描述" prop="seo_description" style="width: 100%">
            <el-input type="textarea" v-model="ruleForm.seo_description"></el-input>
          </el-form-item>
        </template>
        <el-form-item label=""  style="width: 100%">
          <el-button type="primary" @click="handleSubmit('ruleForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--    选择图片-->
    <choose-image ref="chooseImage" :max-num="imageNum" @change="selectImage"/>
    <!--邀请回答-->
    <invite-modal ref="inviteModal" @select="inviteSelect"/>
    <!--付费邀请-->
    <invite-price-modal ref="invitePriceModal" @change="invitePrice"/>
  </div>
  </div>
</template>

<script>
import {urlWebAskQuestion,urlWebAskCard} from '~/api/ask'
import TagsBox from '~/components/ask/TagsBox'
import AuthorCard from '~/components/ask/AuthorCard'
import ChooseImage from '~/components/chooseImage'
import InviteModal from '~/components/ask/InviteModal'
import InvitePriceModal from '~/components/ask/InvitePriceModal'

export default {
  name: "publish",
  components: { InvitePriceModal, InviteModal, ChooseImage, AuthorCard, TagsBox },
  layout: "ask",
  head: {
    titleTemplate: '发布问题  - %s',
  },
  data() {
    return {
      loading:true,
      imageNum: 1,
      ruleForm: {
        cate_id:'',
        tags: [],
        reward_balance:0,
        reward_points:0,
        is_private:2
      },
      categoryList: [],//分类列表
      inviteSelectUser:{
        invitePrice:0
      },//邀请解答
      tagsList: [],
      showTags: false,
      inputVisible: false,
      inputValue: '',
      rewardType: '1',//1金额 2积分
      rewardId: -1,
      custom:0,
      recommendBalance:[],
      recommendPoints:[],
      showMore:false
    }
  },
  mounted() {
    this.initEditor()
    this.getCate()
    if(this.$route.query.user_id){
      this.getUserInfo()
    }
  },
  methods: {
    getCate(){
      this.loading=true
      this.$axios.get(urlWebAskQuestion+'/create',{params:{
          group:2,
          type:1
        }}).then(res => {
        this.categoryList = res.data.cateList
        this.recommendBalance = res.data.recommendBalance
        this.recommendPoints = res.data.recommendPoints
        this.loading=false
      })
    },
    getUserInfo(){
      this.$axios.get(urlWebAskCard+'/'+this.$route.query.user_id).then(res=>{
        this.inviteSelectUser={
          id:this.$route.query.user_id,
          nick_name:res.data.user_name
        }
      })
    },
    initEditor() {
      this.editor = this.$wangEditor(this.$refs.aContent)
      this.editor.config.onchange = (html) => {
        this.ruleForm.content = html
      }
      // 配置菜单
      this.editor.config.menus = [
        'head', // 标题
        'bold', // 粗体
        // 'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        // 'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        // 'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        // 'image', // 插入图片
        // 'table', // 表格
        // 'video', // 插入视频
        'code', // 插入代码
        'undo', // 撤销
        'redo', // 重复
        // 'fullscreen' // 全屏
      ]
      this.editor.create()
      this.editor.txt.html(this.ruleForm.content)
    },
    // 邀请
    inviteSelect(item){
      this.inviteSelectUser=item
    },
    invitePrice(price){
      this.inviteSelectUser.invitePrice=price
      this.$forceUpdate()
    },
    handleSubmit(formName) {
      if(this.rewardType=='1'){
        if(this.rewardId==-1){
          this.ruleForm.reward_balance=0
        }else if(this.rewardId==='custom'){
          this.ruleForm.reward_balance=this.custom
        }else{
          this.ruleForm.reward_balance=Number(this.rewardId)
        }
      }else{
        if(this.rewardId==-1){
          this.ruleForm.reward_points=0
        }else if(this.rewardId==='custom'){
          this.ruleForm.reward_points=this.custom
        }else{
          this.ruleForm.reward_points=Number(this.rewardId)
        }
      }
      if(this.inviteSelectUser.id){
        this.ruleForm.invite_user_id = this.inviteSelectUser.id
        this.ruleForm.invite_price = this.inviteSelectUser.invitePrice
      }
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post(urlWebAskQuestion+'/create', this.ruleForm).then(res => {
            this.$confirm('发布问题成功，是否继续?', '提示', {
              confirmButtonText: '继续发布',
              cancelButtonText: '返回列表',
              type: 'warning'
            }).then(() => {
              this.ruleForm = {
                name: '',
                content: '',
                cate_id: ''
              }
              _this.$refs.ruleForm.resetFields()
              _this.$wangEditor(_this.$refs.aContent).txt.html(_this.ruleForm.content)
            }).catch(() => {
              _this.$router.push('/question')
            })
          })
        } else {
          return false
        }
      })
    },
    bannerImage() {
      this.imageNum = 1
      this.imageType = 'banner'
      this.$refs.chooseImage.open()
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
    /* 标签 */
    handleClose(tag) {
      this.ruleForm.tags.splice(this.ruleForm.tags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    selectTag(tag) {
      if (!this.ruleForm.tags.includes(tag)&&this.ruleForm.tags.length<3) {
        this.ruleForm.tags.push(tag)
      }
    },
    handleInput(value){
      this.inputValue=value.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/g,'')
        .replace(/[^\S]/g,'').slice(0,8)
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.ruleForm.tags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.add-page{
  max-width: 1000px;
  ::v-deep .el-form-item__label{
    padding: 0;
  }
}
.cursor-pointer {
  cursor: pointer;
}

.cursor-no-drop {
  cursor: no-drop;
}

.color-info {
  color: $--color-info;
}

.phcent-form {
  width: 100%;
  max-width: 17rem;
  margin: 0 auto;
}
.card-header{
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

::v-deep .el-form--inline .el-form-item__content {
  width: 100%;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.tags-list {
  padding: 10px;
  background-color: #f8f8f8;
}

.reward-list ::v-deep .el-radio__input {
  display: none;
}

.reward-list {
  &-item {
    padding: 0;
    margin-left: 0 !important;
    margin-bottom: 10px;
    line-height: 40px;
    box-sizing: content-box;
    vertical-align: top;

    ::v-deep .el-radio__label {
      padding: 0;
    }

    ::v-deep .el-input-number {
      text-align: center;
      border: none;
      width: 100px;
    }

    &-value {
      display: inline-block;
      min-width: 70px;
      padding: 0 10px;
      text-align: center;
    }
  }
}

</style>
