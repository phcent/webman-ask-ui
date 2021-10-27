<template>
  <div>
    <user-page title="编辑分类" :btn-list="['return']" :show-explain="false" :right-options="false"></user-page>
    <el-card class="p-t-10" v-loading="loading">
      <el-form ref="form" :model="ruleForm" label-width="120px" class="mange-form">
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请输入分类名称', trigger: 'blur' }]">
          <el-input v-model="ruleForm.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <select-icon v-model="ruleForm.icon" placeholder="请输入分类图标名称"/>
        </el-form-item>
        <el-form-item label="类型" prop="type" :rules="[{ required: true, message: '请选择类型', trigger: 'blur' }]">
          <el-select v-model="ruleForm.type" placeholder="请选择类型">
            <el-option v-for="(item,key) in categoryType" :key="key" :label="item" :value="Number(key)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="颜色">
          <select-color v-model="ruleForm.color"></select-color>
        </el-form-item>
        <el-form-item label="权重">
          <el-input-number v-model="ruleForm.sort" :min="0" :max="999" controls-position="right" />
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input v-model="ruleForm.description" :max="300" type="textarea" placeholder="请输入分类描述"></el-input>
        </el-form-item>
        <el-form-item label="seo关键词">
          <el-input v-model="ruleForm.keyword" placeholder="请输入seo关键词"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="ruleForm.status" size="mini">
            <el-radio-button label="1">正常</el-radio-button>
            <el-radio-button label="2">隐藏</el-radio-button>
          </el-radio-group>
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
import { urlAdminAskCategory } from '~/api/admin/ask'
import SelectIcon from '~/components/SelectIcon'
import SelectColor from '~/components/SelectColor'
export default {
  name: '_id',
  components: { SelectColor, SelectIcon, UserPage },
  layout: "admin",
  head: {
    titleTemplate: '修改分类 - 管理中心  - %s',
  },
  data(){
    return{
      categoryType:{},
      predefineColors:[],
      loading:true,
      ruleForm:{

      }
    }
  },
  mounted() {
    this.getCreate()
  },
  methods:{
    getCreate(){
      this.loading = true
      this.$axios.get(urlAdminAskCategory+'/update/'+this.$route.params.id).then(res=>{
        this.categoryType = res.data.categoryType
        this.ruleForm = res.data.info
        this.loading = false
      })
    },
    onsubmit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$axios.put(urlAdminAskCategory+'/update/'+this.$route.params.id, this.ruleForm).then(res => {
            this.$confirm('编辑分类成功，是否继续?', '提示', {
              confirmButtonText: '继续编辑',
              cancelButtonText: '返回列表',
              type: 'warning'
            }).then(() => {
              this.getCreate()
            }).catch(() => {
              this.$router.push('/manage/ask/category')
            })
          }).catch(err => {
            this.$message.error('编辑分类失败')
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


