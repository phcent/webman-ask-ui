<template>
  <div class="text">
    <!--提示-->
    <el-alert v-if="!loggedIn" title="请登录后再发布答案" type="warning" show-icon :closable="false">
      <template #title>
        请登录后再发布答案，<nuxt-link to="/login">点击登录</nuxt-link>
      </template>
    </el-alert>
    <!--富文本-->
    <div class="m-t-20">
      <div ref="aContent" style="position: relative; z-index: 6"></div>
    </div>
    <!--按钮-->
    <div class="m-t-20">
      <template v-if="!loggedIn">
        <el-button type="primary">登录</el-button>
        <el-button type="primary" plain>注册新账号</el-button>
      </template>
      <template v-else>
        <el-button :loading="subLoading" type="primary" @click="submit">提交答案</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import {urlWebAskAnswer} from '~/api/ask'

export default {
  name: 'AnswerEditor',
  emits:['change'],
  props:{
    themeId:{
      type:[Number,String],
      default: 0
    },
  },
  data(){
    return{
      subLoading:false
    }
  },
  mounted() {
    this.initEditor()
  },
  computed:{
    loggedIn(){
      return this.$auth.loggedIn
    }
  },
  methods:{
    initEditor() {
      this.editor = this.$wangEditor(this.$refs.aContent)
      this.editor.config.onchange = (html) => {
        this.content = html
      }
      this.editor.create()
      this.editor.txt.html(this.content)
    },
    submit(){
      let data={
        content:this.content,
        question_id:this.themeId
      }
      this.$axios.post(urlWebAskAnswer+'/create',data).then(res=>{
        this.content=''
        this.editor.txt.html(this.content)
        this.$emit('change')
        this.$message.success('提交成功')
      }).finally(()=>{
        this.subLoading=false
      })
    }
  }
}
</script>

<style scoped>

</style>
