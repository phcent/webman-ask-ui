<template>
  <div class="wrapper user-page">
    <div class="user-page-left">
      <user-left-nav></user-left-nav>
    </div>
    <div class="user-page-right">
      <div class="blog-page-left-tabs">
        <div v-for="item in tabsList" :key="item.key" class="blog-page-left-tabs-item" :class="{'tabs-on':item.key===query.type}">
          <nuxt-link :to="{path:$route.path,query:Object.assign({},$route.query,{type:item.key}) }" class="item-a">
            {{item.name}}
          </nuxt-link>
        </div>

      </div>
      <el-card>
        <el-table :data="dataList">
          <el-table-column v-if="query.type==2" label="文章" prop="title">
            <template slot-scope="{row}">
              <nuxt-link :to="'/article/'+row.theme_id">
                {{ row.title }}
              </nuxt-link>
            </template>
          </el-table-column>
          <el-table-column v-else label="问题" prop="title">
            <template slot-scope="{row}">
              <nuxt-link :to="'/question/'+row.theme_id">
                {{ row.title }}
              </nuxt-link>
            </template>
          </el-table-column>
          <el-table-column v-if="query.type==3" label="回答" prop="content">
            <template slot-scope="{row}">
              <div v-html="row.content"></div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="130px" align="center">
            <template slot-scope="{row}">
              <el-button type="primary" size="small" class="answer-list-item-btn" @click="changeCollection(item)">
                <i class="ri-add-fill"></i>{{row.is_collection===1?'取消收藏':'收藏'}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="flex flex-col-center m-t-50 m-b-15" v-if="total>query.limit">
          <el-pagination background
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
import {urlUserAskCollection} from '~/api/user/ask'
import UserLeftNav from '~/components/ask/UserLeftNav'
export default {
  name: "collection",
  components: { UserLeftNav },
  layout:"ask",
  head: {
    titleTemplate: '我的收藏- 会员中心 - %s',
  },
  async asyncData(ctx) {
    let query = ctx.query
    query.type = query.type||'1'
    let res = await ctx.$axios.get(urlUserAskCollection+'/index',{params:query})
    return{
      dataList:res.data.list.map(item=>{
        item.is_collection=1
        return item
      }),
      total:res.total,
      query:{
        page:Number(query.page),
        limit:Number(query.limit),
        type:query.type
      }
    }
  },
  watchQuery:['page','type'],
  data(){
    return{
      tabsList:[
        {
          key:'1',
          name:'我收藏的问题'
        },
        {
          key:'3',
          name:'我收藏的回答'
        },
        {
          key:'2',
          name:'我收藏的文章'
        },
      ],
      query:{
        type:'1'
      },
      total:0,
      dataList:[]
    }
  },
  methods:{
    handleCurrentChange(val){
      this.$router.push({ query: { page:val } });
    },
    changeCollection(item){
      let data={
        type:this.query.type,
        theme_id:item.theme_id
      }
      if(item.is_collection===1){
        this.$axios.delete(urlWebAskCollection, { params:data }).then(res=>{
          item.is_collection=0
          this.$message.success('取消收藏成功')
        })
      }else{
        this.$axios.post(urlWebAskCollection,data).then(res=>{
          item.is_collection=1
          this.$message.success('收藏成功')
        })
      }
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

