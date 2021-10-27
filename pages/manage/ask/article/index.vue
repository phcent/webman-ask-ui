<template>
  <div>
    <user-page title="文章管理" :total="total" :column-list="columnList"
               @command="val=>tableSize=val"
               @changeSearch="changeSearch" @refresh="refresh"></user-page>
    <el-card shadow="never">
      <!--筛选-->
      <el-form v-if="showSearch" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="会员编号">
          <el-input v-model="queryForm.user_id" size="mini" placeholder="请输入会员编号"></el-input>
        </el-form-item>
        <el-form-item label="文章标题">
          <el-input v-model="queryForm.title_like" size="mini" placeholder="请输入文章标题"></el-input>
        </el-form-item>
        <el-form-item label="文章编号">
          <el-input v-model="queryForm.id" size="mini" placeholder="请输入文章编号"></el-input>
        </el-form-item>
        <el-form-item label="seo关键词">
          <el-input v-model="queryForm.keyword_like" size="mini" placeholder="请输入seo关键词"></el-input>
        </el-form-item>
        <el-form-item label="seo描述">
          <el-input v-model="queryForm.description_like" size="mini" placeholder="请输入seo描述"></el-input>
        </el-form-item>
        <el-form-item label="文章分类">
          <el-select v-model="queryForm.cate_id"  size="mini" placeholder="请选择文章分类">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="cate in categoryList" :label="cate.name" :key="cate.id" :value="cate.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status"  size="mini" placeholder="请选择文章状态">
            <el-option label="请选择" value=""></el-option>
            <el-option label="正常" :value="1"></el-option>
            <el-option label="隐藏" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getList">查询</el-button>
          <el-button size="mini" @click="searchReset">重置</el-button>
        </el-form-item>
      </el-form>
      <!--操作按钮-->
      <div class="m-b-10 flex">
        <el-button :disabled="selectList.length===0" size="small" icon="ri-delete-bin-5-fill" type="danger"
                   @click="handleDelete">删除</el-button>
        <el-button size="small" type="primary" icon="ri-recycle-fill" @click="$router.push('/manage/ask/article/recovery')">
          回收站</el-button>
      </div>
      <!--表格-->
      <el-table v-loading="loading" :data="tableData" :size="tableSize"  stripe class="blog-table"
                @selection-change="handleSelectionChange" @sort-change="sortChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column v-if="columnList.id.show" prop="id" :label="columnList.id.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.user_id.show" prop="user_id" :label="columnList.user_id.label" width="100" sortable align="center" >
          <template slot-scope="{row}">
            <el-tooltip class="item" effect="dark" :content="'会员编号：'+row.user_id" placement="top">
              <span>{{ row.user_name }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="columnList.title.show" prop="title" :label="columnList.title.label" min-width="150" sortable :show-overflow-tooltip="true" />
        <el-table-column v-if="columnList.cate_id.show" prop="cate_id" :label="columnList.cate_id.label" width="100" sortable align="center" >
          <template slot-scope="{row}">
            <span>{{getCateName(row.cate_id)}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columnList.reward_balance.show" prop="reward_balance" :label="columnList.reward_balance.label" width="100"
                         class-name="bg-color-1-danger color-danger" sortable align="center" >
          <template slot-scope="{row}">
            ￥{{row.reward_balance}}
          </template>
        </el-table-column>
        <el-table-column v-if="columnList.reward_points.show" prop="reward_points" :label="columnList.reward_points.label" width="100"
                         class-name="bg-color-1-warning color-warning" sortable align="center" />
        <el-table-column v-if="columnList.pay_num.show" prop="pay_num" :label="columnList.pay_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.digg_num.show" prop="digg_num" :label="columnList.digg_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.step_num.show" prop="step_num" :label="columnList.step_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.view_num.show" prop="view_num" :label="columnList.view_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.report_num.show" prop="report_num" :label="columnList.report_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.collection_num.show" prop="collection_num" :label="columnList.collection_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.thank_num.show" prop="thank_num" :label="columnList.thank_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.reply_num.show" prop="reply_num" :label="columnList.reply_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.share_num.show" prop="share_num" :label="columnList.share_num.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.hot_sort.show" prop="hot_sort" :label="columnList.hot_sort.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.top_sort.show" prop="top_sort" :label="columnList.top_sort.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.sort.show" prop="sort" :label="columnList.sort.label" width="100" sortable align="center" />
        <el-table-column v-if="columnList.keyword.show" prop="keyword" :label="columnList.keyword.label" width="150" sortable :show-overflow-tooltip="true"/>
        <el-table-column v-if="columnList.description.show" prop="description" :label="columnList.description.label" min-width="200" sortable :show-overflow-tooltip="true" />
        <el-table-column v-if="columnList.created_at.show" prop="created_at" :label="columnList.created_at.label" width="170" sortable align="center" />
        <el-table-column v-if="columnList.updated_at.show" prop="updated_at" :label="columnList.updated_at.label" width="170" sortable align="center" />
        <el-table-column v-if="columnList.status.show" prop="status" :label="columnList.status.label" width="100" sortable align="center" >
          <template slot-scope="{row}">
            <el-switch
              v-model="row.status" @change="changeStatus($event,row)"
              :active-value="1"
              :inactive-value="2">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column v-if="columnList.operate.show" :label="columnList.operate.label" width="80" align="center" fixed="right">
          <template slot-scope="{row}">
            <el-dropdown trigger="click">
              <span class="cursor-pointer"><i class="ri-more-2-fill"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item >
                  <router-link :to="'/manage/ask/article/update/'+row.id">
                    <i class="ri-eye-2-line"></i>查看
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item >
                  <router-link :to="'/manage/ask/article/update/'+row.id">
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
import { urlAdminAskArticle } from '~/api/admin/ask'
export default {
  name: 'index',
  components: { UserPage },
  layout: "admin",
  head: {
    titleTemplate: '文章管理 - 管理中心  - %s',
  },
  data(){
    return{
      loading:true,
      tableData:[],
      categoryList:[],
      tableSize:'',
      columnList:{
        id:{label:'Id',show:true},
        user_id:{label:'会员',show:true},
        title:{label:'标题',show:true},
        cate_id:{label:'分类',show:true},
        reward_balance:{label:'付费金额',show:true},
        reward_points:{label:'积分',show:true},
        pay_num:{label:'付费次数',show:true},
        digg_num:{label:'点赞次数',show:true},
        step_num:{label:'点踩次数',show:true},
        view_num:{label:'浏览次数',show:true},
        report_num:{label:'举报次数',show:true},
        collection_num:{label:'收藏次数',show:true},
        thank_num:{label:'感谢次数',show:true},
        reply_num:{label:'评论次数',show:true},
        share_num:{label:'分享次数',show:true},
        hot_sort:{label:'热门权重',show:true},
        top_sort:{label:'置顶权重',show:true},
        sort:{label:'权重',show:true},
        keyword:{label:'seo关键词',show:true},
        description:{label:'seo描述',show:true},
        created_at:{label:'添加时间',show:true},
        updated_at:{label:'更新时间',show:true},
        status:{label:'状态',show:true},
        operate:{label:'操作',show:true}
      },
      selectList:[],
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
      this.$axios.get(urlAdminAskArticle+'/index',{params:this.queryForm}).then(res=>{
        this.tableData = res.data.list
        this.categoryList = res.data.categoryList
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
        this.$axios.delete(urlAdminAskArticle+'/destroy/'+ids).then(res=>{
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
    getCateName(id){
      let name=''
      this.categoryList.forEach(item=>{
        if(item.id===id){
          name=item.name
        }
      })
      return name
    },
    changeStatus(value,row){
      this.$axios.put(urlAdminAskArticle+'/update/'+row.id,row).then(res=>{

      }).catch((res)=>{
        this.$message.success(res.msg)
        this.getList()
      })
    }
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


