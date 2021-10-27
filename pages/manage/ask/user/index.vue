<template>
  <div>
    <user-page title="会员管理" :total="total" :column-list="columnList"
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
        <el-table-column v-if="columnList.grade_id.show" prop="grade_id" :label="columnList.grade_id.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.is_expert.show" prop="is_expert" :label="columnList.is_expert.label" width="100" sortable align="center" >
          <template slot-scope="{row}">
            {{row.is_expert===1?'是':'否'}}
          </template>
        </el-table-column>
        <el-table-column v-if="columnList.question_num.show" prop="question_num" :label="columnList.question_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.answer_num.show" prop="answer_num" :label="columnList.answer_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.answer_best_num.show" prop="answer_best_num" :label="columnList.answer_best_num.label" width="150" sortable align="center" />
        <el-table-column v-if="columnList.article_num.show" prop="article_num" :label="columnList.article_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.reply_num.show" prop="reply_num" :label="columnList.reply_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.collection_num.show" prop="collection_num" :label="columnList.collection_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.follow_num.show" prop="follow_num" :label="columnList.follow_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.view_num.show" prop="view_num" :label="columnList.view_num.label" width="120" sortable align="center" />
        <el-table-column v-if="columnList.fans_num.show" prop="fans_num" :label="columnList.fans_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.hot_sort.show" prop="hot_sort" :label="columnList.hot_sort.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.is_admin.show" prop="is_admin" :label="columnList.is_admin.label" width="100" sortable align="center" >
          <template slot-scope="{row}">
            {{row.is_admin===1?'是':'否'}}
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
                  <router-link :to="'/manage/ask/user/update/'+row.id">
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
import { urlAdminAskUser } from '~/api/admin/ask'
export default {
  name: 'index',
  components: { UserPage },
  layout: "admin",
  head: {
    titleTemplate: '会员管理 - 管理中心  - %s',
  },
  data(){
    return{
      loading:true,
      tableData:[],
      tableSize:'',
      selectList:[],
      columnList:{
        id:{label:'Id',show:true},
        grade_id:{label:'会员等级',show:true},
        is_expert:{label:'认证专家',show:true},
        question_num:{label:'提问数量',show:true},
        answer_num:{label:'回答数量',show:true},
        answer_best_num:{label:'答案被采纳数量',show:true},
        article_num:{label:'文章数量',show:true},
        reply_num:{label:'评论数量',show:true},
        collection_num:{label:'收藏数量',show:true},
        follow_num:{label:'关注数量',show:true},
        view_num:{label:'被浏览数量',show:true},
        fans_num:{label:'粉丝数量',show:true},
        hot_sort:{label:'热门权重',show:true},
        is_admin:{label:'是否超管',show:true},
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
      this.$axios.get(urlAdminAskUser+'/index',{params:this.queryForm}).then(res=>{
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
        this.$axios.delete(urlAdminAskUser+'/destroy/'+ids).then(res=>{
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
