<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="action"
      :headers="{ Authorization:$auth.strategy.token.get() }"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar"  alt=""/>
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import { urlUpload } from '~/api'

export default {
  name: 'UploadImg',
  data(){
    return{
      action:urlUpload,
      imageUrl:'',
    }
  },
  methods:{
    handleAvatarSuccess(){

    },
    beforeAvatarUpload(){

    }
  }
}
</script>

<style scoped lang="scss">
.avatar-uploader ::v-deep .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader ::v-deep .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
