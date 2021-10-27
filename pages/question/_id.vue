<template>
  <div class="phcent-ask-box">
    <div class="wrapper p-t-20">
      <div class="phcent-ask-row">
        <div class="phcent-ask-row-lt">
          <!--问题标签-->
          <div class="phcent-ask-cate">
            <nuxt-link v-for="(item,index) in questionInfo.tags" :key="index" :to="'/tags/'+item.id" append
                       class="phcent-ask-cate--item" >
              <i :class="'ri-'+item.icon"></i>{{item.name}}
            </nuxt-link>
          </div>

          <!--问题名称-->
          <div class="qs-info">
            <h1 class="qs-info-bd">
              <el-tooltip v-if="questionInfo.reward_balance>0||questionInfo.reward_points>0" class="qs-icon" :class="{'money':questionInfo.reward_balance>0}" effect="dark"
                          :content="'如果回答被采纳，回答者将获得'+(questionInfo.reward_balance>0?('￥'+questionInfo.reward_balance):(questionInfo.reward_points+'积分'))" placement="top">
                <span v-if="questionInfo.reward_balance>0"><i class="ri-money-cny-circle-fill m-r-3"></i>{{questionInfo.reward_balance}}</span>
                <span v-else> <i class="ri-coin-fill m-r-3"></i>{{questionInfo.reward_points}}</span>
              </el-tooltip>
              <span class="question" :style="titleStyle">{{questionInfo.title}}</span>
              <span class="fz-16">悬赏已过期</span>
            </h1>
            <p class="color-7-primary2 fz-13">发布于 {{questionInfo.created_at}}</p>
          </div>
          <!--问题详情-->
          <div class="m-t-30">
            <div v-html="questionInfo.content"></div>
          </div>
        </div>
        <div class="phcent-ask-row-rt">
          <div class="phcent-ask-question-num">
            <div class="num-item follow">
              <span class="small">关注者</span>
              {{ questionInfo.follow_num }}
            </div>
            <div class="num-item views">
              <span class="small">被浏览</span>
              {{ questionInfo.view_num }}
            </div>
            <div class="num-item digg">
              <el-tooltip
                content="顶一下"
                placement="top"
              >
                <div class="digg-up" :class="{'color-primary':is_digg===1}" @click="diggItem(is_digg,$route.params.id,'up',1)">
                  <i class="ri-thumb-up-line"></i>
                  {{ questionInfo.digg_num }}
                </div>
              </el-tooltip>
              <el-tooltip
                content="踩一下"
                placement="bottom"
              >
                <div class="digg-down" :class="{'color-primary':is_step===1}" @click="diggItem(is_step,$route.params.id,'down',1)">
                  <i class="ri-thumb-down-line"></i>
                  {{ questionInfo.step_num }}
                </div>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
      <!--操作栏-->
      <div class="ask-info-tools m-t-20">
        <span class="phcent-ask-btn ask-btn-primary" @click="followItem('question')">
          {{ is_follow===1?'取消关注':'关注问题' }}
        </span>
        <span class="phcent-ask-btn ask-btn-light" @click="$refs.inviteModal.open()">
          邀请回答
        </span>
        <span class="tool-item" @click="$refs.shareModal.open()">
        <i class="ri-share-fill"></i>分享
      </span>
        <span class="tool-item" @click="collectionTheme(1)">
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
        <span class="tool-item" @click="$refs.reportModal.open(1,$route.params.id)">
        <i class="ri-alert-fill"></i>举报
      </span>
        <el-tooltip
          content="追加金额"
          placement="top"
        >
        <span class="tool-item" @click="$refs.rewardModal.open()">
          <i class="ri-copper-coin-line"></i>追加悬赏
        </span>
        </el-tooltip>
        <el-tooltip
          v-if="show_edit===1"
          content="补充完善问题"
          placement="top"
        >
        <span class="tool-item" @click="$router.push('/question/update/'+$route.params.id)">
          <i class="ri-pencil-fill"></i>补充问题
        </span>
        </el-tooltip>
        <el-tooltip
          v-if="show_delete===1"
          content="删除问题"
          placement="top"
        >
        <span class="tool-item" @click="delItem('question')">
          <i class="ri-close-fill"></i>删除
        </span>
        </el-tooltip>
        <el-tooltip
          v-if="show_close===1"
          content="关闭"
          placement="top"
        >
        <span class="tool-item" @click="closeQuestion">
          <i class="ri-forbid-2-line"></i>关闭
        </span>
        </el-tooltip>
        <el-tooltip
          v-if="show_set===1"
          content="更多设置"
          placement="top"
        >
        <span class="tool-item" @click="$refs.settingModal.open(1,questionInfo)">
          <i class="ri-settings-5-fill"></i>更多
        </span>
        </el-tooltip>
      </div>
      <div class="phcent-ask-row">
        <div class="phcent-ask-row-lt">
          <div class="phcent-ask-whiteBox">
            <div class="flex flex-col-between flex-row-center">
              <h3 class="phcent-ask-sidebar-pancel-title">{{questionInfo.answer_num}}个回答</h3>
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
            <answer-item v-if="best_answer" :answer="best_answer"
                         :reason-list="reasonList"
                         :show-best="questionInfo.best_answer===0"
                         @digg="diggItem(best_answer.is_digg,best_answer.id,'up',3)"
                         @step="diggItem(best_answer.is_step,best_answer.id,'down',3)"
                         @collection="collectionTheme(3,best_answer)"
                         @thank="$refs.thankModal.open()"
                         @supplement="$refs.supplementAnswerModal.open()"
                         @adopt="adoptAnswer(best_answer)"
                         @del="delItem('answer')"
            ></answer-item>
            <div v-if="total>0">
              <answer-item v-for="answer in answerList" :answer="answer"
                           :reason-list="reasonList"
                           :show-best="questionInfo.best_answer===0"
                           @digg="diggItem(answer.is_digg,answer.id,'up',3)"
                           @step="diggItem(answer.is_step,answer.id,'down',3)"
                           @collection="collectionTheme(3,answer)"
                           @thank="$refs.thankModal.open()"
                           @supplement="$refs.supplementAnswerModal.open()"
                           @adopt="adoptAnswer(answer)"
                           @del="delItem('answer')"
              ></answer-item>
            </div>
          </div>
          <!--撰写答案-->
          <div class="phcent-ask-whiteBox">
            <h3 class="phcent-ask-sidebar-pancel-title">撰写答案</h3>
            <answer-editor :theme-id="questionInfo.id" @change="subAnswer"></answer-editor>
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
    <!--邀请回答-->
    <invite-modal ref="inviteModal" @select="inviteSelect"/>
    <!--分享-->
    <share-modal ref="shareModal" />
    <!--感谢-->
    <thank-modal ref="thankModal" />
    <!--举报-->
    <report-modal ref="reportModal" :reasonList="reasonList"/>
    <!--追加悬赏-->
    <reward-modal ref="rewardModal" />
    <!--更多设置-->
    <setting-modal ref="settingModal" />
    <!--补充回答-->
    <supplement-answer-modal ref="supplementAnswerModal" />
    <!--发私信-->
    <message-create-modal ref="messageCreateModal"/>
  </div>
