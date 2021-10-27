<template>
  <div class="page-top-box">
    <div class="page-top">
      <div class="page-top-left">
        <span class="page-top-header">
          {{title}}
        </span>
        <span v-if="showExplain" class="page-top-explain ">
          共{{total}}条数据
        </span>
        <span class="m-r-10">
        </span>
        <template v-if="btnList">

          <el-button v-if="btnList.includes('return')" size="mini" type="primary" icon="ri-arrow-go-back-fill"
                     @click="$router.go(-1)">
            返回列表</el-button>
        </template>
      </div>
      <div v-if="rightOptions" class="page-top-right">
        <el-tooltip
          v-if="rightOptions.includes('search')"
          class="item"
          effect="dark"
          content="数据筛选"
          placement="top"
        >
        <span class="tool-item" @click="$emit('changeSearch')">
          <i class="ri-search-line"></i>
        </span>
        </el-tooltip>
        <el-tooltip
          v-if="rightOptions.includes('refresh')"
          class="item"
          effect="dark"
          content="数据刷新"
          placement="top"
        >
        <span class="tool-item" @click="$emit('refresh')">
          <i class="ri-refresh-line"></i>
        </span>
        </el-tooltip>
        <el-tooltip
          v-if="rightOptions.includes('size')"
          class="item"
          effect="dark"
          content="密度"
          placement="top"
        >
          <el-dropdown trigger="click" @command="command">
          <span class="tool-item">
            <i class="ri-text-spacing"></i>
          </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="medium">默认</el-dropdown-item>
                <el-dropdown-item command="small">宽松</el-dropdown-item>
                <el-dropdown-item command="mini">紧凑</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>
        <el-popover v-if="rightOptions.includes('columns')" placement="bottom-end" :width="200" trigger="click" style="margin-top: 10px">
          <div class="set-table-top">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >列展示</el-checkbox
            >
            <el-button style="float: right" type="text" size="small">重置</el-button>
          </div>
          <div>
            <ul>
              <li v-for="(col, i) in columnList" :key="i" class="p-t-5 p-b-5">
                <el-checkbox v-model="col.show" :disabled="isDisabled===1&&col.show" @change="change">{{col.label}}</el-checkbox>
              </li>
            </ul>
          </div>
          <template #reference>
         <span class="tool-item">
            <i class="ri-settings-line"></i>
          </span>
          </template>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserPage',
  props:{
    title:{
      type:String,
      default:''
    },
    showExplain:{
      type:Boolean,
      default:true
    },
    batch:{
      type:Boolean,
      default:true
    },
    rightOptions:{
      type:[Array,Boolean],
      default() {
        return ['search','refresh','size','columns'];
      }
    },
    total:{
      type:Number,
      default: 0
    },
    columnList:{
      type:Object,
      default(){
        return {}
      }
    },
    btnList:{
      type:[Array,Boolean],
      default() {
        //item String/Object{name:'add',disabled:Boolean}
        return [];
      }
    }
  },
  emits:['changeSearch','refresh','command'],
  data(){
    return{
      visible:false,
      checkAll:true,
      isIndeterminate:false
    }
  },
  computed:{
    isDisabled(){
      let checkedLength=0
      for (let key in this.columnList){
        if(this.columnList[key].show === true){
          checkedLength+=1
        }
      }
      return checkedLength
    }
  },
  methods:{
    handleCheckAllChange(value){
      for (let key in this.columnList){
        this.columnList[key].show=value
      }
      let firstKey = Object.keys(this.columnList)[0]
      if(!value){
        this.columnList[firstKey].show=true
      }
    },
    command(e){
      this.$emit('command',e)
    },
    change(){
      let length = Object.keys(this.columnList).length
      this.checkAll = this.isDisabled === length;
    }
  }
}
</script>

<style scoped lang="scss">
.page-top-box{
  height: 70px;
}
.page-top{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: $--color-white;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  box-shadow: 0 0 5px rgba(0,0,0,0.05);
  &-left{
    display: flex;
    align-items: center;
    i{
      //vertical-align: text-top;
      margin-right: 3px;
    }
    .page-top-header{
      font-size: 0.55rem;
      font-weight: bolder;
    }
    .page-top-explain{
      margin-left: 10px;
      font-size: 0.3rem;
      font-weight: lighter;
      color: #999;
    }
  }
  &-right{
    vertical-align: text-top;
    align-items: center;
    .tool-item{
      display: inline-block;
      padding: 7px;
      cursor: pointer;
      font-size: 0.5rem;
    }
  }
}
.set-table-top{
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
}
</style>
