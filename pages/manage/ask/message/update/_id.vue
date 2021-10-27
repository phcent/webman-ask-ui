<template>
  <div>
    <user-page title="编辑消息" :btn-list="['return']" :show-explain="false" :right-options="false"></user-page>
    <el-card v-loading="loading">
      <el-form ref="form" :model="ruleForm" label-width="120px" class="mange-form">
        <el-form-item label="发送会员"  prop="user_id" :rules="[{ required: true, message: '请输入发送会员', trigger: 'blur' }]">
          {{ruleForm.user_name}}
          <!--          <el-input v-model="ruleForm.user_id"></el-input>-->
        </el-form-item>
        <el-form-item label="接受会员"  prop="to_user_id" :rules="[{ required: true, message: '请输入接受会员', trigger: 'blur' }]">
          {{ruleForm.to_user_name}}
          <!--          <el-input v-model="ruleForm.to_user_id"></el-input>-->
        </el-form-item>
        <el-form-item label="内容"  prop="content" :rules="[{ required: true, message: '请输入消息内容', trigger: 'blur' }]">
          <el-input v-model="ruleForm.content" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="已读"  prop="is_read" >
          <el-radio-group v-model="ruleForm.is_read" size="mini">
            <el-radio-button :label="1">已读</el-radio-button>
            <el-radio-button :label="2">未读</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发送方删除"  prop="user_del" >
          {{ruleForm.user_del===1?'是':'否'}}
        </el-form-item>
        <el-form-item label="接收方删除"  prop="to_user_del">
          {{ruleForm.to_user_del===1?'是':'否'}}
        </el-form-item>
        <el-form-item label="添加时间"  prop="created_at" >
          {{ruleForm.created_at}}
        </el-form-item>
        <el-form-item label="更新时间"  prop="updated_at" >
          {{ruleForm.updated_at}}
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" size="mini" @click="onsubmit">提交</el-button>
          <el-button size="mini" @click="getCreate">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>

</template>

<script>
import UserPage from '~/components/ask/UserPage'
import { urlAdminAskMessage } from '~/api/admin/ask'
export default {
  name: '_id',
  components: { UserPage },
  layout: "admin",
  head: {
    titleTemplate: '修改消息 - 管理中心  - %s',
  },
  data(){
    return{
      loading:true,
      categoryType:{},
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
      this.$axios.get(urlAdminAskMessage+'/update/'+this.$route.params.id).then(res=>{
        this.ruleForm = res.data.info
        this.loading=false
      })
    },
    onsubmit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.subLoading = true
          this.$axios.put(urlAdminAskMessage+'/update/'+this.$route.params.id, this.ruleForm).then(res => {
            this.$confirm('编辑消息成功，是否继续?', '提示', {
              confirmButtonText: '继续编辑',
              cancelButtonText: '返回列表',
              type: 'warning'
            }).then(() => {
              this.getCreate()
            }).catch(() => {
              this.$router.push('/manage/ask/message')
            })
          }).finally(()=>{
            this.subLoading = false
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


