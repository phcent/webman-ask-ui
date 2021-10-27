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
                {{isOwn?'我':'TA'}}的粉丝
              </nuxt-link>
            </div>
          </div>
          <div class="phcent-ask-whiteBox">
            <div class="expert-list clearfix flex flex-auto">
              <div v-for="item in dataList" class="flex-3">
                <div class="phcent-ask-expert-item">
                  <author-card :user-id="item.id">
                    <nuxt-link  :to="{name:'u-id',params:{id:item.id}}" class="phcent-ask-expert-item-img">
                      <el-image class="img-circle img-full" :src="item.avatar_url" fit="contain"></el-image>
                    </nuxt-link>
                  </author-card>
                  <div class="phcent-ask-expert-item-box">
                    <div class="p-t-10 p-b-10 expert-item-user">
                      <author-card :user-id="item.user_id">
                        <nuxt-link :to="{name:'u-id',params:{id:item.user_id}}" :title="item.user_name">
                          {{ item.user_name }}</nuxt-link>
                      </author-card>
                    </div>
                    <div class="flex flex-row-center p-b-8 fz-12" :class="[item.is_online===1?'expert-item-online':'expert-item-unset']">
                      <i class="ri-record-circle-fill"></i>{{item.is_online===1?'在线':'离线'}}
                    </div>
                    <div class="expert-item-expert" title="认证专家">认证专家</div>
                    <div class="p-b-8">
                <!--      <a  class="phcent-ask-btn ask-btn-primary"   @click="followItem('user')">-->
                <!--<i class="ri-add-fill m-r-3"></i>{{item.is_follow===1?'已关注':'关注TA'}}</a>-->
                      <a  class="phcent-ask-btn ask-btn-light"  @click="$refs.messageCreateModal.open(item.user_id)">
                <i class="ri-question-answer-line m-r-3"></i>发私信</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-empty v-if="total===0"></el-empty>
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
        <div class="phcent-ask-row-rt">
          <expert-home-nav :user-info="userInfo"/>
        </div>
      </div>
    </div>
    <message-create-modal ref="messageCreateModal"/>
  </div>
</template>

<script>
import {urlUserAskFans} from '~/api/ask'
import ExpertHomeNav from '@/components/ask/ExpertHomeNav'
import ExpertHomeTop from '@/components/ask/ExpertHomeTop'
import UserThumbnail from '@/components/ask/UserThumbnail'
import AuthorCard from '~/components/ask/AuthorCard'
import MessageCreateModal from '~/components/ask/MessageCreateModal'

export default {
  name: "fans",
  components: { MessageCreateModal, AuthorCard, UserThumbnail, ExpertHomeTop, ExpertHomeNav },
  layout: "ask",
  head: {
    titleTemplate: '我的粉丝 - 个人主页 - %s',
  },
  async asyncData(ctx) {
    let query = ctx.query
    query.page=query.page||1
    query.limit=query.limit||1
    let res = await ctx.$axios.get(urlUserAskFans + '/'+ctx.params.id)
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
        type:'new'
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
    handleCurrentChange(val){
      this.$router.push({ query: { page:val } });
    },
  }
}
</script>

<style scoped>

</style>
