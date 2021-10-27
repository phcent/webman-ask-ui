<template>
  <div class="answer">
    <div>
      <author-card :user-id="answer.user_id">
        <nuxt-link :to="'/u/'+answer.user_id">
          <el-image class="author-img img-circle" :src="answer.user_avatar" fit="contain"></el-image>
        </nuxt-link>
      </author-card>
    </div>
    <div class="answer-info">
      <div class="answer-info-top">
        <div class="answer-info-top-user">
          <author-card :user-id="answer.user_id">
            <nuxt-link :to="'/u/'+answer.user_id" class="answer-info-top-user-name">{{answer.user_name}}</nuxt-link>
          </author-card>
          <span class="color-7-primary2 fz-12">{{answer.created_at}}</span>
        </div>
        <div class="color-7-primary2 fz-12">{{answer.user_description||'这家伙很懒，什么也没写！'}}</div>
      </div>
      <div class="answer-info-content">
        <div v-html="answer.content"></div>
      </div>
      <div class="answer-info-tool">
        <div class="ask-info-tools">
          <el-tooltip
            content="回答对小伙伴有帮助"
            placement="top"
          >
                  <span class="tool-item" :class="{'color-primary':answer.is_digg===1}" @click="$emit('digg')">
                    <i class="ri-arrow-up-s-fill fz-24"></i>赞同{{answer.digg_num}}
                  </span>
          </el-tooltip>
          <el-tooltip
            content="答案是错误的，没有帮助"
            placement="top"
          >
              <span class="tool-item" :class="{'color-primary':answer.is_step===1}" @click="$emit('step')">
                <i class="ri-arrow-down-s-fill fz-24"></i>
              </span>
          </el-tooltip>
          <span class="tool-item" @click="toggleReplay">
                  <i class="ri-chat-3-line"></i>{{answer.reply_num}}添加回复
                </span>
          <span class="tool-item" @click="$emit('collection')">
                  <template v-if="answer.is_collection===1">
                    <i class="ri-bookmark-fill"></i>已收藏
                  </template>
                  <template v-else>
                    <i class="ri-bookmark-line"></i>收藏
                  </template>
                </span>
          <span class="tool-item" @click="$emit('thank')">
                  <i class="ri-heart-line"></i>感谢
                </span>
          <span class="tool-item" @click="$refs.reportModal.open(3,answer.id)">
                  <i class="ri-alert-fill"></i>举报
                </span>
          <el-tooltip
            content="补充完善回答"
            placement="top"
          >
                  <span class="tool-item" @click="$emit('supplement')">
                    <i class="ri-pencil-fill"></i>补充回答
                  </span>
          </el-tooltip>
          <el-tooltip
            content="采纳此回答"
            placement="top"
          >
              <span v-if="showBest" class="tool-item" @click="$emit('adopt')">
                <i class="ri-checkbox-line"></i>采纳此回答
              </span>
          </el-tooltip>
          <el-tooltip
            content="删除回答"
            placement="top"
          >
                  <span class="tool-item" @click="$emit('del')">
                    <i class="ri-close-fill"></i>删除
                  </span>
          </el-tooltip>
        </div>
      </div>
      <div v-if="replyShow">
        <div v-loading="loading" >
          <div v-for="reply in replyList" class="answer">
            <div>
              <author-card :user-id="reply.user_id">
                <nuxt-link :to="'/u/'+reply.user_id">
                  <el-image class="author-img img-circle" :src="reply.user_avatar" fit="contain"></el-image>
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
          <reply-editor :type="1" :theme-id="answer.id" :reply-user-id="reply_user_id" @change="getList"></reply-editor>
        </div>
      </div>
      <div class="answer-info-editor"></div>
    </div>
    <supplement-answer-modal ref="supplementAnswerModal" />
    <report-modal ref="reportModal" :reason-list="reasonList"/>
  </div>
</template>

<script>
import { urlWebAskAnswer } from '~/api/ask'
import SupplementAnswerModal from '~/components/ask/SupplementAnswerModal'
import ReportModal from '~/components/ask/ReportModal'
import AuthorCard from '~/components/ask/AuthorCard'

export default {
  name: 'AnswerItem',
  components: { AuthorCard, ReportModal, SupplementAnswerModal },
  emits:['digg','step','collection','thank','supplement','adopt','del'],
  props:{
    answer:{
      type:Object,
      default(){
        return {}
      }
    },
    showBest:{
      type:Boolean,
      default() {
        return true;
      }
    },
    reasonList:{
      type:Object,
      default(){
        return {}
      }
    }
  },
  data(){
    return{
      loading:false,
      replyShow:false,
      replyList:[],
      query:{
        page:1,
        limit:10
      },
      reply_user_id:0
    }
  },
  watch:{
    answer:{
      handler(newV){
        if(newV.reply_num>0){
          this.getList()
        }
      },
      immediate:true
    }
  },
  methods:{
    getList(){
      this.loading=true
      this.$axios.get(urlWebAskAnswer+'/show/'+this.answer.id,{params:this.query}).then(res=>{
        this.replyList=res.data.list
        this.loading=false
      })
    },
    /* 回答回复 */
    toggleReplay() {
      this.replyShow = !this.replyShow
      this.reply_user_id=0
      if(this.replyShow){
        this.query.page=1
        this.getList()
      }
    },
    replyAnswer(reply){
      this.reply_user_id=reply.user_id
      // this.$refs.replyBox.replyUser(reply.user_name)
    },
    delItem(){

    }
  }
}
</script>

<style scoped lang="scss">
.author-img.img-circle {
  border: 0.075rem solid #fff;
  box-shadow: 0 0.075rem 0.15rem 0 rgba($--color-primary,0.2);
  margin: 0 0.05rem;
  width: 1.2rem;
  height: 1.2rem;
}

</style>
