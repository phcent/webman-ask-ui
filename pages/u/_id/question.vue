<template>
  <div class="homepage phcent-ask-box">
    <div class="wrapper">
      <expert-home-top :user-info="userInfo"/>
      <div class="phcent-ask-row">
        <div class="phcent-ask-row-lt">
          <div class="blog-page-left-tabs">
            <div v-for="item in tabsList" :key="item.key" class="blog-page-left-tabs-item" :class="{'tabs-on':item.key===tabsType}">
              <nuxt-link :to="{path:$route.path,query:{type:item.key}}" class="item-a">
                {{item.name}}
              </nuxt-link>
            </div>
          </div>
          <div class="phcent-ask-whiteBox">
            <div class="phcent-ask-question">
              <div v-for="(question,key) in dataList" :key="key" class="phcent-ask-question-item">
                <div class="qs-rank">
                  <div class="qs-rank-item answers"
                       :class="{'answered':question.answer_num>0,'solved':question.best_answer>0}">{{ question.answer_num }}<span>回答</span></div>
                  <div class="qs-rank-item m-l-5">{{ question.view_num }}<span>浏览</span></div>
                </div>
                <div class="qs-info">
                  <div class="qs-info-hd">
                    <author-card :user-id="question.user_id">
                      <nuxt-link :to="{name:'u-id',params:{id:question.user_id}}">{{ question.user_name }}</nuxt-link>
                    </author-card>
                    <span class="split"></span>
                    <span>{{question.created_at}}</span>
                  </div>
                  <div class="qs-info-bd">
                    <nuxt-link :to="{name:'question-id',params:{ id:question.id }}">
                      <el-tooltip v-if="question.reward_balance>0||question.reward_points>0"
                                  :content="'如果回答被采纳，回答者将获得'+(question.reward_balance>0?('￥'+question.reward_balance):(question.reward_points+'积分'))" placement="top">
                        <span v-if="question.reward_balance>0"><i class="ri-money-cny-circle-fill m-r-3"></i>{{question.reward_balance}}</span>
                        <span v-else> <i class="ri-coin-fill m-r-3"></i>{{question.reward_points}}</span>
                      </el-tooltip>
                      <span :style="titleStyle(question)">{{question.title}}</span>
                    </nuxt-link>
                    <div v-if="question.tags" class="qs-tags">
                      <nuxt-link v-for="(tag,index) in question.tags" :to="{name:'tags-id',params:{ id:tag.id }}" class="qs-tags-item">
                        {{ tag.name }}</nuxt-link>
                    </div>
                  </div>
                </div>
              </div>
              <el-empty v-if="total===0" description="暂无问题" />
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
        </div>
        <div class="phcent-ask-row-rt">
          <expert-home-nav :user-info="userInfo"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {urlUserAskQuestion} from '~/api/ask'
import ExpertHomeTop from '@/components/ask/ExpertHomeTop'
import ExpertHomeNav from '@/components/ask/ExpertHomeNav'
import AuthorCard from '~/components/ask/AuthorCard'

export default {
  name: "question",
  components: { AuthorCard, ExpertHomeNav, ExpertHomeTop },
  layout: "ask",
  head: {
    titleTemplate: '我的问题 - 个人主页 - %s',
  },
  async asyncData(ctx) {
    let query = ctx.query
    query.page=query.page||1
    query.limit=query.limit||15
    let res = await ctx.$axios.get(urlUserAskQuestion + '/'+ctx.params.id,{params:query})
    return{
      userInfo:res.data.userInfo,
      dataList:res.data.list,
      total:res.total,
      tabsType:query.type||'new',
      query:{
        page:Number(query.page)||1,
        type: query.type||'new',
        limit: query.limit||15
      }
    }
  },
  data(){
    return{
      userInfo:{},
      tabsList:[
        {
          key:'new',
          name:'最新'
        },
        {
          key:'hot',
          name:'热门'
        },
        {
          key:'reward',
          name:'悬赏'
        },
        {
          key:'unresolved',
          name:'未解决'
        },
        {
          key:'unanswered',
          name:'未回答'
        },
        {
          key:'resolved',
          name:'已解决'
        }
      ],
      tabsType:'new',
      dataList:[],
      total:0,
      query:{
        page:1,
        limit:15,
        type:'new'
      },
    }
  },
  watchQuery:['type','page'],
  methods:{
    handleCurrentChange(val){
      this.$router.push({ query: { page:val } });
    },
    // 标题样式
    titleStyle(item){
      if(!item.style){
        return {}
      }else{
        let styleInfo=JSON.parse(item.style)
        let style = {
          fontWeight:styleInfo.bold?'bold':'normal',
          textDecoration:styleInfo.underline?'underline':'none',
        }
        if(!styleInfo.color1||!styleInfo.color2){
          style.color=styleInfo.color1||styleInfo.color2
        }else{
          style.backgroundImage='linear-gradient(90deg,'+styleInfo.color1+' 0%,'+styleInfo.color2+' 100%'
        }
        return style
      }
    }
  }
}
</script>

<style scoped>

</style>
