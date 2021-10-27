<template>
  <el-popover
    placement="right"
    :width="400"
    trigger="hover"
    :show-after="1000"
    @show="showCard"
  >
    <template #default>
      <div class="author" v-loading="loading">
        <div class="author-top">
          关于作者
          <nuxt-link class="phcent-ask-btn ask-btn-light" :to="{name:'question-publish',query:{user_id:userId}}"><i class="ri-question-line"></i>向TA提问</nuxt-link>
        </div>
        <div class="author-info">
          <el-image class="author-img img-circle" :src="userInfo.avatar_url" fit="contain"></el-image>
          <div class="flex-1 m-l-10">
            <div class="author-name  text-color-primary2-9">
              {{ userInfo.user_name }}
              <span  v-if="userInfo.is_expert===1" class="phcent-ask-btn ask-btn-light ask-btn-small">认证专家</span>
            </div>
            <div class="author-exp  text-color-primary2-4">{{userInfo.description||'这家伙很懒，什么也没写！'}}</div>
          </div>
        </div>
        <div class="author-details">
          <div class="author-details-item text-color-primary2-8">
            <span class="small text-color-primary2-5">文章</span>
            <nuxt-link class="text-color-primary2-9" :to="{name:'u-id-article',params:{id:userId}}">{{userInfo.article_num}}</nuxt-link>

          </div>
          <div class="author-details-item text-color-primary2-8">
            <span class="small text-color-primary2-5">提问</span>
            <nuxt-link class="text-color-primary2-9" :to="{name:'u-id-question',params:{id:userId}}">{{userInfo.question_num}}</nuxt-link>
          </div>
          <div class="author-details-item text-color-primary2-9">
            <span class="small text-color-primary2-5">回答被采纳</span>
            {{userInfo.answer_best_num}}
          </div>
          <div class="author-details-item text-color-primary2-9">
            <span class="small text-color-primary2-5">积分</span>
            {{userInfo.user_points}}
          </div>
          <div class="author-details-item text-color-primary2-9">
            <span class="small text-color-primary2-5">连续登录</span>
            {{userInfo.login_num}}
          </div>
          <div class="author-details-item text-color-primary2-9">
            <span class="small text-color-primary2-5">注册时间</span>
            {{userInfo.created_at}}
          </div>
        </div>
        <div class="flex flex-col-center p-t-20 m-b-20">
          <span  class="phcent-ask-btn ask-btn-primary m-r-20" @click="followItem('user',userInfo)" style="width: 100%"><i class="ri-add-fill m-r-3"></i>{{userInfo.is_follow===1?'已关注':'关注TA'}}</span>
          <span  class="phcent-ask-btn ask-btn-light" @click="$refs.MessageCreateModal.open(userInfo.id)" style="width: 100%"><i class="ri-question-answer-line m-r-3"></i>发私信</span>
        </div>
        <message-create-modal ref="MessageCreateModal"/>
      </div>
    </template>
    <template #reference>

      <slot></slot>
    </template>
  </el-popover>
</template>

<script>

import { urlWebAskCard, urlWebAskFollow } from '~/api/ask'
import MessageCreateModal from '~/components/ask/MessageCreateModal'

export default {
  name: 'AuthorCard',
  components: { MessageCreateModal },
  props:{
    userId:{
      type:[Number,String],
      default:0
    }
  },
  data(){
    return{
      loading:true,
      userInfo:{}
    }
  },
  mounted() {

  },
  methods:{
    showCard(){
      let userCardIds=this.$auth.$storage.getState('userCardIds')||{}
      if(userCardIds[this.userId]){
        this.userInfo=userCardIds[this.userId]
        this.loading=false
        return
      }
      this.$axios.get(urlWebAskCard+'/'+this.userId).then(res=>{
        userCardIds[this.userId]=res.data
        this.$auth.$storage.setState('userCardIds', userCardIds)
        this.userInfo = res.data
        this.loading = false

      }).finally(()=>{
        this.has = false
      })
    },
    followItem(type,item){
      let operate=this.is_follow
      let data={
        type:type,
        theme_id:0
      }
      if(item){
        data.theme_id=item.user_id
        operate =item.is_follow
      }
      if(operate===1){
        this.$axios.delete(urlWebAskFollow, { params:data }).then(res=>{
          this.$message.success('已取消关注')
          if(item){
            item.is_follow=0
          }
        })
      }else{
        this.$axios.post(urlWebAskFollow,data).then(res=>{
          this.$message.success('成功关注')
          if(item){
            item.is_follow=1
          }
        })
      }
    },
  }
}
</script>

<style scoped lang="scss">
.ask-btn-small{
  font-size: 0.3rem;
  padding: 0 0.125rem;
}
.author-img.img-circle {
  border: 0.075rem solid #fff;
  box-shadow: 0 0.075rem 0.15rem 0 rgba($--color-primary,0.2);
  margin: 0 0.05rem;
  width: 1.5rem;
  height: 1.5rem;
}
.author{
  width: 100%;
  padding: 0 0.5rem;
  &-top{
    display: flex;
    align-items: center;
    justify-content: space-between;
  //  border-bottom: 1px solid rgba($--color-primary2,0.05);
    padding: 0.25rem 0;
  }
  &-info{
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba($--color-primary2,0.05);
    padding: 0.25rem 0;
    .author-name{
      font-size: 0.37rem;
      font-weight: bolder;
    }
    .author-exp{
      margin-top: 5px;
      font-size: 0.3rem;
    }
  }
  &-details{
    display: flex;
    flex-wrap: wrap;
    &-item{
      padding-top: 0.5rem;
      width: 33.33%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 0.4rem;
      font-weight: bolder;
      .small{
        font-weight: normal;
        font-size: 0.3rem;
      }
    }
  }
}
</style>
