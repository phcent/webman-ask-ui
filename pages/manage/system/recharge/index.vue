<template>
  <div>
    <user-page title="充值管理" :total="total" :column-list="columnList"
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
        <el-button :disabled="selectList.length===0" size="small" type="danger"
                   icon="ri-delete-bin-5-fill" @click="handleDelete">
          删除</el-button>
      </div>
      <!--表格-->
      <el-table v-loading="loading" :data="tableData" :size="tableSize"  stripe class="blog-table"
                @selection-change="handleSelectionChange" @sort-change="sortChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column v-if="columnList.id.show" prop="id" :label="columnList.id.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.available_balance.show" prop="available_points" :label="columnList.available_balance.label"
                         class-name="bg-color-1-success color-success" width="100" sortable align="center" />
        <el-table-column v-if="columnList.freeze_balance.show" prop="freeze_points" :label="columnList.freeze_balance.label"
                         class-name="bg-color-1-primary color-primary" width="100" sortable align="center" />
        <el-table-column v-if="columnList.old_available_balance.show" prop="old_available_points" :label="columnList.old_available_balance.label"
                         class-name="bg-color-1-success color-success" width="120" sortable align="center" />
        <el-table-column v-if="columnList.old_freeze_balance.show" prop="old_freeze_points" :label="columnList.old_freeze_balance.label"
                         class-name="bg-color-1-primary color-primary" width="120" sortable align="center" />
        <el-table-column v-if="columnList.operation_stage.show" prop="operation_stage" :label="columnList.operation_stage.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.description.show" prop="description" :label="columnList.description.label" min-width="100" sortable align="center" />
        <el-table-column v-if="columnList.created_at.show" prop="created_at" :label="columnList.created_at.label" width="170" sortable align="center" />
        <el-table-column v-if="columnList.updated_at.show" prop="updated_at" :label="columnList.updated_at.label" width="170" sortable align="center" />
        <el-table-column v-if="columnList.operate.show" :label="columnList.operate.label" width="80" align="center" fixed="right">
          <template slot-scope="{row}">
            <nuxt-link to="" class="color-danger" @click.native="handleDelete(row)">
              <i class="ri-delete-bin-5-fill"></i>
            </nuxt-link>
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
export default {
  name: 'index',
  components: { UserPage },
  layout: "admin",
  head: {
    titleTemplate: '充值管理 - 管理中心  - %s',
  },
  data(){
    return{
      loading:true,
      tableData:[],
      tableSize:'',
      selectList:[],
      columnList:{
        id:{label:'Id',show:true},
        user_name:{label:'会员昵称',show:true},
        available_balance:{label:'可用余额',show:true},
        freeze_balance:{label:'冻结余额',show:true},
        old_available_balance:{label:'原可用余额',show:true},
        old_freeze_balance:{label:'原冻结余额',show:true},
        operation_stage:{label:'操作类型',show:true},
        description:{label:'说明',show:true},
        created_at:{label:'添加时间',show:true},
        updated_at:{label:'更新时间',show:true},
        operate:{label:'操作',show:true}
      },
      queryForm:{
        page:1,
        limit:15,
      },
      total:0,
      showSearch:false
    }
  },
  mounted() {
    // this.getList()
  },
  methods:{
    //获取数据
    getList(){
      this.loading=true
      this.$axios.get(urlMangeReply+'/index',{params:this.queryForm}).then(res=>{
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
        this.$axios.delete(urlMangeReply+'/destroy/'+ids).then(res=>{
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
