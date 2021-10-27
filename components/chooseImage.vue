<template>
  <el-dialog
    title="选择图片"
    :visible.sync="dialogVisible"
    custom-class="choose-image"
    width="100%"
    :before-close="handleClose"
    append-to-body>
    <div class="flex flex-col-space">
      <div>
        <el-button v-if="!editShow" size="mini" @click="editShow=!editShow">编辑</el-button>
        <template v-else>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <span>{{checkedImage.length}}/{{image_list.length}}</span>
          <el-button size="mini" type="danger">删除</el-button>
          <el-button  size="mini" @click="editShow=!editShow">完成</el-button>
        </template>
      </div>
      <el-upload
        class="upload-demo"
        :action="action"
        :on-success="handleSuccess"
        :headers="{ Authorization:$auth.strategy.token.get() }"
        :show-file-list="false"
        :before-upload="beforeUpload"
        multiple
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>
    <el-checkbox-group v-model="checkedImage" @change="handleCheckedImageChange">
      <div class="image-list">
        <div class="image-list-item"  :style="{width:itemWidth}"  v-for="(image,index) in image_list" :key="image.id" @click="selectImage(image)">
          <div class="checkbox-box" v-if="editShow">
            <el-checkbox :label="image.id">{{''}}</el-checkbox>
          </div>
          <div class="del-image" v-if="editShow" @click.stop="delImage(image)">
            <i class="ri-delete-bin-5-fill"></i>
          </div>
          <div class="item-image-box" >
            <div class="item-image">
              <el-image :src="image.files_url" fit="cover"></el-image>
            </div>
          </div>
          <div class="item-image-name" :title="image.original_name">{{ image.original_name }}</div>
          <div class="check-box" :class="{'checked':isHas(image)}" v-if="!editShow">
            <i class="ri-checkbox-circle-fill"></i>
          </div>
        </div>
      </div>
    </el-checkbox-group>

    <div>
      <el-pagination
        style="margin-top: 20px;text-align: right;"
        background
        @current-change="handleCurrentChange"
        :current-page = "query.page"
        :page-size.sync = "query.limit"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    <template #footer>
    <div class="dialog-footer">
      <span>
        <template v-if="!editShow" >
          已选{{selected_image.length}}{{maxNum?'/'+maxNum:''}}
        </template>
      </span>
      <div>
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleOk">确 定</el-button>
      </div>
    </div>
    </template>
  </el-dialog>
</template>

<script>
import { urlUpload } from '@/api'
export default {
  name: 'chooseImage',
  emits:['change'],
  props:{
    maxNum:{
      type:Number,
      default:0
    }
  },
  data(){
    return{
      dialogVisible:false,
      editShow:false,
      image_list:[],
      selected_image:[],
      fullWidth:0,
      timer:false,
      action:urlUpload,
      query:{
        page:1,
        limit:24,
      },
      total:0,
      itemWidth:'12.5%',
      checkedImage:[],
      checkAll:false,
      isIndeterminate: true
    }
  },
  mounted() {
    const that = this
    window.onresize = () => {
      return (() => {
        window.fullWidth = document.documentElement.clientWidth
        that.fullWidth = window.fullWidth
      })()
    }
  },

  watch: {
    /* 监听*/
    fullWidth:{
      handler(val){
        if (!this.timer) {
          this.fullWidth = val
          this.timer = true
          if(val>=1000){
            this.itemWidth = '12.5%'
            this.query.limit = 24
          }else if(val>=800){
            this.itemWidth = '20%'
            this.query.limit = 15
          }else if(val>=600){
            this.itemWidth = '33.3%'
            this.query.limit = 9
          }
          let that = this
          setTimeout(function() {
            that.timer = false
          }, 400)
        }
      },
      immediate:true
    },
    // itemWidth:{
    //   handler(){
    //     this.getList()
    //   }
    // }
  },
  methods:{
    open(){
      this.dialogVisible = true;
      this.getList()
    },
    handleClose(){
      this.dialogVisible = false;
    },
    handleOk(){
      this.$emit('change',this.selected_image)
      this.selected_image = []
      this.dialogVisible = false;
    },
    getList(){
      this.image_list=[]
      this.$axios.get(urlUpload,{params:this.query}).then(res=>{
        this.image_list=res.data
        this.total = res.total
      })
    },
    handleCurrentChange(val){
      this.ruleForm.page = val;
      this.getList();
    },
    // 判断是否已选
    isHas(data){
      let has = false;
      this.selected_image.forEach(item=>{
        if(item.id === data.id){
          has = true
        }
      })
      return has
    },
    // 选择
    selectImage(image){
      if(this.editShow){

      }else{
        if(this.isHas(image)){
          this.selected_image.splice(this.selected_image.indexOf(image),1)
        }else{
          if(!this.maxNum){
            this.selected_image.push(image)
          }else if(this.maxNum===1){
            this.selected_image.splice(0,1,image)
          }else{
            if(this.selected_image.length>=this.maxNum){
              //  超出
            }
          }
        }
      }
    },
    handleCheckAllChange(val) {
      let list = []
      this.image_list.forEach(item =>{
        list.push(item.id)
      })
      this.checkedImage = val ? list : [];
      this.isIndeterminate = false;
    },
    handleCheckedImageChange(value){
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.image_list.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.image_list.length;
    },
    // 删除图片
    delImage(image){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete(urlUpload+'/'+image.id).then(res =>{
          this.$message.success( '删除成功!');
          this.getList()
        }).catch(() => {
          this.$message.error( '删除失败!');
        })
      }).catch(() => {
      });

    },
    handleSuccess(response, file, fileList){
      console.log(response)
      this.$message.success('上传成功！')
      this.getList()
    },
    beforeUpload(file){
      /*let formData = new FormData()
      formData.append("file",file);
      this.$axios.post(urlUpload,formData).then(res=>{
      })*/
      // return false
    },
  }
}
</script>

<style scoped lang="scss">
::v-deep .choose-image{
  max-width: 1000px;
}

::v-deep .el-dialog__body{
  padding-top: 10px;
}

.image-list{
  display: flex;
  flex-wrap: wrap;
  .image-list-item{
    width: 10%;
    padding: 10px;
    position: relative;
    .item-image-box{
      width: 100%;
      padding-bottom: 100%;
      position: relative;
      .item-image{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .item-image-name{
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.35rem;
    }
    .check-box{
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 1;
      line-height: 20px;
      font-size: 20px;
      color: $--color-white;
      display: none;
      &.checked{
        display: block;
        color: $--color-primary;
      }
    }
    .del-image{
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 1;
      line-height: 20px;
      font-size: 20px;
      color: $--color-danger;
      cursor: pointer;
    }
    .checkbox-box{
      position: absolute;
      left: 12px;
      top: 8px;
      z-index: 1;
      line-height: 20px;
      font-size: 20px;
    }
  }
}
.dialog-footer{
  font-size: 0.35rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
