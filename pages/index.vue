<template>
<div>
  <div class="phcent-ask-box">
    <div class="wrapper p-t-20">
      <div class="phcent-ask-row">
        <div class="phcent-ask-row-lt">
          <div class="phcent-ask-cate p-t-20 m-b-10">
            <nuxt-link to="" class="phcent-ask-cate--item phcent-ask-cate--active">全部</nuxt-link>
            <nuxt-link v-for="(category,index) in categoryList" to="" class="phcent-ask-cate--item">
              <i :class="'ri-'+category.icon"></i>{{category.name}}
            </nuxt-link>
          </div>
          <ul class="phcent-ask-nav">
            <li  v-for="tab in tabsList" :class="{'active':tab.key==='new'}">
              <nuxt-link :to="{path:'/question',query:{type:tab.key},}">{{tab.name}}</nuxt-link>
            </li>
            <nuxt-link to="/question/publish" class="phcent-ask-btn ask-btn-light"><i class="ri-pencil-fill"></i>发布问题</nuxt-link>
          </ul>
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
              <el-empty v-if="total===0" description="暂无数据" />
              <div class="flex flex-col-center m-t-50 m-b-15">
                <el-pagination background v-if="total>query.limit"
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
          <div class="phcent-ask-sidebar m-t-36">
            <!--签到-->
            <signin-box></signin-box>
            <!--积分奖励-->
            <div class="phcent-ask-sidebar-pancel">
              <div class="phcent-ask-sidebar-pancel-hd">
                <h3 class="phcent-ask-sidebar-pancel-title">积分奖励</h3>
              </div>
              <div class="phcent-ask-sidebar-pancel-body">
                <ul class="phcent-ask-sidebar-pancel-body-list color-info">
                  <li>社区积分每满100，可兑换50元UCloud账号赠金，用于购买任意云产品，查看 我的积分</li>
                  <li>问答：发布问题奖励3积分，回答问题奖励1积分，答案被采纳奖励（5+悬赏）积分，恶意灌水积分清零</li>
                  <li>文章：发布文章奖励（5+付费）积分，发表评论奖励1积分，恶意灌水积分清零</li>
                  <li>注册：注册社区账号奖励5积分，邀请好友注册成功，奖励2积分，同IP无效，日上限邀请5名会员注册</li>
                  <li>签到：每天签到奖励1积分，连续签到30天后，每天签到奖励2积分</li>
                  <li>社区积分兑换，请前往积分商城，对积分规则有疑问，欢迎私信云小U</li>
                  <li>本积分激励规则自2020年11月12日生效，解释权归本平台所有</li>
                </ul>
              </div>
            </div>
            <!--  内容列表-->
            <div class="phcent-ask-sidebar-pancel">
              <div class="phcent-ask-sidebar-pancel-hd">
                <h3 class="phcent-ask-sidebar-pancel-title">热门文章</h3>
              </div>
              <div class="phcent-ask-sidebar-pancel-body">
                <ul class="phcent-ask-sidebar-pancel-body-list">
                  <li v-for="(item,index) in hotArticle" :key="index">
                    <nuxt-link to="">{{ item.title }}</nuxt-link>
                  </li>
                </ul>
              </div>
            </div>
            <!--  热门问题-->
            <div class="phcent-ask-sidebar-pancel">
              <div class="phcent-ask-sidebar-pancel-hd">
                <h3 class="phcent-ask-sidebar-pancel-title">热门问题</h3>
              </div>
              <div class="phcent-ask-sidebar-pancel-body">
                <ul class="phcent-ask-sidebar-pancel-body-list">
                  <li v-for="(item,index) in newQuestion" :key="index">
                    <nuxt-link to="">{{ item.title }}</nuxt-link>
                  </li>
                </ul>
              </div>
            </div>
            <!--  最新问题-->
            <div class="phcent-ask-sidebar-pancel">
              <div class="phcent-ask-sidebar-pancel-hd">
                <h3 class="phcent-ask-sidebar-pancel-title">最新问题</h3>
              </div>
              <div class="phcent-ask-sidebar-pancel-body">
                <ul class="phcent-ask-sidebar-pancel-body-list">
                  <li v-for="(item,index) in hotQuestion" :key="index">
                    <nuxt-link to="">{{ item.title }}</nuxt-link>
                  </li>
                </ul>
              </div>
            </div>
            <!--  广告卡槽-->
            <div class="phcent-ask-sidebar-pancel">
              <nuxt-link to="">
                <el-image src="https://www.phcent.com/_nuxt/img/index-module-2-2.3169100.png" fit="contain"></el-image>
              </nuxt-link>
            </div>
            <!--  专家列表-->
            <div class="phcent-ask-sidebar-pancel">
              <div class="phcent-ask-sidebar-pancel-hd">
                <h3 class="phcent-ask-sidebar-pancel-title">推荐专家</h3>
              </div>
              <div class="phcent-ask-sidebar-pancel-body">
                <div v-for="item in hotExpert" class="phcent-ask-media">
                  <div class="phcent-ask-media-img">
                    <author-card :user-id="item.user_id">
                      <nuxt-link :to="{name:'u-id',params:{id:item.user_id}}">
                        <el-avatar size="2rem" src="https://empty" class="phcent-ask-media-img-box">
                          <img :src="item.avatar_url" alt=""/>
                        </el-avatar>
                      </nuxt-link>
                    </author-card>
                  </div>
                  <div class="phcent-ask-media-info">
                    <div class="hd">
                      <nuxt-link :to="{name:'u-id',params:{id:item.user_id}}">{{ item.user_name }}</nuxt-link>
                    </div>
                    <div class="bd">
                      {{item.answer_num}}个答案 {{item.answer_best_num}}次被采纳
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</div>
</template>

<script>
import {urlWebAskIndex} from '~/api/ask'
import SigninBox from '~/components/ask/SigninBox'
import AuthorCard from '~/components/ask/AuthorCard'
export default {
  name: "index",
  components: { AuthorCard, SigninBox },
  layout:'ask',
  async asyncData(ctx) {
    let query = ctx.query
    query.page = query.page||1
    query.limit = query.limit||15
    let res = await ctx.$axios.get(urlWebAskIndex+'/index',{params:query})
    return {
      categoryList:res.data.categoryList,
      hotArticle:res.data.hotArticle,
      hotExpert:res.data.hotExpert,
      hotQuestion:res.data.hotQuestion,
      hotTags:res.data.hotTags,
      newQuestion:res.data.newQuestion,
      dataList:res.data.list,
      total:res.total,
      query:{
        page:Number(query.page)||1,
        type: query.type||'new',
        limit: query.limit||20
      }
    }
  },
  data(){
    return{
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
      dataList:[
        {
          id:1
        },
        {
          id:2
        },
        {
          id:3
        }
      ],
      total:0,
      expertOptions:{
        slidesPerView : 'auto',
        spaceBetween : 20,
        pagination: {
          el: '.swiper-pagination',
          clickable :true,
        },
        navigation: {
          nextEl: '.expert-button.swiper-button-next',
          prevEl: '.expert-button.swiper-button-prev',
        },
        autoplay: true,
        // loop: true,
      },
      hotArticle:[],//热门文章
      hotExpert:[],//热门专家
      hotQuestion:[],//热门问题
      hotTags:[],//热门标签
      newQuestion:[],//最新问题
      categoryList:[],//分类
    }
  },
  watchQuery:['page'],
  computed:{
    loggedIn(){
      return this.$auth.loggedIn
    }
  },
  methods:{
    /**/
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
