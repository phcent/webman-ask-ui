<template>
  <div>
    <user-page title="编辑动态" :btn-list="['return']" :show-explain="false" :right-options="false"></user-page>
    <el-card v-loading="loading">
      <el-form ref="form" :model="ruleForm" label-width="120px" class="mange-form">
        <el-form-item label="会员"  prop="user_id" :rules="[{ required: true, message: '请输入动态动态', trigger: 'blur' }]">
          <el-input v-model="ruleForm.user_id"></el-input>
        </el-form-item>
        <el-form-item label="操作类型"  prop="type" :rules="[{ required: true, message: '请输入操作类型', trigger: 'blur' }]">
          <el-input v-model="ruleForm.type"></el-input>
        </el-form-item>
        <el-form-item label="项目编号"  prop="item_id" :rules="[{ required: true, message: '请输入项目编号', trigger: 'blur' }]">
          <el-input v-model="ruleForm.item_id"></el-input>
        </el-form-item>
        <el-form-item label="操作动作"  prop="operation_stage" :rules="[{ required: true, message: '请输入操作动作', trigger: 'blur' }]">
          <el-input v-model="ruleForm.operation_stage"></el-input>
        </el-form-item>
        <el-form-item label="主题"  prop="title" :rules="[{ required: true, message: '请输入动态主题', trigger: 'blur' }]">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容"  prop="content" >
          <el-input v-model="ruleForm.content" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="添加时间"  prop="created_at" >
          {{ruleForm.created_at}}
        </el-form-item>
        <el-form-item label="更新时间"  prop="updated_at" >
          {{ruleForm.updated_at}}
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" size="mini" @click="onsubmit">提交</el-button>
          <el-button size="mini">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>

</template>

<script>
import UserPage from '~/components/ask/UserPage'
import { urlAdminAskDynamic } from '~/api/admin/ask'
export default {
  name: '_id',
  components: { UserPage },
  layout: "admin",
  head: {
    titleTemplate: '修改动态 - 管理中心  - %s',
  },
  data(){
    return{
      loading:true,
      dynamicType:{},
      ruleForm:{

      }
    }
  },
  mounted() {
    this.getCreate()
  },
  methods:{
    getCreate(){
      this.loading=true
      this.$axios.get(urlAdminAskDynamic+'/update/'+this.$route.params.id).then(res=>{
        this.dynamicType = res.data.dynamicType
        this.ruleForm = res.data.info
        this.loading=false
      })
    },
    onsubmit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$axios.put(urlAdminAskDynamic+'/update/'+this.$route.params.id, this.ruleForm).then(res => {
            this.$confirm('编辑评论成功，是否继续?', '提示', {
              confirmButtonText: '继续编辑',
              cancelButtonText: '返回列表',
              type: 'warning'
            }).then(() => {
              this.getCreate()
            }).catch(() => {
              this.$router.push('/manage/ask/dynamic')
            })
          }).catch(err => {
            this.$message.error('编辑评论失败')
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


