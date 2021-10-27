<template>
  <div>
    <user-page title="消息管理" :total="total" :column-list="columnList"
               @command="val=>tableSize=val"
               @changeSearch="changeSearch" @refresh="refresh"></user-page>
    <el-card shadow="never">
      <!--筛选-->
      <el-form v-if="showSearch" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="会员编号">
          <el-input v-model="queryForm.user_id" size="mini" placeholder="请输入会员编号"></el-input>
        </el-form-item>
        <el-form-item :label="columnList.to_user_id.label">
          <el-input v-model="queryForm.to_user_name_like" size="mini" :placeholder="'请输入'+columnList.to_user_id.label"></el-input>
        </el-form-item>
        <el-form-item :label="columnList.content.label">
          <el-input v-model="queryForm.content" size="mini" :placeholder="'请输入'+columnList.content.label"></el-input>
        </el-form-item>
        <el-form-item label="是否已读">
          <el-select v-model="queryForm.is_read"  size="mini" placeholder="请选择是否已读">
            <el-option label="请选择" value=""></el-option>
            <el-option label="已读" :value="1"></el-option>
            <el-option label="未读" :value="2"></el-option>
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
        <el-table-column v-if="columnList.user_id.show" prop="user_id" :label="columnList.user_id.label" width="100" sortable align="center" >
          <template slot-scope="{row}">
            <el-tooltip class="item" effect="dark"  placement="top">
              <template #content>
                会员编号：{{row.user_id}}
              </template>
              <span>{{row.user_name}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="columnList.to_user_id.show" prop="to_user_id" :label="columnList.to_user_id.label" width="100" sortable align="center" >
          <template slot-scope="{row}">
            <el-tooltip class="item" effect="dark"  placement="top">
              <template #content>
                会员编号：{{row.to_user_id}}
              </template>
              <span>{{row.to_user_name}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="columnList.content.show" prop="content" :label="columnList.content.label" min-width="100" sortable  />
        <el-table-column v-if="columnList.is_read.show" prop="is_read" :label="columnList.is_read.label" width="100" sortable align="center" >
          <template slot-scope="{row}">
            {{row.is_read===1?'已读':'未读'}}
          </template>
        </el-table-column>
        <el-table-column v-if="columnList.user_del.show" prop="user_del" :label="columnList.user_del.label" width="120" sortable align="center" >
          <template slot-scope="{row}">
            <span :class="{'color-danger':row.user_del===1}">
            {{row.user_del===1?'已删':'未删'}}
            </span>
          </template>
        </el-table-column>
        <el-table-column v-if="columnList.to_user_del.show" prop="to_user_del" :label="columnList.to_user_del.label" width="120" sortable align="center" >
          <template slot-scope="{row}">
            <span :class="{'color-danger':row.to_user_del===1}">
            {{row.to_user_del===1?'已删':'未删'}}
            </span>
          </template>
        </el-table-column>
        <el-table-column v-if="columnList.created_at.show" prop="created_at" :label="columnList.created_at.label" width="170" sortable align="center" />
        <el-table-column v-if="columnList.updated_at.show" prop="updated_at" :label="columnList.updated_at.label" width="170" sortable align="center" />
        <el-table-column v-if="columnList.operate.show" :label="columnList.operate.label" width="80" align="center" fixed="right">
          <template slot-scope="{row}">
            <el-dropdown trigger="click">
              <span class="cursor-pointer"><i class="ri-more-2-fill"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item >
                  <router-link :to="'/manage/ask/message/update/'+row.id">
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
import { urlAdminAskMessage } from '~/api/admin/ask'
export default {
  name: 'index',
  components: { UserPage },
  layout: "admin",
  head: {
    titleTemplate: '消息管理 - 管理中心  - %s',
  },
  data(){
    return{
      loading:true,
      tableData:[],
      tableSize:'',
      selectList:[],
      columnList:{
        id:{label:'Id',show:true},
        user_id:{label:'发送会员',show:true},
        to_user_id:{label:'接受会员',show:true},
        content:{label:'内容',show:true},
        is_read:{label:'已读',show:true},
        user_del:{label:'发送方删除',show:true},
        to_user_del:{label:'接收方删除',show:true},
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
      this.$axios.get(urlAdminAskMessage+'/index',{params:this.queryForm}).then(res=>{
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
        this.$axios.delete(urlAdminAskMessage+'/recovery/'+ids).then(res=>{
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
