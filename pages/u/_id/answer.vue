<template>
  <div class="homepage phcent-ask-box">
    <div class="wrapper">
      <expert-home-top :user-info="userInfo"/>
      <div class="phcent-ask-row">
        <div class="phcent-ask-row-lt">
          <div class="blog-page-left-tabs">
            <div class="blog-page-left-tabs-item tabs-on">
              <nuxt-link to="" class="item-a">
                {{ isOwn?'我':'TA' }}的回答
              </nuxt-link>
            </div>
          </div>
          <div class="phcent-ask-whiteBox">
            <div>
              <ul class="answer-list">
                <li v-for="item in dataList" class="answer-list-item">
                  <nuxt-link :to="{name:'question-id',params:{id:item.question_id}}" class="question-title">
                    <span class="question-label">问</span>
                    <span class="question-title-content">如何在的就之乎者也</span>
                  </nuxt-link>
                  <div class="answer-content" v-html="item.content"></div>
                  <div class="answer-data ask-info-tools">
                    <span class="tool-item">
                      <i class="ri-chat-3-line"></i>{{item.reply_num}}条评论
                    </span>
                    <span class="tool-item">
                      <i class="ri-bookmark-line"></i>收藏
                    </span>
                    <span class="tool-item" @click="$refs.thankModal.open()">
                      <i class="ri-heart-fill"></i>感谢
                    </span>
                    <el-tooltip
                      content="补充完善回答"
                      placement="top"
                    >
                      <span class="tool-item" @click="$refs.supplementAnswerModal.open()">
                        <i class="ri-pencil-fill"></i>补充回答
                      </span>
                    </el-tooltip>
                    <el-tooltip
                      content="删除回答"
                      placement="top"
                    >
                      <span class="tool-item" @click="delItem('answer')">
                        <i class="ri-close-fill"></i>删除
                      </span>
                    </el-tooltip>
                    <!--
                    -->
                  </div>
                </li>
              </ul>
            </div>
            <el-empty v-if="total===0"></el-empty>
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
    <supplement-answer-modal ref="supplementAnswerModal"/>
  </div>
</template>

<script>
import {urlUserAskAnswer} from '~/api/ask'
import ExpertHomeTop from '@/components/ask/ExpertHomeTop'
import ExpertHomeNav from '@/components/ask/ExpertHomeNav'
import ThankModal from '@/components/ask/ThankModal'
import SupplementAnswerModal from '@/components/ask/SupplementAnswerModal'

export default {
  name: "answer",
  components: { SupplementAnswerModal, ThankModal, ExpertHomeNav, ExpertHomeTop },
  layout: "ask",
  head: {
    titleTemplate: '我的回答 - 个人主页 - %s',
  },
  async asyncData(ctx) {
    let query = ctx.query
    query.page=query.page||1
    query.limit=query.limit||1
    let res = await ctx.$axios.get(urlUserAskAnswer + '/'+ctx.params.id)
    return{
      userInfo:res.data.userInfo,
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
    /* 删除 问题question 回答answer 回复replay */
    delItem(type){
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {

      })
    },

    handleCurrentChange(val){
      this.$router.push({ query: { page:val } });
    },
  }
}
</script>

<style scoped lang="scss">
.answer-list{
  &-item{
    border-bottom: 1px dashed #e0e0e0;
    padding: 10px 0;
    &:nth-child(n+2){
      padding: 20px 0 10px 0;
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
  .answer-content{
    margin-top: 10px;
    padding: 10px 0;
    margin-left: 55px;
    color: rgba($--color-primary2,0.8);
  }
  .answer-data{
    margin-left: 55px;
    font-size: 0.35rem;
  }
}
</style>
