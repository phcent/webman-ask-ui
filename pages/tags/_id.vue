<template>
  <div class="phcent-ask-box">
    <div class="wrapper">
      <div class="p-t-20">
        <div class="phcent-ask-row" v-loading="loading">
          <div class="phcent-ask-row-lt">
            <div class="tags-info">
              <div class="tags-info-img">
                <el-image class="img-circle img-full" :src="tagInfo.image" fit="contain">
                  <div slot="error" class="image-slot">
                    <img style="width: 100%; height: 100%" src="@/static/ask/tag_default.png">
                  </div>
                </el-image>
              </div>
              <div class="tags-info-rt">
                <div class="fz-30">
                  {{ tagInfo.name }}
                </div>
                <div class="m-t-5 color-info">
                  {{tagInfo.summary}}
                </div>
                <div class="blog-tools m-t-15">
                  <div class="phcent-ask-btn ask-btn-primary" @click="followTag"><i class="ri-add-line"></i> {{!isFollower? '关注话题':'取消关注' }}</div>
                  <div class="phcent-ask-btn ask-btn-light">
                    <nuxt-link :to="{name:'question-publish',query:{tag_id:tagInfo.id}}" class=""><i class="ri-question-line"></i>创建问题</nuxt-link>
                    <el-dropdown>
                      <i class="ri-arrow-down-s-line"></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><nuxt-link :to="{name:'article-publish',query:{tag_id:tagInfo.id}}"><i class="ri-pencil-fill"></i>发布文章</nuxt-link></el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>

                  <span class="tool-item" @click="$refs.reportModal.open()"><i class="ri-alert-fill"></i>举报</span>
                  <el-tooltip
                    content="编辑更新话题"
                    placement="top" v-if="showEdit"
                  >
                    <span class="tool-item" @click="$refs.TagsModal.open(tagInfo)"><i class="ri-pencil-fill"></i>编辑</span>
                  </el-tooltip>
                  <el-tooltip
                    content="删除话题"
                    placement="top"  v-if="showDelete"
                  >
              <span class="tool-item" @click="delItem">
                <i class="ri-close-fill"></i>删除
              </span>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <ul class="phcent-ask-nav">
              <li  v-for="tab in tabsList" :class="{'active':tab.key===query.type}">
                <nuxt-link :to="{query:getRouter('type',tab.key)}">{{tab.name}}</nuxt-link>
              </li>
            </ul>
            <div class="phcent-ask-whiteBox">
              <div class="phcent-ask-question" v-if="query.type === 'question'">
                <div v-for="(question,key) in dataList" :key="key" class="phcent-ask-question-item">
                  <div class="qs-rank">
                    <div class="qs-rank-item answers"
                         :class="{'answered':question.question.answer_num>0,'solved':question.question.best_answer>0}">{{ question.question.answer_num }}<span>回答</span></div>
                    <div class="qs-rank-item m-l-5">{{ question.question.view_num }}<span>浏览</span></div>
                  </div>
                  <div class="qs-info">
                    <div class="qs-info-hd">
                      <author-card :user-id="question.question.user_id">
                        <nuxt-link :to="{name:'u-id',params:{id:question.question.user_id}}">{{ question.question.user_name }}</nuxt-link>
                      </author-card>
                      <span class="split"></span>
                      <span>{{question.question.created_at}}</span>
                    </div>
                    <div class="qs-info-bd">
                      <nuxt-link :to="{name:'question-id',params:{ id:question.question.id }}">
                        <el-tooltip v-if="question.question.reward_balance>0||question.question.reward_points>0"
                                    :content="'如果回答被采纳，回答者将获得'+(question.question.reward_balance>0?('￥'+question.question.reward_balance):(question.question.reward_points+'积分'))" placement="top">
                          <span v-if="question.question.reward_balance>0"><i class="ri-money-cny-circle-fill m-r-3"></i>{{question.question.reward_balance}}</span>
                          <span v-else> <i class="ri-coin-fill m-r-3"></i>{{question.question.reward_points}}</span>
                        </el-tooltip>
                        <span :style="titleStyle(question)">{{question.question.title}}</span>
                      </nuxt-link>
                      <div v-if="question.question.tags" class="qs-tags">
                        <nuxt-link v-for="(tag,index) in question.question.tags" :to="{name:'tags-id',params:{ id:tag.id }}" class="qs-tags-item">
                          {{ tag.name }}</nuxt-link>
                      </div>
                    </div>
                  </div>
                </div>
                <el-empty v-if="total===0" description="暂无问题" />
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
            <div class="phcent-ask-whiteBox tags-details">
              <div class="tags-details-item">
                <span class="small">问答</span>
                {{ tagInfo.question_num }}
              </div>
              <div class="tags-details-item">
                <span class="small">文章</span>
                {{ tagInfo.article_num }}
              </div>
              <div class="tags-details-item">
                <span class="small">关注</span>
                {{ tagInfo.follow_num }}
              </div>
            </div>
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
              <!--  广告卡槽-->
              <div class="phcent-ask-sidebar-pancel">
                <nuxt-link to="">
                  <el-image src="https://www.phcent.com/_nuxt/img/index-module-2-2.3169100.png" fit="contain"></el-image>
                </nuxt-link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    <tags-modal ref="TagsModal" @change="changeTag"/>
    <report-modal ref="reportModal"/>
  </div>
