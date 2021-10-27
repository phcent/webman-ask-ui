<template>
  <div>
    <user-page title="提现管理" :total="total" :column-list="columnList"
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
        <el-table-column v-if="columnList.user_id.show" prop="user_id" :label="columnList.user_id.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.amount.show" prop="amount" :label="columnList.amount.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.real_amount.show" prop="real_amount" :label="columnList.real_amount.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.bank_user.show" prop="bank_user" :label="columnList.bank_user.label" width="120" sortable align="center" />
        <el-table-column v-if="columnList.cash_sn.show" prop="cash_sn" :label="columnList.cash_sn.label" width="130" sortable align="center" />
        <el-table-column v-if="columnList.pay_time.show" prop="pay_time" :label="columnList.pay_time.label" width="170" sortable align="center" />
        <el-table-column v-if="columnList.status.show" prop="status" :label="columnList.status.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.refuse_reason.show" prop="refuse_reason" :label="columnList.refuse_reason.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.bank_name.show" prop="bank_name" :label="columnList.bank_name.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.bank_account.show" prop="bank_account" :label="columnList.bank_account.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.admin_id.show" prop="admin_id" :label="columnList.admin_id.label" width="100" sortable align="center" />
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
// import { urlAdminSysCash } from '~/plugins/api'
export default {
  name: 'index',
  components: { UserPage },
  layout: "admin",
  head: {
    titleTemplate: '余额管理 - 管理中心  - %s',
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
        amount:{label:'提现金额',show:true},
        real_amount:{label:'实际到账',show:true},
        bank_user:{label:'收款人姓名',show:true},
        cash_sn:{label:'提现序列号',show:true},
        pay_time:{label:'支付时间',show:true},
        status:{label:'状态',show:true},
        refuse_reason:{label:'拒绝理由',show:true},
        bank_name:{label:'银行名称',show:true},
        bank_account:{label:'银行账号',show:true},
        admin_id:{label:'管理员',show:true},
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
      this.$axios.get(urlAdminSysCash+'/index',{params:this.queryForm}).then(res=>{
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
        this.$axios.delete(urlAdminSysCash+'/destroy/'+ids).then(res=>{
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
