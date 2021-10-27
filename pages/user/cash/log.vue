<template>
  <div class="wrapper user-page">
    <div class="user-page-left">
      <user-left-nav></user-left-nav>
    </div>
    <div class="user-page-right" v-loading="loading">
      <div class="blog-page-left-tabs">
        <div class="blog-page-left-tabs-item ">
          <nuxt-link to="" class="item-a">
            提现日志
          </nuxt-link>
          <span class="color-danger">当前余额123456</span>
        </div>
        <div class="float-right m-t-15">
          <el-button type="primary" size="mini" @click="$router.push('/user/cash')">余额提现</el-button>
        </div>
      </div>
      <el-card>

        <el-table :data="dataList">
          <el-table-column label="金额" width="180"  ></el-table-column>
          <el-table-column label="说明" prop="description"></el-table-column>
          <el-table-column label="操作时间" width="180" prop="created_at" ></el-table-column>
        </el-table>
        <div class="flex flex-col-center m-t-20">
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
import {urlUserAskCash} from '~/api/user/ask'
import UserLeftNav from '~/components/ask/UserLeftNav'

export default {
  name: "log",
  components: { UserLeftNav },
  layout:"ask",
  head: {
    titleTemplate: '提现日志 - 会员中心 - %s',
  },
  async asyncData(ctx) {
    let query = ctx.query
    query.page = query.page||1
    query.limit = query.limit||15
    let res = await ctx.$axios.get(urlUserAskCash +'/index',{params:query})
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
      total:0,
      query:{
        page:1,
        limit:15
      },
      loading:true,
      dataList:[]
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
.user-page-right{
  .user-card {
    padding: 20px;
  }
}
.withdraw-list{
  padding: 10px 20px 20px;
  &-item{
    padding: 20px 0 20px;
    border-bottom: 1px solid #f0f0f0;
    line-height: 1.7;
  }
}
</style>
