<template>
  <div>
    <user-page title="编辑举报信息" :btn-list="['return']" :show-explain="false" :right-options="false"></user-page>
    <el-card v-loading="loading">
      <el-form ref="form" :model="ruleForm" label-width="120px" class="mange-form">
        <el-form-item label="会员"  prop="user_id" :rules="[{ required: true, message: '请输入举报会员', trigger: 'blur' }]">
          <el-input v-model="ruleForm.user_id"></el-input>
        </el-form-item>
        <el-form-item label="来源编号"  prop="theme_id" :rules="[{ required: true, message: '请输入来源编号', trigger: 'blur' }]">
          <el-input v-model="ruleForm.theme_id"></el-input>
        </el-form-item>
        <el-form-item label="举报类型"  prop="type" :rules="[{ required: true, message: '请选择举报类型', trigger: 'blur' }]">
          <el-select v-model="ruleForm.type" placeholder="请选择举报类型">
            <el-option v-for="(item,key) in reportType" :key="key" :label="item" :value="Number(key)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="举报原因"  prop="reason" :rules="[{ required: true, message: '请选择举报原因', trigger: 'blur' }]">
          <el-select v-model="ruleForm.reason" placeholder="请选择举报原因">
            <el-option v-for="(item,key) in reasonList" :key="key" :label="item" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容"  prop="content" >
          {{ruleForm.content}}
        </el-form-item>
        <el-form-item label="提交ip"  prop="ip">
          {{ruleForm.ip}}
        </el-form-item>
        <el-form-item label="提交窗口"  prop="user_agent">
          {{ruleForm.user_agent}}
        </el-form-item>
        <el-form-item label="添加时间"  prop="created_at" >
          {{ruleForm.created_at}}
        </el-form-item>
        <el-form-item label="更新时间"  prop="updated_at" >
          {{ruleForm.updated_at}}
        </el-form-item>
        <el-form-item label="状态"  prop="status" >
          <el-radio-group v-model="ruleForm.status">
            <el-radio-button :label="1">正常</el-radio-button>
            <el-radio-button :label="2">隐藏</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" size="mini" :loading="subLoading" @click="onsubmit">提交</el-button>
          <el-button size="mini">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import UserPage from '~/components/ask/UserPage'
import { urlAdminAskReport } from '~/api/admin/ask'
export default {
  name: '_id',
  components: { UserPage },
  layout: "admin",
  head: {
    titleTemplate: '修改举报 - 管理中心  - %s',
  },
  data(){
    return{
      loading:true,
      reportType:{},
      reasonList:{},
      ruleForm:{

      },
      subLoading:false
    }
  },
  mounted() {
    this.getCreate()
  },
  methods:{
    getCreate(){
      this.loading=true
      this.$axios.get(urlAdminAskReport+'/update/'+this.$route.params.id).then(res=>{
        this.loading=false
        this.reportType = res.data.reportType
        this.reasonList = res.data.reasonList
        this.ruleForm = res.data.info
      })
    },
    onsubmit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.subLoading=true
          this.$axios.put(urlAdminAskReport+'/update/'+this.$route.params.id, this.ruleForm).then(res => {
            this.$confirm('编辑举报成功，是否继续?', '提示', {
              confirmButtonText: '继续编辑',
              cancelButtonText: '返回列表',
              type: 'warning'
            }).then(() => {
              this.getCreate()
            }).catch(() => {
              this.$router.push('/manage/report/report')
            })
          }).finally(()=>{
            this.subLoading=false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.mange-form{
  max-width: 20rem;
}
</style>


