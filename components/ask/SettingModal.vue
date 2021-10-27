<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="更多设置"
    width="450px"
    append-to-body
    :before-close="handleClose"
    destroy-on-close
  >
    <div class="setting-box">
      <el-form ref="form" :model="form" label-position="top">
        <el-form-item>
          <template #label>
            <div class="setting-box-title">
              <span class="header">标题样式设定</span>
            </div>
          </template>
          <el-checkbox v-model="form.bold">粗体</el-checkbox>
          <el-checkbox v-model="form.underline">下划线</el-checkbox>
        </el-form-item>
        <el-form-item>
          <template #label>
            <div class="setting-box-title">
              <span class="header">标题颜色设定</span>
              <span class="color-info">设定颜色二将启用渐变</span>
            </div>
          </template>
<!--          <p class="fz-12 color-danger">启用渐变下划线将隐藏</p>-->
          <el-color-picker v-model="form.color1" size="mini" />
          <el-color-picker v-model="form.color2" size="mini" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <div class="setting-box-title">
              <span class="header">权重设置</span>
              <span class="color-info">数字越大权重越大；数字为0无权重</span>
            </div>
          </template>
          <div>
            置顶权重：
            <el-radio-group v-model="top_sort" size="small">
              <el-radio-button label="0" :value="0"></el-radio-button>
              <el-radio-button label="1" :value="1"></el-radio-button>
              <el-radio-button label="2" :value="2"></el-radio-button>
              <el-radio-button label="3" :value="3"></el-radio-button>
            </el-radio-group>
          </div>
          <div>
            热门权重：
            <el-radio-group v-model="hot_sort" size="small">
              <el-radio-button label="0" :value="0"></el-radio-button>
              <el-radio-button label="1" :value="1"></el-radio-button>
              <el-radio-button label="2" :value="2"></el-radio-button>
              <el-radio-button label="3" :value="3"></el-radio-button>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item>
          <template #label>
            <div class="setting-box-title">
              <span class="header">效果预览</span>
            </div>
          </template>
          <p class="fz-12 color-danger">启用渐变下划线将隐藏</p>
          <div class="setting-title-box">
            <div class="setting-title" :class="{'gradient-color':this.form.color1&&this.form.color2}" :style="titleStyle">我是设置后的标题样式</div>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
     <span class="dialog-footer flex flex-col-center">
        <el-button type="primary" @click="submit" size="small">保存</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script>
import { urlWebAskArticle, urlWebAskQuestion } from '~/api/ask'

export default {
  name: 'SettingModal',
  data(){
    return{
      dialogVisible: false,
      type:1,
      form:{
        bold:false,
        underline:false,
        color1:'',
        color2:'',
        top:false
      },
      hot_sort:0,
      top_sort:0,
      dataInfo:{}
    }
  },
  computed:{
    titleStyle(){
      let style = {
        fontWeight:this.form.bold?'bold':'normal',
        textDecoration:this.form.underline?'underline':'none',
      }
      if(!this.form.color1||!this.form.color2){
        style.color=this.form.color1||this.form.color2
      }else{
        style.backgroundImage='linear-gradient(90deg,'+this.form.color1+' 0%,'+this.form.color2+' 100%'
      }
     return style
    }
  },
  methods:{
    open(type,data){
      this.type=type
      this.hot_sort=data.hot_sort
      this.top_sort=data.top_sort
      if(!data.style){
        this.dataInfo={
          id:data.id
        }
      }else{
        this.dataInfo={
          id:data.id,
          style:JSON.parse(data.style)
        }
        this.form=this.dataInfo.style
      }
      this.dialogVisible = true
    },
    handleClose(){
      this.dialogVisible = false
    },
    submit(){
      let data={
        style:JSON.stringify(this.form),
        hot_sort:this.hot_sort,
        top_sort:this.top_sort
      }
      if(this.type===1){
        this.$axios.post(urlWebAskQuestion+'/config/'+this.dataInfo.id,data).then(res=>{
          this.$message.success('设置成功')
          this.dialogVisible = false
        })
      }else{
        this.$axios.post(urlWebAskArticle+'/config/'+this.dataInfo.id,data).then(res=>{
          this.$message.success('设置成功')
          this.dialogVisible = false
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.setting-title{

}
::v-deep .el-dialog__header{
  display: flex;
  padding-top: 15px;
  padding-bottom: 15px;
}
.setting-box{
  .setting-title-box{
    padding: 5px 20px;
    border: 1px solid #f0f0f0;
  }
  .setting-title{
    font-size: 0.5rem;
    display: inline-block;
    &.gradient-color{
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  font-size: 0.35rem;
  ::v-deep .el-form-item{
    margin-bottom: 0;
  }
  ::v-deep .el-form-item__label{
    padding: 0;
    line-height: 25px;
  }
  &-title{
    .header{
      font-weight: bolder;
    }
  }
}

</style>

