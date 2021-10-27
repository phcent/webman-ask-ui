<template>
  <div class="user-detail">
    <el-row :gutter="20">
      <el-col :xs="8" :sm="8" :md="4" >
        <el-avatar :size="160" shape="square" :src="userInfo.avatar_url"></el-avatar>
      </el-col>
      <el-col :xs="16" :sm="16" :md="12" >
        <div class="user-detail-info">
          <div class="user-detail-info-name">
            {{ userInfo.user_name }}
            <span v-if="userInfo.is_expert===1" class="phcent-ask-btn ask-btn-light">认证专家</span>
          </div>
          <div class="user-detail-info-exp">
            {{userInfo.description||'这家伙很懒，什么也没有留下'}}
          </div>
          <el-divider></el-divider>
          <div class="user-detail-info-more ">
            <span class=" p-b-8 fz-12" :class="[userInfo.is_online===1?'expert-item-online':'expert-item-unset']">
              <i class="ri-record-circle-fill"></i>{{userInfo.is_online===1?'在线':'离线'}}
            </span>
            注册于{{userInfo.created_at}}
          </div>

        </div>
      </el-col>
      <el-col :xs="24" :sm="16" :md="8" >
        <div class="author-details">
          <div class="author-details-item">
            <span class="small">文章</span>
            {{ userInfo.article_num }}
          </div>
          <div class="author-details-item">
            <span class="small">提问</span>
            {{ userInfo.question_num }}
          </div>
          <div class="author-details-item">
            <span class="small">粉丝</span>
            {{ userInfo.fans_num }}
          </div>
        </div>
        <div class="flex flex-col-center">
          <template v-if="isOwn">
            <a class="phcent-ask-btn ask-btn-primary m-r-20" @click="$router.push('/question/publish')">
              <i class="ri-question-fill"></i>发布问题
            </a>
            <a class="phcent-ask-btn ask-btn-primary" @click="$router.push('/article/publish')">
              <i class="ri-pencil-fill"></i>发布文章
            </a>
          </template>
          <template v-else>
            <a class="phcent-ask-btn ask-btn-primary m-r-15"  @click="followItem">
              <i class="ri-add-fill"></i>{{ is_follow===1?'已关注':'关注TA' }}
            </a>
            <a class="phcent-ask-btn ask-btn-primary m-r-15" @click="$router.push({path:'/question/publish',query:{user_id:userInfo.user_id}})">
              <i class="ri-question-fill"></i>向TA提问
            </a>
            <a class="phcent-ask-btn ask-btn-primary">
              <i class="ri-question-answer-line"></i>发私信
            </a>
          </template>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { urlWebAskFollow } from '~/api/ask'

export default {
  name: 'ExpertHomeTop',
  props:{
    userInfo:{
      type:Object,
      default(){
        return {}
      }
    }
  },
  computed:{
    isOwn(){
      if(this.$auth.user){
        if(this.$route.params.id == this.$auth.user.id){
          return true
        }
      }
      return false
    }
  },
  watch:{
    userInfo:{
      handler(val){
        this.is_follow=val.is_follow
      },
      immediate:true
    }
  },
  data(){
    return{
      is_follow:0
    }
  },
  methods:{
    /* 关注问题*/
    followItem(){
      let data={
        type:'user',
        theme_id:this.userInfo.user_id
      }
      if(this.is_follow===1){
        this.$axios.delete(urlWebAskFollow, { params:data }).then(res=>{
          this.$message.success('已取消关注')
          this.is_follow=0
        })
      }else{
        this.$axios.post(urlWebAskFollow,data).then(res=>{
          this.$message.success('成功关注')
          this.is_follow=1
        })
      }
    },
  }
}
</script>

<style scoped lang="scss">

.user-detail{
  padding: 50px 0;
  &-info{
    &-name{
      font-size: 0.45rem;
    }
    &-exp{
      margin-top: 5px;
      font-size: 0.35rem;
      color: rgba($--color-primary2,0.7);
    }
    &-more{
      font-size: 0.35rem;
      color: rgba($--color-primary2,0.7);
    }
  }
}
.author-details{
  display: flex;
  flex-wrap: wrap;
  &-item{
    padding: 20px 0;
    width: 33.33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 0.35rem;
    font-weight: bolder;
    .small{
      font-weight: normal;
      color: #999;
      font-size: 0.3rem;
    }
  }
}
.author-operate{
  i{
    vertical-align: bottom;
  }
}
</style>