</template>

<script>
import {urlWebAskQuestion,urlWebAskAnswer} from '~/api/ask'
import AuthorCard from '~/components/ask/AuthorCard'
import AnswerEditor from '~/components/ask/AnswerEditor'
import AnswerItem from '~/components/ask/AnswerItem'
import InviteModal from '~/components/ask/InviteModal'
import ShareModal from '~/components/ask/ShareModal'
import ThankModal from '~/components/ask/ThankModal'
import ReportModal from '~/components/ask/ReportModal'
import RewardModal from '~/components/ask/RewardModal'
import SettingModal from '~/components/ask/SettingModal'
import SupplementAnswerModal from '~/components/ask/SupplementAnswerModal'
import MessageCreateModal from '~/components/ask/MessageCreateModal'

export default {
  name: '_id',
  components: { MessageCreateModal, SupplementAnswerModal, SettingModal, RewardModal, ReportModal, ThankModal, ShareModal, InviteModal, AnswerItem, AnswerEditor, AuthorCard },
  layout: "ask",
  head: {
    titleTemplate: '问题详情  - %s',
  },
  async asyncData(ctx) {
    let res = await ctx.$axios.get(urlWebAskQuestion +'/show/'+ ctx.params.id)
    return {
      is_collection:res.data.is_collection,
      show_close:res.data.show_close,
      show_delete:res.data.show_delete,
      show_edit:res.data.show_edit,
      show_reward:res.data.show_reward,
      show_set:res.data.show_set,
      is_digg:res.data.is_digg,
      is_step:res.data.is_step,
      is_follow:res.data.is_follow,
      hotArticle:res.data.hotArticle,
      hotExpert:res.data.hotExpert,
      hotQuestion:res.data.hotQuestion,
      hotTags:res.data.hotTags,
      newQuestion:res.data.newQuestion,
      reasonList:res.data.reasonList,
      questionInfo:res.data.info,
      userCard:res.data.userCard,
      order:ctx.query.order||'default'
    }
  },
  data() {
    return {
      is_collection:0,//是否收藏
      show_close:0,//
      show_delete:0,//
      show_edit:0,//
      show_reward:0,//
      show_set:0,//
      is_digg:0,//
      is_step:0,//
      is_follow:0,//
      questionInfo:{},
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
      answerList: [
        {
          replyShow: false,
          replayList: []
        }
      ],
      query:{
        page:1,
        limit:10
      },
      best_answer:{},
      total:0
    }
  },
  computed:{
    titleStyle(){
      if(this.questionInfo.style){
        let styleInfo=JSON.parse(this.questionInfo.style)
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
      return {}
    }
  },
  mounted() {
    this.getAnswerList()
  },
  methods: {
    //获取回答列表
    getAnswerList(){
      this.query.order = this.order
      this.$axios.get(urlWebAskAnswer+'/index/'+this.$route.params.id,{params:this.query}).then(res=>{
        this.best_answer=res.data.best_answer
        this.answerList=res.data.list
        this.total=res.total
      })
    },
    //提交回答
    subAnswer(){
      this.query.page=1
      this.getAnswerList()
    },
    /* 收藏问题 */
    /* 收藏回答 */
    collectionTheme(type,answer) {
      let data={
        type:type,
        theme_id:this.$route.params.id
      }
      let operate=this.is_collection
      if(type===3){
        data.theme_id=answer.id
        operate =answer.is_collection
      }
      if(operate===1){
        this.$axios.delete(urlWebAskCollection, { params:data }).then(res=>{
          if(type===1){
            this.is_collection = this.is_collection===1?0:1
          }else{
            answer.is_collection = answer.is_collection===1?0:1
          }
          this.$message.success('取消收藏成功')
        })
      }else{
        this.$axios.post(urlWebAskCollection,data).then(res=>{
          if(type===1){
            this.is_collection = this.is_collection===1?0:1
          }else{
            answer.is_collection = answer.is_collection===1?0:1
          }
          this.$message.success('收藏成功')
        })
      }
    },
    /* 关注问题*/
    followItem(type){
      let operate=this.is_follow
      let data={
        type:type,
        theme_id:this.$route.params.id
      }
      if(type==='user'){
        data.theme_id=this.userCard.user_id
        operate =this.userCard.is_follow
      }
      if(operate===1){
        this.$axios.delete(urlWebAskFollow, { params:data }).then(res=>{
          this.$message.success('已取消关注')
          if(type==='user'){
            this.userCard.is_follow=0
          }
          if(type==='question'){
            this.is_follow=0
          }
        })
      }else{
        this.$axios.post(urlWebAskFollow,data).then(res=>{
          this.$message.success('成功关注')
          if(type==='user'){
            this.userCard.is_follow=1
          }
          if(type==='question'){
            this.is_follow=1
          }
        })
      }
    },
    /* 关闭问题 */
    closeQuestion() {
      this.$confirm('确认关闭此提问？如果当前为悬赏提问，关闭后悬赏金额将退回提问者余额账号！！！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        this.$axios.post(urlWebAskQuestion+'/close/'+this.$route.params.id).then(res=>{
          this.$message.success('已关闭')
        })
      })
    },
    /* 回复回复 */
    replyAnswer(){
      //  添加@到输入框
    },
    /* 采纳回答 */
    adoptAnswer(answer) {
      let data={
        question_id:this.$route.params.id,
        answer_id:answer.id
      }
      this.$confirm('确认采纳此答案？采纳成功以后将无法再进行修改！！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        this.$axios.post(urlWebAskAnswer+'/adopt',data).then(res=>{
          this.$message.success('已采纳')
        })
      })
    },
    /* 邀请回答 */
    inviteSelect(data){

    },
    /* 删除 问题question 回答answer 回复replay */
    delItem(type){
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        if(type === 'question'){
          this.$axios.delete(urlWebAskQuestion+'/destroy/'+this.$route.params.id).then(res=>{
            this.$message.success('已删除')
            this.$router.push('/question')
          })
        }
      })
    },
    /* 顶踩  */
    diggItem(operate,id,conduct,type){
      let data = {
        theme_id:id,
        conduct:conduct,
        type:type
      }
      if(operate===0){
        this.$axios.post(urlWebAskDigg,data).then(res=>{
          if(conduct==='up'){
            this.is_digg=1
            this.digg_num+=1
          }else{
            this.is_step=1
            this.step_num+=1
          }
        })
      }else{
        this.$axios.delete(urlWebAskDigg, { params:data }).then(res=>{
          if(conduct==='up'){
            this.is_digg=0
            this.digg_num-=1
          }else{
            this.is_step=0
            this.step_num-=1
          }
        })
      }
    },
    /* 排序 */
    orderChange(value){
      this.$router.push({query:{order:value}})
      this.query.page=1
      this.query.order=value
      this.getAnswerList()
    }
  }
}
</script>

