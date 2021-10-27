<template>
  <div>
    <user-page title="会员回收站" :total="total" :column-list="columnList" :btn-list="['return']"
               @command="val=>tableSize=val"
               @changeSearch="changeSearch" @refresh="refresh"></user-page>
    <div class="flex">
      <el-card shadow="never" :class="{'cate-show-card':visible}">
        <div >
          <!--        <el-descriptions class="margin-top" title="会员管理"  border>-->
          <!--          <template slot="extra">-->
          <!--            <el-button type="primary" size="small" @click="$router.push('/user/mange/user/add')">新增会员</el-button>-->
          <!--          </template>-->
          <!--        </el-descriptions>-->
          <!--    表格数据-->
          <!--操作按钮-->
          <div class="m-b-10 flex ">
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
          <div class="bg-white">
            <el-table :data="tableData" :size="tableSize" style="width: 100%" v-loading="loading"  @selection-change="handleSelectionChange" class="sys-table" @sort-change="handleSort" >
              <el-table-column type="selection" width="55" align="center"/>
              <el-table-column v-if="columnList.id.show"
                               prop="id"  sortable
                               label="编号"
                               width="80">
              </el-table-column>
              <el-table-column v-if="columnList.name.show"
                               prop="name"  sortable
                               label="用户名"
                               min-width="130">
              </el-table-column>
              <el-table-column v-if="columnList.nick_name.show"
                               prop="nick_name"  sortable
                               label="昵称"
                               min-width="150" :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column v-if="columnList.mobile.show"
                               prop="mobile"  sortable
                               label="手机号" width="170">
                <template slot-scope="scope" v-if="scope.row.mobile">
                  {{ scope.row.mobile }}
                  <el-tag size="mini" v-if="scope.row.mobile_verified_at">已认证</el-tag>
                </template>
              </el-table-column>
              <el-table-column v-if="columnList.email.show"
                               prop="email"  sortable
                               label="邮箱" width="150">
                <template slot-scope="scope" v-if="scope.row.email">
                  {{ scope.row.email }}
                  <el-tag size="mini" v-if="scope.row.email_verified_at">已认证</el-tag>
                </template>
              </el-table-column>
              <el-table-column v-if="columnList.login_num.show"
                               prop="login_num"  sortable
                               label="登入次数" width="100">
              </el-table-column>
              <el-table-column v-if="columnList.login_ip.show"
                               prop="login_ip"  sortable
                               label="登入ip" width="120">
              </el-table-column>
              <el-table-column v-if="columnList.login_time.show"
                               prop="login_time"  sortable
                               label="登入时间" width="170">
              </el-table-column>
              <el-table-column v-if="columnList.last_login_time.show"
                               prop="last_login_time"  sortable
                               label="最后登入时间" width="170">
              </el-table-column>
              <el-table-column v-if="columnList.last_login_ip.show"
                               prop="last_login_ip"  sortable
                               label="最后登入ip" width="120">
              </el-table-column>
              <el-table-column  v-if="columnList.operate.show"
                                fixed="right"
                                label="操作"
                                width="80">
                <template slot-scope="{row}">
                  <el-link :underline="false" icon="ri-restart-line" type="primary" @click="handleBack(row)" class="m-r-5"></el-link>
                  <el-link :underline="false" icon="ri-delete-bin-6-line" type="danger" slot="reference" @click="handleDelete(row)"></el-link>
                </template>
              </el-table-column>
            </el-table>
            <!--    分页-->
            <el-pagination
              style="margin-top: 20px;text-align: right;"
              background
              @current-change="handleCurrentChange"
              :current-page="queryForm.page"
              :page-size = "queryForm.limit"
              layout="prev, pager, next"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </el-card>
      <div>
        <div class="phcent-team" v-if="visible">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <div class="flex flex-col-space flex-row-center p-t-20">
            <h2 class="fz-16">用户组</h2>
          </div>
          <el-tree
            class="m-t-20"
            :data="teamData"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            @node-click="nodeClick"
            ref="tree">
        <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ data.name }}</span>
        <span>
          <el-dropdown @command="handleCommand($event,data,node)">
            <span class="el-dropdown-link">
              <i class="ri-more-fill"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">修改</el-dropdown-item>
              <el-dropdown-item command="2">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </span>
          </el-tree>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { urlAdminSysUser } from '~/api/admin/system'
import { getTree } from '~/plugins/phcent'
import UserPage from '~/components/ask/UserPage'

