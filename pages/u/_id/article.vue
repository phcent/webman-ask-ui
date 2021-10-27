<template>
  <div class="homepage phcent-ask-box">
    <div class="wrapper">
      <expert-home-top :user-info="userInfo"/>
      <div class="phcent-ask-row">
        <div class="phcent-ask-row-lt">
          <!--列表状态-->
          <div class="blog-page-left-tabs">
            <div class="blog-page-left-tabs-item tabs-on">
              <nuxt-link to="" class="item-a">
                {{isOwn?'我':'TA'}}的文章
              </nuxt-link>
            </div>
          </div>
          <div class="phcent-ask-whiteBox">
            <div>
              <ul class="article-list">
                <li v-for="item in dataList" :key="item.id" class="article-list-item">
                  <nuxt-link :to="{name:'article-id',params:{id:item.id}}" class="question-title">
                    <span class="question-title-content">{{ item.title }}</span>
                  </nuxt-link>
                  <div v-if="item.tags" class="tags">
                    <nuxt-link v-for="tag in item.tags" :key="tag.id" :to="{name:'tags-id',params:{id:tag.id}}" class="tags-item">{{ tag.name }}</nuxt-link>
                  </div>
                  <div class="article-data ask-info-tools">
                    <span class="tool-item">
                      <i class="ri-chat-3-line"></i>{{item.reply_num}}条评论
                    </span>
                    <span class="tool-item" @click="collectionArticles(item)">
                      <i class="ri-bookmark-line"></i>收藏
                    </span>
                    <span class="tool-item" @click="$refs.thankModal.open()">
                      <i class="ri-heart-fill"></i>感谢
                    </span>
                    <el-tooltip
                      content="编辑更新文章"
                      placement="top"
                    >
                      <span class="tool-item" @click="$router.push({name:'article-update-id',params:{id:item.id}})">
                        <i class="ri-pencil-fill"></i>编辑
                      </span>
                    </el-tooltip>
                    <el-tooltip
                      content="删除该文章"
                      placement="top"
                    >
                      <span class="tool-item" @click="delItem('article')">
                        <i class="ri-close-fill"></i>删除
                      </span>
                    </el-tooltip>
                    <!--
                    -->
                  </div>
                </li>
              </ul>
            </div>
            <div class="flex flex-col-center m-t-50 m-b-15">
              <el-pagination background
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
    <thank-modal ref="thankModal"/>
  </div>
</template>

<script>
import {urlUserAskArticle} from '~/api/ask'
import ExpertHomeTop from '@/components/ask/ExpertHomeTop'
import ExpertHomeNav from '@/components/ask/ExpertHomeNav'
import ThankModal from '@/components/ask/ThankModal'
import { urlWebAskArticle, urlWebAskCollection } from '@/api/ask'

export default {
  name: "article",
  components: { ThankModal, ExpertHomeNav, ExpertHomeTop },
  layout: "ask",
  head: {
    titleTemplate: '我的文章 - 个人主页 - %s',
  },
  async asyncData(ctx) {
    let query = ctx.query
    query.page=query.page||1
    query.limit=query.limit||1
    let res = await ctx.$axios.get(urlUserAskArticle + '/'+ctx.params.id,{params:query})
    return{
      userInfo:res.data.userInfo,
      dataList:res.data.list,
      tabsType:query.type||'new',
      query:{
        page:Number(query.page)||1,
        type: query.type||'new',
        limit: query.limit||20
      }
    }
  },
  data(){
    return{
      userInfo:{},
      dataList:[],
      total:0,
      query:{
        page:1,
        limit:20,
      },
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
  methods:{
    /* 删除 问题question 回答answer 回复replay 文章article */
    delItem(type){
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        this.$axios.delete(urlWebAskArticle+'/destroy/'+this.$route.params.id).then(res=>{
          this.$message.success('已删除')
        })
      })
    },
    collectionArticles(item) {
      if(item.is_collection===1){
        this.$axios.delete(urlWebAskCollection, { params:{
            type:2,
            theme_id: item.id
          } }).then(res=>{
          item.is_collection = 0
          this.$message.success('取消收藏成功')
        })
      }else{
        this.$axios.post(urlWebAskCollection,{
          type:2,
          theme_id: item.id
        }).then(res=>{
          item.is_collection = 1
          this.$message.success('收藏成功')
        })
      }
    },
    handleCurrentChange(val){
      this.$router.push({ query: { page:val } });
    },
  }
}
</script>

<style scoped lang="scss">
.article-list{
  &-item{
    border-bottom: 1px dashed #e0e0e0;
    padding: 10px 0;
    .tags{
      margin-top: 7px;
      display: inline-block;
      &-item{
        display: inline-block;
        height: 26px;
        line-height: 26px;
        padding: 0 10px;
        border-radius: 3px;
        color: $--color-info;
        background-color: rgba($--color-info,0.1);
      }
      .tags-item + .tags-item{
        margin-left: 5px;
      }
    }
  }
  .question-title{
    color: #333;
    &-content{
      font-size: 0.4rem;
    }
    &:hover{
      color: $--color-primary;
    }
  }
  .question-label{
    background-color: rgba($--color-info,0.1);
    color: $--color-info;
    padding: 5px 15px;
    border-radius: 4px;
    margin-right: 5px;
  }
  .article-data{
    margin-left: 0;
    margin-top: 20px;
  }
}
</style>
