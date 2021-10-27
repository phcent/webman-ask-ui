<template>
  <div>
    <ul class="nav-list">
      <li v-for="(item,index) in navList" :key="index"  class="nav-list-item" :class="{'nav-on':$route.path === navPath+item.path}">
        <nuxt-link :to="navPath+item.path">
          {{isOwn?'我':'TA'}}{{item.name}}
        </nuxt-link>
      </li>
    </ul>
    <div class="phcent-ask-sidebar-pancel">
      <div class="phcent-ask-sidebar-pancel-hd">
        <h3 class="phcent-ask-sidebar-pancel-title">会员统计</h3>
      </div>
      <div class="phcent-ask-sidebar-pancel-body">
        <div class="m-t-10 color-info fz-14">
          <p class="p-10">注册于 {{ userInfo.created_at }}</p>
          <p class="p-10">个人主页被 {{ userInfo.view_num }}人浏览</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExpertHomeNav',
  props:{
    userInfo:{
      type:Object,
      default(){
        return {}
      }
    }
  },
  data(){
    return{
      navPath:'/u/'+this.$route.params.id,
      navList:[
        {
          name:'的主页',
          path:''
        },
        {
          name:'的回答',
          path:'/answer'
        },
        {
          name:'的提问',
          path:'/question'
        },
        {
          name:'的文章',
          path:'/article'
        },
        {
          name:'的粉丝',
          path:'/fans'
        },
        {
          name:'的关注',
          path:'/follow'
        }
      ]
    }
  },
  computed:{
    isOwn(){
      if(this.$auth.user){
        if(this.$route.params.id == this.$auth.user.id){
          return true
        }
      }
      return false
    }
  },
}
</script>

<style scoped lang="scss">
.nav-list{
  margin-top: 30px;
  font-size: 0.35rem;
  &-item{
    padding: 15px 10px;
    border-radius: 5px;
    a{
      color: #555;
    }
    &:hover{
      background-color: rgba($--color-primary,0.1);
    }
    &.nav-on{
      border-color: $--color-primary3;
      color: #fff;
      background: linear-gradient(90deg, $--color-primary4 0%,$--color-primary3 100%);
      a{
        color: $--color-white;
      }
    }
  }
}
</style>
