<template>
  <el-radio-group v-model="color" size="small" class="color-select" @change="selectChange">
    <el-radio v-for="item in colorList" :key="item" :label="item" :class="[item]" border>文本</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  name: 'SelectColor',
  model:{
    prop:'value',
    event:'change'
  },
  props:{
    value:{
      type:String,
      default:'default'
    }
  },
  data(){
    return{
      color:'default',
      colorList:['default','red','green']
    }
  },
  watch:{
    value:{
      handler(newV){
        this.color=newV
      }
    }
  },
  methods:{
    selectChange(){
      this.$emit('change',this.color)
    }
  }
}
</script>

<style scoped lang="scss">
.color-select ::v-deep .el-radio__input{
  display: none;
}
.color-select ::v-deep .el-radio__label{
  padding-left: 5px;
}
.color-select{
  .el-radio{
    margin-right: 15px;
  }
  .default{
    background-color: rgba($--color-info,0.3);
    color: $--color-info;
  }
  .red{
    background-color: rgba($--color-danger,0.3);
    color: $--color-danger;
  }
  .green{
    background-color: rgba($--color-success,0.3);
    color: $--color-success;
  }
  ::v-deep .el-radio__input.is-checked + .el-radio__label {
    color: inherit;
  }
}
</style>
