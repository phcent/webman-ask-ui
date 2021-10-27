<template>
  <div>
    <user-page title="举报管理" :total="total" :column-list="columnList"
               @command="val=>tableSize=val"
               @changeSearch="changeSearch" @refresh="refresh"></user-page>
    <el-card shadow="never">
      <!--筛选-->
      <el-form v-if="showSearch" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item :label="columnList.user_id.label">
          <el-input v-model="queryForm.user_id" size="mini" :placeholder="'请输入'+columnList.user_id.label"></el-input>
        </el-form-item>
        <el-form-item :label="columnList.theme_id.label">
          <el-input v-model="queryForm.theme_id" size="mini" :placeholder="'请输入'+columnList.theme_id.label"></el-input>
        </el-form-item>
        <el-form-item :label="columnList.type.label">
          <el-select v-model="queryForm.type"  size="mini" :placeholder="'请选择'+columnList.type.label">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(item,key) in reportType" :key="key" :label="item" :value="Number(key)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="columnList.reason.label">
          <el-select v-model="queryForm.reason"  size="mini" :placeholder="'请选择'+columnList.reason.label">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(item,key) in reasonList" :key="key" :label="item" :value="Number(key)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getList">查询</el-button>
          <el-button size="mini" @click="searchReset">重置</el-button>
        </el-form-item>
      </el-form>
      <!--操作按钮-->
      <div class="m-b-10 flex">
        <el-button :disabled="selectList.length===0" size="small" type="danger"
                   icon="ri-delete-bin-5-fill" @click="handleDelete">
          删除</el-button>
      </div>
      <!--表格-->
      <el-table v-loading="loading" :data="tableData" :size="tableSize"  stripe class="blog-table"
                @selection-change="handleSelectionChange" @sort-change="sortChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column v-if="columnList.id.show" prop="id" :label="columnList.id.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.user_id.show" prop="user_id" :label="columnList.user_id.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.theme_id.show" prop="theme_id" :label="columnList.theme_id.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.type.show" prop="type" :label="columnList.type.label" width="100" sortable align="center" >
          <template slot-scope="{row}">
            {{reportType[row.type]}}
          </template>
        </el-table-column>
        <el-table-column v-if="columnList.reason.show" prop="reason" :label="columnList.reason.label" width="120" sortable align="center" >
          <template slot-scope="{row}">
            {{reasonList[row.reason]}}
          </template>
        </el-table-column>
        <el-table-column v-if="columnList.content.show" prop="content" :label="columnList.content.label" min-width="300" sortable align="center" :show-overflow-tooltip="true">
          <template slot-scope="{row}">
            <div v-html="row.content"></div>
          </template>
        </el-table-column>
        <el-table-column v-if="columnList.ip.show" prop="ip" :label="columnList.ip.label" width="130" sortable align="center" />
        <el-table-column v-if="columnList.user_agent.show" prop="user_agent" :label="columnList.user_agent.label" min-width="280" sortable  :show-overflow-tooltip="true" />
        <el-table-column v-if="columnList.created_at.show" prop="created_at" :label="columnList.created_at.label" width="170" sortable align="center" />
        <el-table-column v-if="columnList.updated_at.show" prop="updated_at" :label="columnList.updated_at.label" width="170" sortable align="center" />
        <el-table-column v-if="columnList.status.show" prop="status" :label="columnList.status.label" width="100" sortable align="center" >
          <template slot-scope="{row}">
            {{row.status===1?'正常':'隐藏'}}
          </template>
        </el-table-column>
        <el-table-column v-if="columnList.operate.show" :label="columnList.operate.label" width="80" align="center" fixed="right">
          <template slot-scope="{row}">
            <el-dropdown trigger="click">
              <span class="cursor-pointer"><i class="ri-more-2-fill"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item >
                  <router-link :to="'/manage/ask/report/update/'+row.id">
                    <i class="ri-edit-line"></i>编辑
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <router-link to="" class="color-danger" @click.native="handleDelete(row)">
                    <i class="ri-delete-bin-5-fill"></i>删除
                  </router-link>
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
import { urlAdminAskReport } from '~/api/admin/ask'
export default {
  name: 'index',
  components: { UserPage },
  layout: "admin",
  head: {
    titleTemplate: '举报管理 - 管理中心  - %s',
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
        theme_id:{label:'来源编号',show:true},
        type:{label:'举报类型',show:true},
        reason:{label:'举报原因',show:true},
        content:{label:'内容',show:true},
        ip:{label:'提交ip',show:true},
        user_agent:{label:'提交窗口',show:true},
        created_at:{label:'添加时间',show:true},
        updated_at:{label:'更新时间',show:true},
        status:{label:'状态',show:true},
        operate:{label:'操作',show:true}
      },
      queryForm:{
        page:1,
        limit:15,
      },
      total:0,
      showSearch:false,
      reasonList:{},
      reportType:{}
    }
  },
  mounted() {
    this.getList()
  },
  methods:{
    //获取数据
    getList(){
      this.loading=true
      this.$axios.get(urlAdminAskReport+'/index',{params:this.queryForm}).then(res=>{
        this.tableData = res.data.list
        this.total = res.total
        this.reasonList = res.data.reasonList
        this.reportType = res.data.reportType
        this.loading = false
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
    /*删除*/
    handleDelete(row){
      let ids
      if(this.selectList.length===0){
        ids=row.id
      }else{
        ids = this.selectList.map(item =>{
          return item.id
        })
      }
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete(urlAdminAskReport+'/destroy/'+ids).then(res=>{
          this.$message.success('删除成功')
          this.getList()
        })
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