export default {
  name: 'userMangeIndex',
  components: { UserPage },
  layout: "admin",
  head: {
    titleTemplate: '会员回收站 - 管理中心  - %s',
  },
  data(){
    return {
      tableData:[],
      teamData:[],
      teamList:[],
      selectList:[],
      total:0,
      queryForm:{
        page:1,
        limit:15,
        dataRecovery:1
      },
      loading:true,
      visible:false,
      filterText: '',
      columnList:{
        id:{label:'编号',show:true},
        name:{label:'用户名',show:true},
        nick_name:{label:'昵称',show:true},
        mobile:{label:'手机号',show:true},
        email:{label:'邮箱',show:true},
        login_num:{label:'登入次数',show:true},
        login_ip:{label:'登入ip',show:true},
        login_time:{label:'登入时间',show:true},
        last_login_time:{label:'最后登入时间',show:true},
        last_login_ip:{label:'最后登入ip',show:true},
        status:{label:'',show:true},
        operate:{label:'操作',show:true}
      },
      tableSize:'',
    }
  },
  // asyncData(context) {
  //   let query = JSON.parse(JSON.stringify(context.query))
  //   return  context.$axios.get(urlMangeUser,{queryForm: query})
  //     .then(res => {
  //       return { tableData: res.data,total:res.total }
  //     })
  //     .catch(e => {
  //       context.error({ statusCode: 404, message: '请求会员列表信息异常' })
  //     })
  // },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList()
    // this.getTeamList()
  },
  methods:{
    getList(){
      this.loading=true
      this.$axios.get(urlAdminSysUser+'/index',{params: this.queryForm}).then(res=>{
        this.tableData = res.data.list;
        this.total = res.total;
        this.loading=false
      });
    },
    getTeamList(){
      this.$axios.get(urlAdminSysUser).then(res=>{
        this.teamList = JSON.parse(JSON.stringify(res.data));
        this.teamData = res.data
        // this.teamData = getTree(res.data,'pid',0,'id','pid');
      });
    },
    handleCommand(e,data,node){
      switch (Number(e)){
        case 1:
          this.$refs.modal.edit(data);
          break;
        default:
          this.$axios.delete(urlAdminSysUser + '/' + data.id).then(res=>{
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
            this.$message.success('删除成功');
            //刷新
            // this.getCate();
          }).catch(err=>{
            console.log(err)
          });
          break;
      }
    },
    // 表格选择
    handleSelectionChange(val) {
      this.selectList = val
    },
    // 表格排序
    sortChange(data){
      this.queryForm.sortName = data.prop;
      this.queryForm.sortOrder = '';
      if(data.order === 'ascending' || data.order === 'descending'){
        this.queryForm.sortOrder = data.order === 'ascending'?'asc':'desc';
      }
      this.queryForm.page = 1
      this.getList();
      // this.queryForm.sortName = data.prop
      // this.queryForm.sortOrder = data.order
      // this.queryForm.page = 1
      // this.getList()
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
    handleCurrentChange(val){
      this.ruleForm.page = val;
      this.getList();
    },
    handleTeamModel(){
      this.getTeamList();
    },
    // 点击右侧用户组节点
    nodeClick(data){
      if(this.queryForm.current_team_id === data.id){
        delete this.queryForm.current_team_id
      }else {
        this.queryForm.current_team_id = data.id
      }
      this.queryForm.page = 1
      this.getList()
    },
    handleSort(e){
      this.queryForm.sortName = e.prop;
      this.queryForm.sortOrder = '';
      if(e.order === 'ascending' || e.order === 'descending'){
        this.queryForm.sortOrder = e.order === 'ascending'?'asc':'desc';
      }
      this.queryForm.page = 1
      this.getList();
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
        this.$axios.delete(urlAdminSysUser+'/recovery/'+ids).then(res=>{
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
      this.$axios.put(urlAdminSysUser+'/recovery/'+ids).then(res=>{
        this.$message.success('还原成功')
        this.getList()
      })
    },
  }

}
</script>
<style lang="scss" scoped>
.sys-table{
  width: 100%;
  ::v-deep  th{
    background-color: #f8f8f8;
  }
}
.cate-show-card{
  width: calc(100% - 300px);
}
.phcent-team{
  width: 280px;
  margin-left: 20px;
  position: sticky;
  //top: 2rem;
  right: 0;
  bottom: 0;
  background-color: #FFFFFF;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #EBEEF5;
}
.phcent-con{
  padding-right: 280px;
}
::v-deep .custom-tree-node{
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.35rem;
}
</style>
