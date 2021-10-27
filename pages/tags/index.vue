<template>
  <div class="phcent-ask-box">
    <div class="wrapper">
      <h2 class="p-t-20 p-b-10">
        话题列表
      </h2>
      <div class="mb-3">
        话题是用于将相似的问题进行归类，正确的使用话题能更快的发现和解决你的问题
      </div>
      <div v-if="categoryList.length>0" class="phcent-ask-cate p-t-20 m-b-10">
        <nuxt-link :to="{query:getRouter('category',null)}" class="phcent-ask-cate--item" :class="{'phcent-ask-cate--active':!query.category}">全部</nuxt-link>
        <nuxt-link v-for="(category,index) in categoryList" :to="{query:getRouter('category',category.id)}" class="phcent-ask-cate--item"
                   :class="{'phcent-ask-cate--active':category.id===query.category}">
          <i :class="'ri-'+category.icon"></i>{{category.name}}
        </nuxt-link>
      </div>
      <div class="flex flex-auto" style="margin-left: -0.375rem; margin-right: -0.375rem">
        <div v-for="(tag,index) in tagsList" :key="index" class="flex-4">
          <div class="phcent-ask-tags-item">
            <nuxt-link :to="{name:'tags-id',params:{id:tag.id}}" class="phcent-ask-tags-item--title">{{ tag.name }}</nuxt-link>
            <div class="phcent-ask-tags-item--intro">
              {{ tag.description }}
            </div>
            <div class="tag-bt">
              <span class="tag-bt--btn">{{tag.follow_num}} 关注</span>
            </div>
          </div>
        </div>
      </div>
      <!--分页-->
      <div class="flex flex-col-center m-t-50 m-b-15">
        <el-pagination background
                       @current-change="handleCurrentChange"
                       :current-page = "query.page"
                       :page-size.sync = "query.limit"
                       layout="prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {urlUserAskTags} from '~/api/ask'

export default {
  name: 'index',
  layout: "ask",
  head: {
    titleTemplate: '话题  - %s',
  },
  async asyncData(ctx) {
    let query = ctx.query
    query.page= Number(query.page)||1
    query.limit= Number(query.limt)||20
    query.category = query.category||null
    let res = await ctx.$axios.get(urlUserAskTags+'/index',{params:query})
    return{
      tagsList: res.data.list,
      categoryList:res.data.categoryList,
      total:res.total,
      query:{
        page:Number(query.page)||1,
        limit:Number(query.limit)||20,
        category:query.category
      }
    }
  },
  data(){
    return{
      tagsList:[],
      categoryList:[{icon:'',name:'测试'}],
      total:0,
      query:{
        page:1,
        limit:20,
        category:''
      }
    }
  },
  watchQuery:['page','category','limit'],
  methods:{
    handleCurrentChange(val){
      this.$router.push({ query: { page:val } });
    },
    getRouter(name,val,page = true){
      let query = JSON.parse(JSON.stringify(this.$route.query))
      query[name]= val;
      if(page && query.page > 1){
        query['page']= 1;
      }
      return query;
    },
  }
}
</script>

<style lang="scss" scoped>
.tag-bt{
  position: relative;
  height: 0.5rem;
  &--btn{
    right: -0.25rem;
    position: absolute;
    color: #03a9f4;
    padding: 0 0.25rem;
    font-size: 0.35rem;
    background-color: rgb(3 169 244 / 10%);
    height: 0.875rem;
    line-height: 0.875rem;
    border-radius: 0.1rem;
    touch-action: manipulation;
    cursor: pointer;
  }
}
</style>
