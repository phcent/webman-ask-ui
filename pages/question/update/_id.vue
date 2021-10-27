<template>
  <div class="phcent-ask-box">
  <div class="p-20 wrapper add-page">
    <div class="box-card">
      <el-form :model="ruleForm" ref="ruleForm" label-width="auto" inline class="phcent-form"  label-position="top">
        <div class="card-header flex fz-26 flex-col-space">
          <span class="title">编辑问题</span>
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
          <p class="color-info fz-12">标签最多添加3个；每个标签不超过8个字符；标签不能包含空格和特殊符号</p>
        </el-form-item>
        <el-form-item label="问题内容" prop="content" :rules="[{ required: true, message: '请输入问题内容', trigger: 'blur' }]" class="el-phcent-content" style="width: 100%">
          <div ref="aContent"></div>
          <el-button size="small" @click="contentImage">插入图片</el-button>
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
    <choose-image ref="chooseImage" :max-num="imageNum" @change="selectImage"></choose-image>
  </div>
  </div>
</template>

<script>
import {urlWebAskQuestion} from '~/api/ask'
import TagsBox from '~/components/ask/TagsBox'
import ChooseImage from '~/components/chooseImage'

export default {
name: "_id",
  components: { ChooseImage, TagsBox },
  layout: "ask",
  head: {
    titleTemplate: '更新文章  - %s',
  },
  async asyncData(ctx) {
    let res = await ctx.$axios.get(urlWebAskQuestion + '/update/'+ctx.params.id)
    let tags=[]
    if(res.data.info.tags.length>0){
      tags=res.data.info.tags.map(item=>{
        return item.name
      })
    }
    res.data.info.tags = tags;
    return{
      categoryList:res.data.cateList,
      ruleForm : res.data.info,
    }
  },
  data() {
    return {
      imageNum: 1,
      ruleForm: {
        tags: []
      },
      categoryList: [],//分类列表
      tagsList: [],
      showTags: false,
      inputVisible: false,
      inputValue: '',
      showMore:false
    }
  },
  mounted() {
    this.initEditor()
  },
  methods: {
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
    handleSubmit(formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.put(urlWebAskQuestion+'/update/'+this.$route.params.id, this.ruleForm).then(res => {
            this.$confirm('编辑问题成功，是否继续?', '提示', {
              confirmButtonText: '继续编辑',
              cancelButtonText: '返回列表',
              type: 'warning'
            }).then(() => {
              // this.ruleForm = {
              //   name: '',
              //   content: '',
              //   cate_id: ''
              // }
              // _this.$refs.ruleForm.resetFields()
              // _this.$wangEditor(_this.$refs.aContent).txt.html(_this.ruleForm.content)
            }).catch(() => {
              _this.$router.push('/question/'+_this.$route.params.id)
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
