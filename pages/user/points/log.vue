<template>
  <div class="wrapper user-page">
    <div class="user-page-left">
      <user-left-nav></user-left-nav>
    </div>
    <div class="user-page-right" v-loading="loading">
      <div class="blog-page-left-tabs">
        <div class="blog-page-left-tabs-item tabs-on">
          <nuxt-link to="" class="item-a">
            积分日志
          </nuxt-link>
        </div>
      </div>
      <el-card>
        <el-table :data="dataList">
          <el-table-column label="操作" width="180" prop="operation_stage_text" ></el-table-column>
          <el-table-column label="可用/原可用" width="120" prop="available_points" align="center" >
            <template slot-scope="scope">
              <span :style="{'color':scope.row.available_points > 0 ? '#f44336':'#4caf50'}">{{scope.row.available_points }}</span>
              <span style="color: #999">/ {{scope.row.old_available_points }}</span>
            </template>
          </el-table-column>
          <el-table-column label="冻结/原冻结" width="120" prop="freeze_points" align="center" >
            <template slot-scope="scope">
              <span :style="{'color':scope.row.freeze_points > 0 ? '#f44336':'#4caf50'}">{{scope.row.freeze_points }}</span>
              <span style="color: #999">/ {{scope.row.old_freeze_points }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作时间" width="180" prop="created_at" ></el-table-column>
          <el-table-column label="说明" prop="description"></el-table-column>
        </el-table>
        <div v-if="total>0" class="flex flex-col-center m-t-50 m-b-15">
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
import {urlUserAskPoints} from '~/api/user/ask'
import UserLeftNav from '~/components/ask/UserLeftNav'

export default {
  name: "log",
  components: { UserLeftNav },
  layout:"ask",
  head: {
    titleTemplate: '积分日志 - 会员中心 - %s',
  },
  async asyncData(ctx) {
    let query = ctx.query
    query.page=query.page||1
    query.limit=query.limit||15
    let res = await ctx.$axios.get(urlUserAskPoints,{params:query})
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

<style scoped lang="scss">
.user-page-right{
  .user-card {
    padding: 20px;
  }
}
</style>

