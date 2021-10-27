<template>
  <div>
    <user-page title="问题回收站" :total="total" :column-list="columnList" :show-explain="false" :btn-list="['return']"
               @command="val=>tableSize=val"
               @changeSearch="changeSearch" @refresh="refresh"></user-page>
    <el-card shadow="never">
      <!--筛选-->
      <el-form v-if="showSearch" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="输入">
          <el-input v-model="queryForm.user" size="mini" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="选择">
          <el-select v-model="queryForm.region"  size="mini" placeholder="请选择">
            <el-option label="Zone one" value="shanghai"></el-option>
            <el-option label="Zone two" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getList">查询</el-button>
          <el-button size="mini" @click="searchReset">重置</el-button>
        </el-form-item>
      </el-form>
      <!--操作按钮-->
      <div class="m-b-10 flex">
        <el-button :disabled="selectList.length===0" size="small" type="primary"
                   @click="handleBack">
          <i class="ri-restart-line"></i>还原</el-button>
        <el-button :disabled="selectList.length===0" size="small" type="danger"
                   @click="handleDelete">
          <i class="ri-close-fill"></i>销毁</el-button>
        <el-button size="small" type="success">
          <i class="ri-restart-line"></i>还原全部</el-button>
        <el-button size="small" type="danger">
          <i class="ri-close-fill"></i>清空回收站</el-button>
      </div>
      <!--表格-->
      <el-table v-loading="loading" :data="tableData" :size="tableSize"  stripe class="blog-table"
                @selection-change="handleSelectionChange" @sort-change="sortChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column v-if="columnList.id.show" prop="id" :label="columnList.id.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.user_id.show" prop="user_id" :label="columnList.user_id.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.cate_id.show" prop="cate_id" :label="columnList.cate_id.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.title.show" prop="title" :label="columnList.title.label" min-width="250" sortable :show-overflow-tooltip="true" >
          <template slot-scope="{row}">
            <router-link to="" >{{row.title}}</router-link>
          </template>
        </el-table-column>
        <el-table-column v-if="columnList.reward_balance.show" prop="reward_balance" :label="columnList.reward_balance.label" width="100"
                         class-name="bg-color-1-danger color-danger" sortable align="center" />
        <el-table-column v-if="columnList.reward_points.show" prop="reward_points" :label="columnList.reward_points.label" width="100"
                         class-name="bg-color-1-warning color-warning" sortable align="center" />
        <el-table-column v-if="columnList.digg_num.show" prop="digg_num" :label="columnList.digg_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.step_num.show" prop="step_num" :label="columnList.step_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.view_num.show" prop="view_num" :label="columnList.view_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.follow_num.show" prop="follow_num" :label="columnList.follow_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.report_num.show" prop="report_num" :label="columnList.report_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.collection_num.show" prop="collection_num" :label="columnList.collection_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.thank_num.show" prop="thank_num" :label="columnList.thank_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.comment_num.show" prop="comment_num" :label="columnList.comment_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.reply_num.show" prop="reply_num" :label="columnList.reply_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.best_comment.show" prop="best_comment" :label="columnList.best_comment.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.share_num.show" prop="share_num" :label="columnList.share_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.hot_sort.show" prop="hot_sort" :label="columnList.hot_sort.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.top_sort.show" prop="top_sort" :label="columnList.top_sort.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.sort.show" prop="sort" :label="columnList.sort.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.keyword.show" prop="keyword" :label="columnList.keyword.label" width="120" sortable align="center" />
        <el-table-column v-if="columnList.description.show" prop="description" :label="columnList.description.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.created_at.show" prop="created_at" :label="columnList.created_at.label" width="170" sortable align="center" />
        <el-table-column v-if="columnList.updated_at.show" prop="updated_at" :label="columnList.updated_at.label" width="170" sortable align="center" />
        <el-table-column v-if="columnList.deleted_at.show" prop="deleted_at" :label="columnList.deleted_at.label" width="170" sortable align="center" />
        <el-table-column v-if="columnList.status.show" prop="status" :label="columnList.status.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.operate.show" :label="columnList.operate.label" width="80" align="center" fixed="right">
          <template slot-scope="{row}">
            <el-dropdown trigger="click">
              <span class="cursor-pointer"><i class="ri-more-2-fill"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item >
                  <a href="javascript:void(0);" @click="handleBack(row)">
                    <i class="ri-restart-line"></i>还原
                  </a>
                </el-dropdown-item>
                <el-dropdown-item >
                  <a href="javascript:void(0);" class="color-danger" @click="handleDelete(row)">
                    <i class="ri-close-fill"></i>销毁
                  </a>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="p-t-10 flex flex-col-center">
        <el-pagination background layout="sizes, prev, pager, next"
                       :current-page="queryForm.page"
                       :page-sizes="[10, 15, 30, 50]"
                       :page-size="queryForm.limit" :total="total"
                       @size-change="handleSizeChange"
                       @current-change="currentChange">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { urlAdminAskQuestion } from '~/api/admin/ask'
