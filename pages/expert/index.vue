<template>
<div class="phcent-ask-box">
  <div class="wrapper">
    <h2 class="p-t-20 p-b-10 expert-title">
      专家推荐
      <a class="phcent-ask-btn ask-btn-light expert-btn" @click="$refs.ExpertApplyModal.open()"><i class="ri-medal-fill"></i>申请专家认证</a>
    </h2>
    <div class="mb-3">
      这里展示的是由我们为你推荐的资深小伙伴，你可以向TA提问，快速解答你的问题。
    </div>
    <div class="expert-list clearfix flex flex-auto">
      <div v-for="item in expertsList" class="flex-5">
        <div class="phcent-ask-expert-item">
          <author-card :user-id="item.id">
            <nuxt-link  :to="{name:'u-id',params:{id:item.id}}" class="phcent-ask-expert-item-img">
              <el-image class="img-circle img-full" :src="item.avatar_url" fit="contain"></el-image>
            </nuxt-link>
          </author-card>
          <div class="phcent-ask-expert-item-box">
            <div class="p-t-10 p-b-10 expert-item-user">
              <author-card :user-id="item.id">
                <nuxt-link :to="{name:'u-id',params:{id:item.id}}" :title="item.user_name">
                  {{ item.user_name }}</nuxt-link>
              </author-card>
            </div>
            <div class="flex flex-row-center p-b-8 fz-12" :class="[item.is_online===1?'expert-item-online':'expert-item-unset']">
              <i class="ri-record-circle-fill"></i>{{item.is_online===1?'在线':'离线'}}
            </div>
            <div class="expert-item-expert" title="认证专家">认证专家</div>
            <div class="p-b-8"><nuxt-link :to="{name:'question-publish',query:{user_id:item.id}}" class="phcent-ask-btn ask-btn-primary">向TA提问</nuxt-link></div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col-center m-t-50 m-b-15">
      <el-pagination background v-if="total>query.limit"
                     @current-change="handleCurrentChange"
                     :current-page = "query.page"
                     :page-size.sync = "query.limit"
                     layout="prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
  <expert-apply-modal ref="ExpertApplyModal"/>
</div>
</template>

<script>
import { urlUserAskExperts } from '~/api/ask'
import AuthorCard from '~/components/ask/AuthorCard'
import ExpertApplyModal from '~/components/ask/ExpertApplyModal'

export default {
  name: 'index',
  components: { ExpertApplyModal, AuthorCard },
  layout: "ask",
  head: {
    titleTemplate: '专家列表  - %s',
  },
  async asyncData(ctx) {
    let query = ctx.query
    query.page = Number(query.page)||1
    query.limit = Number(query.limit)||15
    let res = await ctx.$axios.get(urlUserAskExperts+'/index',{params:query})
    return{
      expertsList:res.data.list,
      total:res.total,
      query:{
        page:Number(query.page)||1,
        limit:Number(query.limit)||15
      }
    }
  },
  data(){
    return{
      total:0,
      expertsList:[],
      query:{
        page:1,
        limit:15
      }
    }
  },
  watchQuery:['page'],
  methods:{
    handleCurrentChange(val){
      this.$router.push({ query: { page:val } });
    },
  }
}
</script>

<style lang="scss" scoped>
.expert-title{
  font-size: 0.45rem; position: relative;
  width: 100%;
  padding-right: 2rem;
}
.expert-btn{
  position: absolute;
  right: 0;
  i{
    margin-top: -1%;
    margin-right: 0.1rem;
  }
}
.expert-list{
  margin: 0 -15px;
}
</style>
