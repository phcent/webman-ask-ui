<template>
  <div>
    <user-page title="付费订单" :total="total" :column-list="columnList"
               @command="val=>tableSize=val"
               @changeSearch="changeSearch" @refresh="refresh"></user-page>
    <el-card shadow="never">
      <!--筛选-->
      <el-form v-if="showSearch" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item :label="columnList.theme_id.label">
          <el-input v-model="queryForm.theme_id" size="mini" :placeholder="'请输入'+columnList.theme_id.label"></el-input>
        </el-form-item>
        <el-form-item :label="columnList.operation_stage.label">
          <el-input v-model="queryForm.operation_stage" size="mini" :placeholder="'请输入'+columnList.operation_stage.label"></el-input>
        </el-form-item>
        <el-form-item :label="columnList.user_id.label">
          <el-input v-model="queryForm.user_id" size="mini" :placeholder="'请输入'+columnList.user_id.label"></el-input>
        </el-form-item>
        <el-form-item :label="columnList.status.label">
          <el-select v-model="queryForm.status"  size="mini" :placeholder="'请选择'+columnList.status.label">
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
        <el-table-column v-if="columnList.theme_id.show" prop="theme_id" :label="columnList.theme_id.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.operation_stage.show" prop="operation_stage" :label="columnList.operation_stage.label" min-width="100" sortable align="center" />
        <el-table-column v-if="columnList.user_id.show" prop="user_id" :label="columnList.user_id.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.status.show" prop="status" :label="columnList.status.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.pay_time.show" prop="pay_time" :label="columnList.pay_time.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.payment_client_type.show" prop="payment_client_type" :label="columnList.payment_client_type.label" width="130" sortable align="center" />
        <el-table-column v-if="columnList.payment_code.show" prop="payment_code" :label="columnList.payment_code.label" width="130" sortable align="center" />
        <el-table-column v-if="columnList.payment_name.show" prop="payment_name" :label="columnList.payment_name.label" width="130" sortable align="center" />
        <el-table-column v-if="columnList.recharge_sn.show" prop="recharge_sn" :label="columnList.recharge_sn.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.trade_sn.show" prop="trade_sn" :label="columnList.trade_sn.label" width="190" sortable align="center" />
        <el-table-column v-if="columnList.amount.show" prop="amount" :label="columnList.amount.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.balance.show" prop="balance" :label="columnList.balance.label" width="130" sortable align="center" />
        <el-table-column v-if="columnList.created_at.show" prop="created_at" :label="columnList.created_at.label" width="170" sortable align="center" />
        <el-table-column v-if="columnList.updated_at.show" prop="updated_at" :label="columnList.updated_at.label" width="170" sortable align="center" />
        <el-table-column v-if="columnList.operate.show" :label="columnList.operate.label" width="80" align="center" fixed="right">
          <template slot-scope="{row}">
            <router-link :to="'/manage/ask/order/update/'+row.id">
              <i class="ri-edit-line"></i>
            </router-link>
            <router-link to="" class="color-danger" @click.native="handleDelete(row)">
              <i class="ri-delete-bin-5-fill"></i>
            </router-link>
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
import { urlAdminAskOrder } from '~/api/admin/ask'
export default {
  name: 'index',
  components: { UserPage },
  layout: "admin",
  head: {
    titleTemplate: '订单管理 - 管理中心  - %s',
  },
  data(){
    return{
      loading:true,
      tableData:[],
      tableSize:'',
      selectList:[],
      columnList:{
        id:{label:'Id',show:true},
        theme_id:{label:'项目编号',show:true},
        operation_stage:{label:'操作类型',show:true},
        user_id:{label:'会员编号',show:true},
        status:{label:'支付状态',show:true},
        pay_time:{label:'支付时间',show:true},
        payment_client_type:{label:'支付使用终端',show:true},
        payment_code:{label:'支付方式标识',show:true},
        payment_name:{label:'支付方式名称',show:true},
        recharge_sn:{label:'充值编号',show:true},
        trade_sn:{label:'第三方支付接口交易号',show:true},
        amount:{label:'订单金额',show:true},
        balance:{label:'预存款金额',show:true},
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
    this.getList()
  },
  methods:{
    //获取数据
    getList(){
      this.loading=true
      this.$axios.get(urlAdminAskOrder+'/index',{params:this.queryForm}).then(res=>{
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
        this.$axios.delete(urlAdminAskOrder+'/destroy/'+ids).then(res=>{
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