export default {
  name: 'recovery',
  layout: "admin",
  head: {
    titleTemplate: '问题回收站 - 管理中心  - %s',
  },
  data(){
    return{
      loading:true,
      tableData:[],
      tableSize:'',
      selectList:[],
      columnList:{
        id:{label:'Id',show:true},
        user_id:{label:'会员',show:true},
        cate_id:{label:'问题分类',show:true},
        title:{label:'问题名称',show:true},
        reward_balance:{label:'悬赏金额',show:true},
        reward_points:{label:'悬赏积分',show:true},
        digg_num:{label:'点赞次数',show:true},
        step_num:{label:'点踩次数',show:true},
        view_num:{label:'浏览次数',show:true},
        follow_num:{label:'关注次数',show:true},
        report_num:{label:'举报次数',show:true},
        collection_num:{label:'收藏次数',show:true},
        thank_num:{label:'感谢次数',show:true},
        comment_num:{label:'回答次数',show:true},
        reply_num:{label:'评论次数',show:true},
        best_comment:{label:'采纳次数',show:true},
        share_num:{label:'分享次数',show:true},
        hot_sort:{label:'热门权重',show:true},
        top_sort:{label:'置顶权重',show:true},
        sort:{label:'权重',show:true},
        keyword:{label:'seo关键词',show:true},
        description:{label:'seo描述',show:true},
        created_at:{label:'添加时间',show:true},
        updated_at:{label:'更新时间',show:true},
        deleted_at:{label:'删除时间',show:true},
        status:{label:'状态',show:true},
        operate:{label:'操作',show:true}
      },
      queryForm:{
        page:1,
        limit:15,
        dataRecovery:1
      },
      total:0,
      showSearch:false
    }
  },
  mounted() {
    this.getList()
  },
  methods:{
    //获取数据
    getList(){
      this.loading=true
      this.$axios.get(urlAdminAskQuestion+'/index',{params:this.queryForm}).then(res=>{
        this.tableData = res.data.list
        this.total = res.total
        this.loading=false
      })
    },
    // 表格选择
    handleSelectionChange(val) {
      this.selectList = val
    },
    // 表格排序
    sortChange(data){
      this.queryForm.sortName = data.prop
      this.queryForm.sortOrder = data.order
      this.queryForm.page = 1
      this.getList()
    },
    // 筛选切换
    changeSearch(){
      this.showSearch=!this.showSearch
    },
    // 筛选重置
    searchReset(){
      this.queryForm = {
        page: 1,
        limit: this.queryForm.limit
      }
    },
    /*刷新*/
    refresh(){
      this.getList()
    },
    /*销毁*/
    handleDelete(row){
      let ids
      if(this.selectList.length===0){
        ids=row.id
      }else{
        ids = this.selectList.map(item =>{
          return item.id
        })
      }
      this.$confirm('确认销毁?销毁后不可恢复，请谨慎操作', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete(urlAdminAskQuestion+'/recovery/'+ids).then(res=>{
          this.$message.success('删除成功')
          this.getList()
        })
      })
    },
    /*还原*/
    handleBack(row){
      let ids = row.id||this.selectList.map(item =>{
        return item.id
      })
      this.$axios.put(urlAdminAskQuestion+'/recovery/'+ids).then(res=>{
        this.$message.success('还原成功')
        this.getList()
      })
    },
    /*分页*/
    currentChange(value){
      this.queryForm.page=value
      this.getList()
    },
    handleSizeChange(value){
      this.queryForm.limit=value
      this.getList()
    },
  }
}
</script>

<style scoped>

</style>
