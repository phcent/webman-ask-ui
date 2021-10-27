<template>
  <div>
    <div class="wrapper user-page">
      <div class="user-page-left">
        <user-left-nav></user-left-nav>
      </div>
      <div class="user-page-right">
        <div class="blog-page-left-tabs">
          <div class="blog-page-left-tabs-item tabs-on">
            <nuxt-link to="" class="item-a">
              个人资料
            </nuxt-link>
          </div>
        </div>
        <el-card class="user-card">
          <el-form class="phcent-form" ref="form" :model="form" label-width="120px">
            <el-form-item label="">
              <el-upload
                class="upload-demo"
                :action="action"
                :on-success="handleSuccess"
                :headers="{ Authorization:$auth.strategy.token.get() }"
                :show-file-list="false"
              >
                <el-avatar :size="80" :src="form.avatar_url"></el-avatar>
              </el-upload>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="form.name" style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="form.nick_name" style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item label="个人介绍">
              <el-input v-model="form.description"></el-input>
              <span class="color-info fz-12">一句话介绍一下你自己</span>
            </el-form-item>
            <el-form-item label="邮箱">
              {{ form.email }}
              <el-button type="primary" size="mini" @click="$refs.userProfileModal.open('email')">修改</el-button>
            </el-form-item>
            <el-form-item label="手机号">
              {{form.mobile}}
              <el-button type="primary" size="mini" @click="$refs.userProfileModal.open('mobile')">修改</el-button>
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" size="mini" @click="submit">确认</el-button>
              <el-button size="mini">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
    <user-profile-modal ref="userProfileModal"/>
  </div>
</template>

<script>
import {urlUserAskInfoProfile} from '~/api/user/ask'
import UserLeftNav from '~/components/ask/UserLeftNav'
import UserProfileModal from '~/components/ask/UserProfileModal'
export default {
  name: "profile",
  components: { UserProfileModal, UserLeftNav },
  layout:"ask",
  head: {
    titleTemplate: '个人资料 - 会员中心 - %s',
  },
  data(){
    return{
      action:'',
      form:{}
    }
  },
  mounted() {
    this.getInfo()
  },
  methods:{
    getInfo(){
      this.$axios.get(urlUserAskInfoProfile).then(res=>{
        this.form = res.data
      })
    },
    submit(){
      this.$axios.post(urlUserAskInfoProfile,{
        name:this.form.name,
        nick_name:this.form.nick_name,
        description:this.form.description
      }).then(res=>{
        this.$message.success('提交成功')
      })
    },
    handleSuccess(response, file, fileList){
      console.log(response)
      this.$message.success('上传成功！')
      this.getList()
    },
  }
}
</script>

<style scoped lang="scss">
.user-page-right{
  .user-card {
    padding: 20px;
  }
}
</style>
