<template>
  <div class="phcent-ask-box">
    <div class="wrapper p-t-20">
      <div class="phcent-ask-row">
        <div class="phcent-ask-row-lt">
          <!--文章标签-->
          <div class="phcent-ask-cate">
            <nuxt-link v-for="(item,index) in articleInfo.tags" :key="index" :to="'/tags/'+item.id" append
                       class="phcent-ask-cate--item" >
              <i :class="'ri-'+item.icon"></i>{{item.name}}
            </nuxt-link>
          </div>
          <!--问题名称-->
          <div class="qs-info">
            <h1 class="qs-info-bd fz-24">
              <el-tooltip v-if="articleInfo.reward_balance>0||articleInfo.reward_points>0" class="qs-icon" :class="{'money':articleInfo.reward_balance>0}" effect="dark"
                          :content="'此文章需要'+(articleInfo.reward_balance>0?('￥'+articleInfo.reward_balance):(articleInfo.reward_points+'积分'))+'才能查看'" placement="top">
                <span v-if="articleInfo.reward_balance>0"><i class="ri-money-cny-circle-fill m-r-3"></i>{{articleInfo.reward_balance}}</span>
                <span v-else> <i class="ri-coin-fill m-r-3"></i>{{articleInfo.reward_points}}</span>
              </el-tooltip>
              <span class="question" :style="titleStyle">{{articleInfo.title}}</span>
              <span class="fz-16">悬赏已过期</span>
            </h1>
            <p class="color-7-primary2 fz-13">发布于 {{articleInfo.created_at}}</p>
          </div>
          <!--问题详情-->
          <div class="m-t-30">
            <div v-html="articleInfo.content"></div>
          </div>
          <!--操作栏-->
          <div class="ask-info-tools m-t-20">
            <span class="phcent-ask-btn" :class="[is_digg!==1?'ask-btn-light':'ask-btn-primary']" @click="diggItem">
          {{articleInfo.digg_num}}人点赞
        </span>
            <span class="phcent-ask-btn ask-btn-light" @click="$refs.inviteModal.open()">
          发布评论
        </span>
            <span class="tool-item" @click="$refs.shareModal.open()">
        <i class="ri-share-fill"></i>分享
      </span>
            <span class="tool-item" @click="collectionArticles">
        <template v-if="is_collection===1">
          <i class="ri-bookmark-fill"></i>已收藏
        </template>
        <template v-else>
          <i class="ri-bookmark-line"></i>收藏
        </template>
      </span>
            <span class="tool-item" @click="$refs.thankModal.open()">
        <i class="ri-heart-fill"></i>感谢
      </span>
            <span class="tool-item" @click="$refs.reportModal.open(2,$route.params.id)">
        <i class="ri-alert-fill"></i>举报
      </span>
            <el-tooltip
              content="编辑更新文章"
              placement="top"
            >
        <nuxt-link :to="{name:'article-update-id',params:{id:$route.params.id}}" class="tool-item">
          <i class="ri-pencil-fill"></i>编辑
        </nuxt-link>
            </el-tooltip>
            <el-tooltip
              content="删除文章"
              placement="top"
            >
        <span class="tool-item" @click="delItem('articles')">
          <i class="ri-close-fill"></i>删除
        </span>
            </el-tooltip>
            <el-tooltip
              content="更多设置"
              placement="top"
            >
        <span class="tool-item" @click="$refs.settingModal.open(2,articleInfo)">
          <i class="ri-settings-5-fill"></i>更多
        </span>
            </el-tooltip>
          </div>
          <!---->
          <div class="phcent-ask-whiteBox">
            <div class="flex flex-col-between flex-row-center">
              <h3 class="phcent-ask-sidebar-pancel-title">{{total}}个评论</h3>
              <div>
                <el-select v-model="order"  class="sort-type" @change="orderChange">
                  <el-option
                    label="默认排序"
                    value="default"
                  >
                  </el-option>
                  <el-option
                    label="按发布时间排序"
                    value="date"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div v-for="reply in replyList" class="answer">
              <div>
                <author-card :user-id="reply.user_id">
                  <nuxt-link :to="'/u/'+reply.user_id">
                    <el-image class="author-img img-circle" :src="reply.avatar_url" fit="contain"></el-image>
                  </nuxt-link>
                </author-card>
              </div>
              <div class="answer-info">
                <div class="answer-info-top">
                  <div class="answer-info-top-user">
                    <author-card :user-id="reply.user_id">
                      <nuxt-link :to="'/u/'+reply.user_id" class="answer-info-top-user-name">{{reply.user_name}}</nuxt-link>
                    </author-card>
                    <span class="color-7-primary2 fz-12">{{reply.created_at}}</span>
                  </div>
                  <div class="color-7-primary2 fz-12">{{reply.user_description||'这家伙很懒，什么也没写！'}}</div>
                </div>
                <div class="answer-info-content">
                  <div v-html="reply.content"></div>
                </div>
                <div class="ask-info-tools">
                    <span class="tool-item">
                      <i class="ri-thumb-up-line"></i>0
                    </span>
                  <span class="tool-item" @click="replyAnswer(reply)">
                      <i class="ri-reply-fill"></i>回复
                    </span>
                  <span class="tool-item" @click="$refs.reportModal.open(4,reply.id)">
                      <i class="ri-alert-fill"></i>举报
                    </span>
                  <el-tooltip
                    content="编辑评论"
                    placement="top"
                  >
                      <span class="tool-item" @click="$refs.supplementAnswerModal.open()">
                        <i class="ri-pencil-fill"></i>编辑
                      </span>
                  </el-tooltip>
                  <el-tooltip
                    content="删除回复"
                    placement="top"
                  >
            <span class="tool-item" @click="delItem('reply')">
              <i class="ri-close-fill"></i>删除
            </span>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <div v-if="replyList.length===0">暂无评论，快来发表评论吧</div>
            <reply-editor :type="1" :theme-id="articleInfo.id" :reply-user-id="reply_user_id" @change="getList"></reply-editor>
          </div>
        </div>
        <div class="phcent-ask-row-rt">
          <!--关于作者-->
          <div class="phcent-ask-user">
            <div class="author-info">
              <author-card :user-id="userCard.user_id">
                <nuxt-link :to="'/u/'+userCard.user_id">
                  <el-image class="author-img img-circle" :src="userCard.avatar_url" fit="contain"></el-image>
                </nuxt-link>
              </author-card>
              <div class="flex-1 m-l-10">
                <div class="author-name  text-color-primary2-8">
                  <nuxt-link  :to="'/u/'+userCard.user_id" class="text-color-primary2">{{ userCard.user_name }}</nuxt-link>
                  <span  v-if="userCard.is_expert===1" class="phcent-ask-btn ask-btn-light ask-btn-small">认证专家</span>
                </div>
                <div class="author-exp  text-color-primary2-4">{{userCard.description||'这家伙很懒，什么也没写！'}}</div>
              </div>
            </div>
            <div class="author-details">
              <div class="author-details-item text-color-primary2-8">
                <span class="small text-color-primary2-5">文章</span>
                <nuxt-link class="text-color-primary2-8" :to="{name:'u-id-article',params:{id:userCard.user_id}}">{{userCard.article_num}}</nuxt-link>
              </div>
              <div class="author-details-item text-color-primary2-8">
                <span class="small text-color-primary2-5">提问</span>
                <nuxt-link class="text-color-primary2-8" :to="{name:'u-id-question',params:{id:userCard.user_id}}">{{userCard.question_num}}</nuxt-link>
              </div>
              <div class="author-details-item text-color-primary2-8">
                <span class="small text-color-primary2-5">回答被采纳</span>
                {{userCard.answer_best_num}}
              </div>
            </div>
            <div class="flex flex-col-center p-t-20 m-b-20">
              <span  class="phcent-ask-btn ask-btn-primary m-r-20" style="width: 100%"  @click="followItem('user')">
                <i class="ri-add-fill m-r-3"></i>{{userCard.is_follow===1?'已关注':'关注TA'}}</span>
              <span  class="phcent-ask-btn ask-btn-light" style="width: 100%" @click="$refs.messageCreateModal.open(userCard.user_id)">
                <i class="ri-question-answer-line m-r-3"></i>发私信</span>
            </div>
          </div>
          <!--  热门文章-->
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
                      <el-avatar size="2rem" :src="item.avatar_url" class="phcent-ask-media-img-box">
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
    <!--弹框-->
    <!--分享-->
    <share-modal ref="shareModal" />
    <!--感谢-->
    <thank-modal ref="thankModal" />
    <!--举报-->
    <report-modal ref="reportModal" :reason-list="reasonList"/>
    <!--更多设置-->
    <setting-modal ref="settingModal" />
    <!--补充回答-->
    <supplement-answer-modal ref="supplementAnswerModal" />
    <message-create-modal ref="messageCreateModal"/>
  </div>
