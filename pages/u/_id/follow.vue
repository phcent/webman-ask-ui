<template>
  <div class="homepage phcent-ask-box">
    <div class="wrapper">
      <expert-home-top :user-info="userInfo"/>
      <div class="phcent-ask-row">
        <div class="phcent-ask-row-lt">
          <!--列表状态-->
          <div class="blog-page-left-tabs">
            <div v-for="item in tabsList" :key="item.key" class="blog-page-left-tabs-item" :class="{'tabs-on':item.key===query.type}">
              <nuxt-link :to="{path:$route.path,query:{type:item.key}}" class="item-a">
                {{isOwn?'我':'TA'}}{{item.name}}
              </nuxt-link>
            </div>
          </div>
          <div class="phcent-ask-whiteBox">
            <div v-if="query.type === 'user'" class="expert-list clearfix flex flex-auto">
              <div v-for="item in dataList" class="flex-3">
                <div class="phcent-ask-expert-item">
                  <author-card :user-id="item.id">
                    <nuxt-link  :to="{name:'u-id',params:{id:item.id}}" class="phcent-ask-expert-item-img">
                      <el-image class="img-circle img-full" :src="item.avatar_url" fit="contain"></el-image>
                    </nuxt-link>
                  </author-card>
                  <div class="phcent-ask-expert-item-box">
                    <div class="p-t-10 p-b-10 expert-item-user">
                      <author-card :user-id="item.id">
                        <nuxt-link :to="{name:'u-id',params:{id:item.id}}" :title="item.user_name">
                          {{ item.user_name }}</nuxt-link>
                      </author-card>
                    </div>
                    <div class="flex flex-row-center p-b-8 fz-12" :class="[item.is_online===1?'expert-item-online':'expert-item-unset']">
                      <i class="ri-record-circle-fill"></i>{{item.is_online===1?'在线':'离线'}}
                    </div>
                    <div class="expert-item-expert" title="认证专家">认证专家</div>
                    <div class="p-b-8">
                      <nuxt-link :to="{name:'question-publish',query:{user_id:item.id}}" class="phcent-ask-btn ask-btn-primary">向TA提问</nuxt-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <ul class="answer-list">
                <li v-for="(item,index) in dataList" :key="index"  class="answer-list-item">
                  <nuxt-link to="/question/1" class="question-title">
                    <span class="question-label">问</span>
                    <span class="question-title-content">{{ item.title }}</span>
                  </nuxt-link>
                  <el-button type="primary" size="small" class="answer-list-item-btn" @click="followItem('question',item)">
                    <i class="ri-add-fill"></i>关注
                  </el-button>
                </li>
              </ul>
            </div>
            <el-empty v-if="total===0"></el-empty>
            <div class="flex flex-col-center m-t-50 m-b-15">
              <el-pagination background v-if="total>0"
                             @current-change="handleCurrentChange"
                             :current-page = "query.page"
                             :page-size.sync = "query.limit"
                             layout="prev, pager, next" :total="total">
              </el-pagination>
            </div>
          </div>
        </div>
        <div class="phcent-ask-row-rt">
          <expert-home-nav :user-info="userInfo"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {urlUserAskFollow} from '~/api/ask'
import ExpertHomeTop from '~/components/ask/ExpertHomeTop'
import UserThumbnail from '~/components/ask/UserThumbnail'
import ExpertHomeNav from '~/components/ask/ExpertHomeNav'
import AuthorCard from '~/components/ask/AuthorCard'

export default {
  name: "follow",
  components: { AuthorCard, ExpertHomeNav, UserThumbnail, ExpertHomeTop },
  layout: "ask",
  head: {
    titleTemplate: '我的关注 - 个人主页 - %s',
  },
  async asyncData(ctx) {
    let isOwn = false
    if(ctx.$auth.user){
      if(ctx.params.id == ctx.$auth.user.id){
        isOwn = true
      }
    }
    let query = ctx.query
    query.page=query.page||1
    query.limit=query.limit||10
    query.type = query.type||'user'
    let res = await ctx.$axios.get(urlUserAskFollow + '/'+ctx.params.id,{params:query})
    return{
      userInfo:res.data.userInfo,
      dataList:res.data.list.map(item=>{
        item.is_follow=0
        return item
      }),
      total:res.total,
      query:{
        page:Number(query.page)||1,
        type: query.type||'user',
        limit: query.limit||20
      }
    }
  },
  data(){
    return{
      userInfo:{},
      total:0,
      dataList:[],
      query:{
        page:1,
        limit:20,
        type:'user'
      },
      tabsList:[
        {
          key:'user',
          name:'关注的会员'
        },
        {
          key:'question',
          name:'关注的问题'
        },
      ]
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
  watchQuery:['type'],
  mounted() {
  },
  methods:{
    handleCurrentChange(val){
      this.$router.push({ query: { page:val } });
    },
    /* 关注问题*/
    followItem(type,item){
      let data={
        type:type,
        theme_id:item.question_id
      }
      if(item.is_follow===1){
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

<style scoped>

</style>
