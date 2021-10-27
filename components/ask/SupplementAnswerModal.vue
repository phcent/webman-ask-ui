<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="完善回答"
    width="800px"
    append-to-body
    :before-close="handleClose"
    destroy-on-close
  >
    <div class="m-t-20">
      <div ref="aContent" style="position: relative; z-index: 6"></div>
    </div>
    <div class="flex flex-warp p-t-15">
      <div>
        <b>付费查看金额</b>
        <el-input v-model="price" class="m-t-10"/>
      </div>
      <div class="m-l-40">
        <b>付费查看积分</b>
        <el-input v-model="points" class="m-t-10"/>
      </div>
      <div class="m-t-15">
        <b>验证码</b>
        <el-input v-model="points" class="m-t-10"/>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer flex flex-col-center">
        <el-button type="primary" @click="dialogVisible = false" size="small">提交保存</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script>
export default {
  name: 'SupplementAnswerModal',
  data(){
    return{
      dialogVisible: false,
      editor:'',
      content:'',
      price:0,
      points:0
    }
  },
  mounted() {
    // this.initEditor()
  },
  methods:{
    open(){
      this.dialogVisible = true
      let that = this
      setTimeout(function(){
        that.initEditor()
      },100)
    },
    initEditor() {
      this.editor = this.$wangEditor(this.$refs.aContent)
      this.editor.config.onchange = (html) => {
        this.content = html
      }
      this.editor.create()
      this.editor.txt.html(this.content)
    },
    handleClose(){
      this.dialogVisible = false
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