</template>

<script>
import {urlWebAskArticle,urlUserAskReply,urlWebAskDigg,urlWebAskCollection} from '~/api/ask'
import AuthorCard from '~/components/ask/AuthorCard'
import ReplyEditor from '~/components/ask/ReplyEditor'
import ShareModal from '~/components/ask/ShareModal'
import ThankModal from '~/components/ask/ThankModal'
import ReportModal from '~/components/ask/ReportModal'
import SettingModal from '~/components/ask/SettingModal'
import SupplementAnswerModal from '~/components/ask/SupplementAnswerModal'
import MessageCreateModal from '~/components/ask/MessageCreateModal'

export default {
  name: '_id',
  components: { MessageCreateModal, SupplementAnswerModal, SettingModal, ReportModal, ThankModal, ShareModal, ReplyEditor, AuthorCard },
  layout: "ask",
  head: {
    titleTemplate: '文章详情  - %s',
  },
  async asyncData(ctx) {
    let res = await ctx.$axios.get(urlWebAskArticle +'/show/'+ ctx.params.id)
    return{
      is_collection:res.data.is_collection,
      is_digg:res.data.is_digg,
      hotArticle:res.data.hotArticle,
      hotExpert:res.data.hotExpert,
      hotQuestion:res.data.hotQuestion,
      hotTags:res.data.hotTags,
      newQuestion:res.data.newQuestion,
      reasonList:res.data.reasonList,
      articleInfo:res.data.info,
      userCard:res.data.userCard,
      order:ctx.query.order||'default'
    }
  },
  data() {
    return {
      is_collection:0,//是否收藏
      is_digg:0,//
      articleInfo:{},
      hotArticle:[],//热门文章
      hotExpert:[],//热门专家
      hotQuestion:[],//热门问题
      hotTags:[],//热门标签
      newQuestion:[],//最新问题
      reasonList:[],//举报原因
      userCard:[],//作者信息
      tabsList: [
        {
          key: 'new',
          name: '最新'
        },
        {
          key: 'hot',
          name: '热门'
        },
        {
          key: 'reward',
          name: '悬赏'
        },
        {
          key: 'unresolved',
          name: '未解决'
        },
        {
          key: 'unanswered',
          name: '未回答'
        },
        {
          key: 'resolved',
          name: '已解决'
        }
      ],
      tabsType: 'new',
      order:'default',
      dataList: [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 3
        }
      ],
      query:{
        page:1,
        limit:20
      },
      total: 0,
      expertOptions: {
        slidesPerView: 'auto',
        spaceBetween: 20,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.expert-button.swiper-button-next',
          prevEl: '.expert-button.swiper-button-prev'
        },
        autoplay: true
        // loop: true,
      },
      replyList: [],
      reply_user_id:0,
    }
  },
  computed:{
    titleStyle(){
      if(!this.articleInfo.style){
        return {}
      }else{
        let styleInfo=JSON.parse(this.articleInfo.style)
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
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList(){
      this.query.order = this.order
      this.$axios.get(urlUserAskReply+'/index/'+this.$route.params.id,{params:this.query}).then(res=>{
        this.replyList=res.data.list
        this.total = res.total
      })
    },
    /* 顶踩  */
    diggItem(){
      let data = {
        theme_id:this.$route.params.id,
        conduct:'up',
        type:2
      }
      if(this.is_digg===0){
        this.$axios.post(urlWebAskDigg,data).then(res=>{
          this.is_digg=1
          this.articleInfo.digg_num+=1
        })
      }else{
        this.$axios.delete(urlWebAskDigg, { params:data }).then(res=>{
          this.is_digg=0
          this.articleInfo.digg_num-=1
        })
      }
    },
    /* 收藏文章 */
    collectionArticles() {
      if(this.is_collection===1){
        this.$axios.delete(urlWebAskCollection, { params:{
            type:2,
            theme_id: this.$route.params.id
          } }).then(res=>{
          this.is_collection = this.is_collection===1?0:1
          this.$message.success('取消收藏成功')
        })
      }else{
        this.$axios.post(urlWebAskCollection,{
          type:2,
          theme_id: this.$route.params.id
        }).then(res=>{
          this.is_collection = this.is_collection===1?0:1
          this.$message.success('收藏成功')
        })
      }
    },
    /* 回答回复 */
    toggleReplay(item) {
      item.replayShow = !item.replayShow
    },
    /* 收藏回答 */
    collectionAnswer() {

    },
    /* 回复回复 */
    replyAnswer(){
      //  添加@到输入框
    },
    /* 采纳回答 */
    adoptAnswer() {
      this.$confirm('确认采纳此答案？采纳成功以后将无法再进行修改！！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {

      })
    },
    /* 删除 问题question 回答answer 回复replay */
    delItem(type){
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        if(type==='articles'){
          this.$axios.delete(urlWebAskArticle+'/destroy/'+this.$route.params.id).then(res=>{
            this.$message.success('已删除')
            this.$router.push('/article')
          })
        }
      })
    },
    /* 排序 */
    orderChange(value){
      this.$router.push({query:{order:value}})
      this.query.page=1
      this.query.order=value
      this.getList()
    }
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
.phcent-ask-user{
  padding: 0.8rem;
  background-color: #FFFFFF;
  //margin-top: 0.5rem;
  border-radius: 0.1rem;
  border: 1px solid rgba($--color-primary2,0.15);
  box-shadow: 0 1px 0.15rem 0.1rem rgba($--color-primary,0.05);
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
}
.sort-type{
  width: 150px;
  ::v-deep .el-input--suffix .el-input__inner{
    border: none;
  }
}
</style>
