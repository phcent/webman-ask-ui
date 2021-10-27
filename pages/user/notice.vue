<template>
  <div class="wrapper user-page">
    <div class="user-page-left">
      <user-left-nav></user-left-nav>
    </div>
    <div class="user-page-right">
      <div class="blog-page-left-tabs">
        <div class="blog-page-left-tabs-item tabs-on">
          <nuxt-link to="" class="item-a">
            我的通知
          </nuxt-link>
        </div>
        <el-button type="primary" class="add-question" size="small" @click="readNotice">
          全部标为已读</el-button>
      </div>
      <el-card class="p-l-20 p-r-20" v-loading="loading">
        <ul class="homepage-list">
          <li v-for="(item,index) in dataList" :key="index" class="homepage-list-item flex">
            <author-card :user-id="item.user_id">
              <nuxt-link :to="'/experts/'+item.user_id">
                <el-avatar :size="50"/>
              </nuxt-link>
            </author-card>
            <div class="flex-1 m-l-10">
              <div>
                <nuxt-link :to="'/experts/'+item.user_id" class="author-name">{{ item }}</nuxt-link>
                <span class="color-info">评论了你发表的文章</span>
                <div class="float-right">
                  <el-button type="primary" size="mini" @click="readNotice(item)">已读</el-button>
                  <el-button type="danger" size="mini">删除</el-button>
                </div>
              </div>
              <div class="color-info m-t-10">四天前</div>
              <div class="m-t-10">
                的复活节扩大和地方JFK拉黑就很大了的空间
              </div>
              <div class="text-muted">
                <blockquote>的哈萨克结婚的</blockquote>
              </div>
            </div>
          </li>
        </ul>
        <el-empty v-if="total===0" description="暂无通知" />
        <div class="flex flex-col-center m-t-50 m-b-15">
          <el-pagination background v-if="total>query.limit"
                         @current-change="handleCurrentChange"
                         :current-page = "query.page"
                         :page-size.sync = "query.limit"
                         layout="prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </el-card>

    </div>
  </div>
</template>

<script>
import {urlUserAskNotice} from '~/api/user/ask'
import UserLeftNav from '~/components/ask/UserLeftNav'
import AuthorCard from '~/components/ask/AuthorCard'

export default {
  name: "notice",
  components: { AuthorCard, UserLeftNav },
  layout:"ask",
  head: {
    titleTemplate: '我的通知- 会员中心 - %s',
  },
  async asyncData(ctx) {
    let query = ctx.query
    query.page=query.page||1
    query.limit=query.limit||15
    let res = await ctx.$axios.get(urlUserAskNotice+'/index',{params:query})
    return{
      dataList:res.data.list,
      total:res.total,
      query:{
        page:Number(query.page)||1,
        limit: query.limit||15
      },
      loading:false
    }
  },
  data(){
    return{
      loading:true,
      dataList:[],
      total:0,
      query:{
        page:1,
        limit:15,
      },
    }
  },
  watchQuery:['page'],
  methods:{

    handleCurrentChange(val){
      this.$router.push({ query: { page:val } });
    },
    readNotice(item){
      let id=item.id||0
      this.$axios.post(urlUserAskNotice+'/read/'+id).then(res=>{
        if(item){
          item.is_read=1
        }else{
          this.dataList.forEach(item=>{
            item.is_read=1
          })
        }
      })
    },
    delNotice(item,index){
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        this.$axios.delete(urlUserAskNotice+'/destroy/'+item.id).then(res=>{
          this.$message.success('删除成功')
          this.dataList.splice(index,1)
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.user-page-right{
  .user-card {
    padding: 20px;
  }
}
</style>

