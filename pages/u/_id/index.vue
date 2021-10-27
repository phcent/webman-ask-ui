<template>
  <div class="homepage phcent-ask-box">
    <div class="wrapper">
      <expert-home-top  :user-info="userInfo"/>
      <div class="phcent-ask-row">
        <div class="phcent-ask-row-lt">
          <!--列表状态-->
          <div class="blog-page-left-tabs">
            <div class="blog-page-left-tabs-item tabs-on">
              <nuxt-link to="" class="item-a">
                最新动态
              </nuxt-link>
            </div>
          </div>
          <div class="phcent-ask-whiteBox">
            <ul class="homepage-list">
              <li v-for="item in dataList" class="homepage-list-item flex">
                <div v-if="!isOwn">
                  <author-card>
                    <nuxt-link to="">
                      <el-avatar :size="50"/>
                    </nuxt-link>
                  </author-card>
                </div>
                <div class="flex-1 m-l-10">
                  <div>
                    <span v-if="isOwn">我</span>
                    <nuxt-link v-else to="" class="author-name">昵称</nuxt-link>
                    <span class="color-info">{{dynamicStage[item.operation_stage]}}{{dynamicType[item.type]}}</span>
                  </div>
                  <div class="color-info m-t-10">{{item.created_at}}</div>
                  <div class="m-t-10">
                    <nuxt-link :to="{name:((item.type===1||item.type===3)?'question-id':'article-id'),params:{id:item.item_id}}">{{item.title}}</nuxt-link>
                  </div>
                  <div v-if="item.type===3" class="text-muted">
                    <blockquote  v-html="item.content"></blockquote>
                  </div>
                </div>
              </li>
            </ul>
            <el-empty v-if="total===0" description="没有动态"></el-empty>
            <div v-if="total>0" class="flex flex-col-center m-t-50 m-b-15">
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
  </div>
</template>

<script>
import {urlUserAskIndex} from '~/api/ask'
import ExpertHomeNav from '@/components/ask/ExpertHomeNav'
import ExpertHomeTop from '@/components/ask/ExpertHomeTop'
import AuthorCard from '@/components/ask/AuthorCard'

export default {
  name: "index",
  components: { AuthorCard, ExpertHomeTop, ExpertHomeNav },
  layout: "ask",
  head: {
    titleTemplate: '我的主页 - 个人主页 - %s',
  },
  async asyncData(ctx) {
    let query = ctx.query
    query.page=query.page||1
    query.limit=query.limit||15
    let res = await ctx.$axios.get(urlUserAskIndex + '/'+ctx.params.id)
    return{
      userInfo:res.data.userInfo,
      dynamicStage:res.data.dynamicStage,
      dynamicType:res.data.dynamicType,
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
      total:0,
      userInfo:{},
      dynamicStage:{},
      dynamicType:{},
      dataList:{},
      query:{
        page:1,
        limit:15,
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

<style scoped lang="scss">
.homepage{
  background-color: #f8f8f8;
  font-size: 0.35rem;
  &-list{
    &-item{
      border-bottom: 1px dashed #e0e0e0;
      padding: 20px 0 20px;
      .author-name{
        color: #333;
        font-size: 0.4rem;
        &:hover{
          color: $--color-primary;
        }
      }
      .text-muted{
        margin: 10px 0;
        blockquote{
          padding: 8px 17px;
          margin: 0 0 17px;
          font-size: 15px;
          border-left: 5px solid #eeeeee;
          color: $--color-info;
        }
      }
    }
  }
}
</style>
