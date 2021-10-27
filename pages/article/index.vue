<template>
  <div class="phcent-ask-box">
    <div class="wrapper p-t-20">
      <div class="phcent-ask-row">
        <div class="phcent-ask-row-lt">
          <div class="phcent-ask-cate p-t-20 m-b-10">
            <nuxt-link :to="{query:getRouter('category',null)}" class="phcent-ask-cate--item"
                       :class="{'phcent-ask-cate--active':!query.category}">
              <i class="ri-search-2-line"></i>全部</nuxt-link>
            <nuxt-link v-for="(category,index) in categoryList" :to="{query:getRouter('category',category.id)}" append
                       class="phcent-ask-cate--item" :class="{'phcent-ask-cate--active':query.category===category.id}">
              <i :class="'ri-'+category.icon"></i>{{category.name}}
            </nuxt-link>
          </div>
          <ul class="phcent-ask-nav">
            <li  v-for="tab in tabsList" :class="{'active':tab.key===query.type}">
              <nuxt-link :to="{query:getRouter('type',tab.key)}">{{tab.name}}</nuxt-link>
            </li>
            <nuxt-link :to="{name:'article-publish'}" class="phcent-ask-btn ask-btn-light"><i class="ri-pencil-fill"></i>发布文章</nuxt-link>
          </ul>
          <div class="phcent-ask-whiteBox">
            <div class="phcent-ask-question">

              <div v-for="(item,index) in dataList"  :key="index" class="phcent-ask-question-item">
                <div class="qs-rank">
                  <div class="qs-rank-item">{{ item.digg_num }}<span>点赞</span></div>
                </div>
                <div class="qs-info">
                  <div class="qs-info-bd">
                    <el-tooltip v-if="item.reward_balance>0||item.reward_points>0" class="qs-icon" :class="{'money':item.reward_balance>0}" effect="dark"
                                :content="'如果回答被采纳，回答者将获得'+(item.reward_balance>0?('￥'+item.reward_balance):(item.reward_points+'积分'))" placement="top">
                      <span v-if="item.reward_balance>0"><i class="ri-money-cny-circle-fill m-r-3"></i>{{item.reward_balance}}</span>
                      <span v-else> <i class="ri-coin-fill m-r-3"></i>{{item.reward_points}}</span>
                    </el-tooltip>
                    <span :style="titleStyle(item)">
                    <nuxt-link :to="{query:getRouter('category',item.cate_id)}">
                      <span>[{{ getCateName(item.cate_id) }}]</span>
                    </nuxt-link>
                    <nuxt-link :to="{name:'article-id',params:{ id:item.id }}">
                      <span>{{item.title}}</span>
                    </nuxt-link>
                    </span>
                    <div v-if="item.tags" class="qs-tags">
                      <nuxt-link v-for="(tag,index) in item.tags" :to="{name:'tags-id',params:{ id:tag.id }}" class="qs-tags-item">
                        {{ tag.name }}</nuxt-link>
                    </div>
                  </div>
                  <div class="qs-info-hd">
                    <author-card :user-id="item.user_id">
                      <nuxt-link :to="{name:'u-id',params:{id:item.user_id}}">{{ item.user_name }}</nuxt-link>
                    </author-card>
                    <span class="split"></span>
                    <span>{{ item.created_at }}</span>
                  </div>
                  <div class="qs-info-text">
                    {{item.description}}
                  </div>
                </div>
              </div>
              <el-empty v-if="total===0" description="暂无文章" />
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
                  <li v-for="(item,index) in hotQuestion" :key="index">
                    <nuxt-link to="">{{ item.title }}</nuxt-link>
                  </li>
                </ul>
              </div>
            </div>
            <!--  最新问题-->
            <div class="phcent-ask-sidebar-pancel">
              <div class="phcent-ask-sidebar-pancel-hd">
                <h3 class="phcent-ask-sidebar-pancel-title">等待解答</h3>
              </div>
              <div class="phcent-ask-sidebar-pancel-body">
                <ul class="phcent-ask-sidebar-pancel-body-list">
                  <li v-for="(item,index) in newQuestion" :key="index">
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
</template>

<script>
import {urlWebAskArticle} from '~/api/ask'
import AuthorCard from '~/components/ask/AuthorCard'

export default {
  name: "index",
  components: { AuthorCard },
  layout: "ask",
  head: {
    titleTemplate: '文章中心  - %s',
  },
  async asyncData(ctx) {
    let query = ctx.query
    query.page = query.page||1
    query.limit = query.limit||15
    let res = await ctx.$axios.get(urlWebAskArticle+'/index',{params:query})
    return {
      hotArticle:res.data.hotArticle,
      hotExpert:res.data.hotExpert,
      hotQuestion:res.data.hotQuestion,
      hotTags:res.data.hotTags,
      categoryList:res.data.categoryList,
      newQuestion:res.data.newQuestion,
      dataList:res.data.list,
      total:res.total,
      query:{
        page:Number(query.page)||1,
        type: query.type||'new',
        limit: query.limit||15
      }
    }
  },
  data(){
    return{
      tabsList:[
        {
          key:'new',
          name:'最新文章'
        },
        {
          key:'hot',
          name:'热门文章'
        },
        {
          key:'price',
          name:'收费文章'
        }
      ],
      query:{
        page:1,
        limit:20,
        type:'new'
      },
      dataList:[],
      total:0,
      hotArticle:[],//热门文章
      hotExpert:[],//热门专家
      hotQuestion:[],//热门问题
      hotTags:[],//热门标签
      newQuestion:[],//最新问题
      categoryList:[],//热门分类
    }
  },
  watchQuery:['page','type'],
  methods:{
    /**/

    getRouter(name,val,page = true){
      let query = JSON.parse(JSON.stringify(this.$route.query))
      query[name]= val;
      if(page && query.page > 1){
        query['page']= 1;
      }
      return query;
    },
    handleCurrentChange(val){
      this.$router.push({ query: { page:val } });
    },
    getCateName(id){
      let name=''
      this.categoryList.forEach(item =>{
        if(item.id===id){
          name=item.name
        }
      })
      return name
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
