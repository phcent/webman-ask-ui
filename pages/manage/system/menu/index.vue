<template>
  <div>
    <user-page title="菜单管理" :total="total" :column-list="columnList"
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
        <el-button size="small" type="primary"
                   @click="$refs.menuModal.open()">
          <i class="ri-add-fill"></i>添加</el-button>
        <el-button :disabled="selectList.length===0" size="small" type="danger"
                   icon="ri-delete-bin-5-fill" @click="handleDelete">
          删除</el-button>
      </div>
      <!--表格-->
      <el-table v-loading="loading" :data="tableData" :size="tableSize" row-key="id"
                :default-expand-all="false"  stripe class="blog-table"
                @selection-change="handleSelectionChange" @sort-change="sortChange">
        <el-table-column v-if="columnList.name.show" prop="name" :label="columnList.name.label" min-width="120" sortable />
        <el-table-column v-if="columnList.id.show" prop="id" :label="columnList.id.label" width="80" sortable align="center" />
        <el-table-column v-if="columnList.icon.show" prop="icon" :label="columnList.icon.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.pid.show" prop="pid" :label="columnList.pid.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.path.show" prop="path" :label="columnList.path.label" width="100" sortable  :show-overflow-tooltip="true" />
        <el-table-column v-if="columnList.controller.show" prop="controller" :label="columnList.controller.label" min-width="160" sortable :show-overflow-tooltip="true" />
        <el-table-column v-if="columnList.created_at.show" prop="created_at" :label="columnList.created_at.label" width="170" sortable align="center" />
        <el-table-column v-if="columnList.updated_at.show" prop="updated_at" :label="columnList.updated_at.label" width="170" sortable align="center" />
        <el-table-column v-if="columnList.operate.show" :label="columnList.operate.label" width="80" align="center" fixed="right">
          <template slot-scope="{row}">
            <nuxt-link to="" @click.native="$refs.menuModal.edit(row)">
              <i class="ri-edit-line"></i>
            </nuxt-link>
            <nuxt-link to="" class="color-danger" @click.native="handleDelete(row)">
              <i class="ri-delete-bin-5-fill"></i>
            </nuxt-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <menu-modal ref="menuModal" :menu-list="tableData" @changeOk="getList"/>
  </div>
</template>

<script>
import UserPage from '~/components/ask/UserPage'
import { urlAdminSysMenu } from '~/api/admin/system'
import { getTree } from '~/plugins/phcent'
import MenuModal from '~/components/system/MenuModal'
export default {
  name: 'index',
  components: { MenuModal, UserPage },
  layout: "admin",
  head: {
    titleTemplate: '菜单管理 - 管理中心  - %s',
  },
  data(){
    return{
      loading:true,
      tableData:[],
      tableSize:'',
      selectList:[],
      columnList:{
        id:{label:'Id',show:true},
        name:{label:'菜单名称',show:true},
        icon:{label:'菜单图标',show:true},
        pid:{label:'父级Id',show:false},
        path:{label:'前端路由',show:true},
        controller:{label:'菜单路由',show:true},
        created_at:{label:'添加时间',show:true},
        updated_at:{label:'更新时间',show:true},
        operate:{label:'操作',show:true}
      },
      queryForm:{
        page:1,
        limit:10000,
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
      this.$axios.get(urlAdminSysMenu+'/index',{params:this.queryForm}).then(res=>{
        this.tableData = getTree(res.data.list,'pid',0,'id','pid')
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
        this.$axios.delete(urlAdminSysMenu+'/destroy/'+ids).then(res=>{
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
