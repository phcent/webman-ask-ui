<template>
  <div class="tags-box">
    <el-tag
      v-for="tag in tagsList"
      :key="tag"
      :maxlength="8"
      class="m-r-10"
      closable
      :disable-transitions="true"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <el-autocomplete
      v-if="tagsList.length<max"
      size="small"
      class="inline-input"
      v-model="state2"
      :fetch-suggestions="querySearch"
      placeholder="请输入内容"
      :trigger-on-focus="false"
      @select="handleSelect"
      @input="input"
      @keydown.enter.native="enter"
    ></el-autocomplete>
  </div>
</template>

<script>
import {urlWebAskTags} from '~/api/ask'

export default {
  name: 'TagsBox',
  model:{
    prop:'value',
    event:'change'
  },
  props:{
    value:{
      type:Array,
      default(){
        return []
      }
    },
    max:{
      type:Number,
      default() {
        return 3;
      }
    }
  },
  emits:['change'],
  data(){
    return{
      tagsList:[],
      restaurants: [],
      state1: '',
      state2: ''
    }
  },
  watch:{
    value:{
      handler(val){
        this.tagsList = val
      },
      immediate:true
    }
  },
  mounted() {
  },
  methods:{
    input(value){
      this.state2=value.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/g,'')
        .replace(/[^\S]/g,'').slice(0,8)
    },
    enter(e){
      if(!this.tagsList.includes(this.state2)){
        this.tagsList.push(this.state2)
      }
      this.state2=''
      this.changeValue()
    },
    querySearch(queryString, cb) {
      this.$axios.get(urlWebAskTags,{params:{name_like:this.state2}}).then(res=>{
        this.restaurants=res.data.list.map(item=>{
          item.value=item.name
          return item
        })
        cb(this.restaurants);
      })
      // this.$nextTick()
      // const restaurants = this.restaurants
      // const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      // cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      // console.log(item);
      if(!this.tagsList.includes(this.state2)){
        this.tagsList.push(this.state2)
      }
      this.state2=''
      this.changeValue()
    },
    handleClose(tag){
      this.tagsList.splice(this.tagsList.indexOf(tag), 1)
      this.changeValue()
    },
    // 双向绑定
    changeValue(){
      this.$emit('change',this.tagsList)
      this.$forceUpdate()
    }

  }
}
</script>

<style scoped lang="scss">
.tags-box{

}
</style>
