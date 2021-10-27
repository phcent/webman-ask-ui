<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="编辑话题"
    width="500px"
    append-to-body
    :before-close="handleClose"
    destroy-on-close
  >
    <el-form label-position="left" label-width="70px">

      <el-tabs v-model="activeName" >
        <el-tab-pane label="基本设置" name="first">
          <el-form-item label="话题名称">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="话题图标">
            <select-icon v-model="ruleForm.icon"></select-icon>
          </el-form-item>
          <el-form-item label="话题图片"></el-form-item>
          <el-form-item label="话题介绍">
            <el-input v-model="ruleForm.summary" type="textarea"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="seo设置" name="second">
          <el-form-item label="seo标题">
            <el-input v-model="ruleForm.seo_title"></el-input>
          </el-form-item>
          <el-form-item label="seo关键词">
            <el-input v-model="ruleForm.seo_keyword"></el-input>
          </el-form-item>
          <el-form-item label="seo描述">
            <el-input v-model="ruleForm.seo_description"></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>

    </el-form>
    <template #footer>
      <span class="dialog-footer  flex flex-col-center">
        <el-button type="primary" :loading="subLoading" @click="onsubmit" size="small">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import SelectIcon from '@/components/SelectIcon'
import { urlUserAskTags } from '@/api/ask'
export default {
  name: 'TagsModal',
  emits:['change'],
  components: { SelectIcon },
  data(){
    return{
      activeName:'first',
      dialogVisible:false,
      ruleForm:{},
      subLoading:false
    }
  },
  methods:{
    open(data){
      this.ruleForm={
        id:data.id,
        name:data.name,
        icon:data.icon,
        summary:data.summary,
        seo_title:data.seo_title,
        seo_keyword:data.seo_keyword,
        seo_description:data.seo_description
      }
      this.dialogVisible = true
    },
    handleClose(){
      this.dialogVisible = false
    },
    onsubmit(){
      this.subLoading=true
      this.$axios.put(urlUserAskTags+'/update/'+this.ruleForm.id,this.ruleForm).then(res=>{
        this.$message.success('编辑成功')
        this.$emit('change')
        this.dialogVisible = false
      }).finally(()=>{
        this.subLoading=false
      })
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-dialog__header{
  display: flex;
  padding-top: 15px;
  padding-bottom: 15px;
}
</style>