</template>

<script>
import AuthorCard from '~/components/ask/AuthorCard'
import ReportModal from '~/components/ask/ReportModal'
import { urlUserAskTags, urlWebAskCollection } from '~/api/ask'
import TagsModal from '@/components/ask/TagsModal'
export default {
  name: '_id',
  components: { TagsModal, ReportModal, AuthorCard },
  layout: "ask",
  head: {
    titleTemplate: '话题  - %s',
  },
  async asyncData(ctx) {
    let res = await ctx.$axios.get(urlUserAskTags+'/show/'+ctx.params.id)
    return {
      hotArticle:res.data.hotArticle,
      hotQuestion:res.data.hotQuestion,
      hotTags:res.data.hotTags,
      total:res.total,
      tagInfo:res.data.info,
      showDelete:res.data.show_delete || 0,
      showEdit:res.data.show_edit || 0,
      isFollower:res.data.is_follower || 0,
      loading:false
    }
  },
  watch: {
    '$route.query': '$fetch'
  },
  async fetch(){
    let query = this.$route.query
    this.query.page= Number(query.page)||1
    this.query.limit= Number(query.limt)||20
    this.query.type = query.type||'question'
    let res = await this.$axios.get(urlUserAskTags+'/list/'+this.$route.params.id,{params:this.query});
    this.dataList = res.data.list;
    this.total = res.total;
  },
  data(){
    return{
      loading:true,
      tabsList:[
        {
          key:'question',
          name:'问题'
        },
        {
          key:'article',
          name:'文章'
        },
      ],
      tabsType:'question',
      dataList:[],
      total:0,
      query:{
        page:1,
        limit:20,
        type:'question'
      },
      hotArticle:[],//热门文章
      hotQuestion:[],//热门问题
      hotTags:[],//热门标签
      tagInfo:{},
      showDelete:0,
      showEdit:0,
      isFollower:0
    }
  },
  mounted() {
    // this.getList()
  },
  methods:{
    getList(){
      this.$axios.get(urlUserAskTags+'/list/'+this.$route.params.id,{params:this.query}).then(res=>{

      })
    },
    //
    delItem(){
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        this.$axios.delete(urlUserAskTags+'/destroy/'+this.$route.params.id).then(res=>{
          this.$router.push('/tags')
        })
      })
    },
    //关注话题
    followTag(){
      if(this.isFollower===1){
        this.$axios.delete(urlWebAskCollection, { params:{
            type:2,
            theme_id: this.$route.params.id
          } }).then(res=>{
          this.is_collection = this.is_collection===1?0:1
          this.$message.success('取消关注成功')
        })
      }else{
        this.$axios.post(urlWebAskCollection,{
          type:2,
          theme_id: this.$route.params.id
        }).then(res=>{
          this.is_collection = this.is_collection===1?0:1
          this.$message.success('关注成功')
        })
      }
    },
    //编辑成功回调
    changeTag(){

    },
    handleCurrentChange(val){
      this.$router.push({ query: { page:val } });
    },
    getRouter(name,val,page = true){
      let query = JSON.parse(JSON.stringify(this.$route.query))
      query[name]= val;
      if(page && query.page > 1){
        query['page']= 1;
      }
      return query;
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

<style scoped lang="scss">
.tags-info{
  display: flex;
  &-img{
    width: 4rem;
    height: 4rem;
    margin-right: 0.5rem;
  }
  &-rt{
    flex: 1;
  }
}
.tags-details{
  display: flex;
  flex-wrap: wrap;
  padding: 0.5rem;
  &-item{
    padding: 20px 0;
    flex: 0 33.33%;
    width: 33.33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 0.4rem;
    font-weight: bolder;
    .small{
      font-weight: normal;
      font-size: 0.35rem;
    }
  }
}
.reward-tag{
  height: 24px;
  display: inline-flex;
  align-items: center;
  color: $--color-warning;
  padding: 0 7px;
  font-size: 0.3rem;
  border-radius: 5px;
  background-color: rgba($--color-warning,0.1);
}
/** 操作栏 */
.blog-tools {
  font-size: 0.35rem;
  color: $--color-info;

  .tool-item {
    cursor: pointer;
    margin-left: 12px;
    display: inline-block;

    &:hover {
      color: $--color-primary;
    }

    i {
      vertical-align: middle;
      margin-right: 3px;
    }
  }
}
</style>