<style scoped lang="scss">
.phcent-ask-question-num {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 40px 0;
  .num-item{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 0.1rem;
    border: 1px solid rgba($--color-primary2,0.15);
    box-shadow: 0 1px 0.15rem 0.1rem rgba($--color-primary,0.05);
  }
  .follow {
    border-color: $--color-primary3;
    color: #fff;
    background: linear-gradient(90deg, $--color-primary3 0%, $--color-primary4 100%);
    font-weight: bolder;
    border:none;
    .small {
      font-size: 0.3rem;
      font-weight: normal;
      margin-bottom: 5px;
    }
  }

  .views {
    margin-left: 20px;
    background-color: $--color-white;
    border-color: $--color-primary3;
    color: $--color-primary3;
    font-weight: bolder;
    .small {
      font-size: 0.3rem;
      font-weight: normal;
      color: $--color-info;
      margin-bottom: 5px;
    }
  }
  .digg{
    margin-left: 20px;
    background-color: $--color-white;
    i{
      margin-right: 5px;
    }
    &-up{
      cursor: pointer;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #e0e0e0;
      &:hover{
        color: $--color-primary;
      }
    }
    &-down{
      cursor: pointer;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover{
        color: $--color-primary;
      }
    }
  }
}
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
  margin-top: 0.5rem;
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
