<template>
  <div>
    <user-page title="回答回收站" :total="total" :column-list="columnList" :show-explain="false" :btn-list="['return']"
               @command="val=>tableSize=val"
               @changeSearch="changeSearch" @refresh="refresh"></user-page>
    <el-card shadow="never">
      <!--筛选-->
      <el-form v-if="showSearch" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="会员编号">
          <el-input v-model="queryForm.user_id" size="mini" placeholder="请输入会员编号"></el-input>
        </el-form-item>
        <el-form-item label="问题编号">
          <el-input v-model="queryForm.question_id" size="mini" placeholder="请输入问题编号"></el-input>
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
        <el-table-column v-if="columnList.user_id.show" prop="user_id" :label="columnList.user_id.label" min-width="100" sortable align="center" >
          <template slot-scope="{row}">
            <el-tooltip class="item" effect="dark" :content="'会员编号：'+row.user_id" placement="top">
              <span>{{ row.user_name }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="columnList.question_id.show" prop="question_id" :label="columnList.question_id.label" min-width="150" sortable  >
          <template slot-scope="{row}">
            <el-tooltip class="item" effect="dark" :content="'问题编号：'+row.question_id" placement="top">
              <span>{{ row.question_title }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="columnList.reward_balance.show" prop="reward_balance" :label="columnList.reward_balance.label" width="100"
                         class-name="bg-color-1-danger color-danger" sortable align="center" />
        <el-table-column v-if="columnList.reward_points.show" prop="reward_points" :label="columnList.reward_points.label" width="100"
                         class-name="bg-color-1-warning color-warning" sortable align="center" />
        <el-table-column v-if="columnList.digg_num.show" prop="digg_num" :label="columnList.digg_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.step_num.show" prop="step_num" :label="columnList.step_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.pay_num.show" prop="pay_num" :label="columnList.pay_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.share_num.show" prop="share_num" :label="columnList.share_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.report_num.show" prop="report_num" :label="columnList.report_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.collection_num.show" prop="collection_num" :label="columnList.collection_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.thank_num.show" prop="thank_num" :label="columnList.thank_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.reply_num.show" prop="reply_num" :label="columnList.reply_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.created_at.show" prop="created_at" :label="columnList.created_at.label" width="170" sortable align="center" />
        <el-table-column v-if="columnList.updated_at.show" prop="updated_at" :label="columnList.updated_at.label" width="170" sortable align="center" />
        <el-table-column v-if="columnList.reward_time.show" prop="reward_time" :label="columnList.reward_time.label" width="170" sortable align="center" />
        <el-table-column v-if="columnList.deleted_at.show" prop="deleted_at" :label="columnList.deleted_at.label" width="170" sortable align="center" />
        <el-table-column v-if="columnList.status.show" prop="status" :label="columnList.status.label" width="100" sortable align="center" >
          <template slot-scope="{row}">
            {{row.status===0?'隐藏':row.status===1?'正常':'关闭'}}
          </template>
        </el-table-column>
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
import UserPage from '~/components/ask/UserPage'
import { urlAdminAskAnswer } from '~/api/admin/ask'
export default {
  name: 'index',
  components: { UserPage },
  layout: "admin",
  head: {
    titleTemplate: '回答回收站 - 管理中心  - %s',
  },
  data(){
    return{
      loading:true,
      tableData:[],
      tableSize:'',
      selectList:[],
      columnList:{
        id:{label:'Id',show:true},
        user_id:{label:'会员编号',show:true},
        question_id:{label:'问题编号',show:true},
        reward_balance:{label:'付费金额',show:true},
        reward_points:{label:'积分',show:true},
        digg_num:{label:'点赞次数',show:true},
        step_num:{label:'点踩次数',show:true},
        pay_num:{label:'付费次数',show:true},
        share_num:{label:'分享次数',show:true},
        report_num:{label:'举报次数',show:true},
        collection_num:{label:'收藏次数',show:true},
        thank_num:{label:'感谢次数',show:true},
        reply_num:{label:'评论次数',show:true},
        created_at:{label:'添加时间',show:true},
        updated_at:{label:'更新时间',show:true},
        reward_time:{label:'采纳时间',show:true},
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
      this.$axios.get(urlAdminAskAnswer+'/index',{params:this.queryForm}).then(res=>{
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
        this.$axios.delete(urlAdminAskAnswer+'/recovery/'+ids).then(res=>{
          this.$message.success('删除成功')
          this.getList()
        })
      })
    },
    /*还原*/
    handleBack(row){
      let ids
      if(this.selectList.length===0){
        ids=row.id
      }else{
        ids = this.selectList.map(item =>{
          return item.id
        })
      }
      this.$axios.put(urlAdminAskAnswer+'/recovery/'+ids).then(res=>{
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
<style scoped lang="scss">
.blog-table{
  width: 100%;
  ::v-deep  th{
    background-color: #f8f8f8;
  }
}
</style>
