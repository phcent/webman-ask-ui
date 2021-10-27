<template>
  <div class="user-thumbnail">
    <author-card :user-id="userInfo.to_user_id">
      <router-link :to="'/experts/'+userInfo.to_user_id" class="user-thumbnail-avatar">
        <el-avatar :size="80" :src="userInfo.avatar_url"/>
      </router-link>
    </author-card>
    <div>
      <router-link :to="'/experts/'+userInfo.to_user_id" class="user-thumbnail-name">
        {{userInfo.user_name}}
      </router-link>
    </div>
    <div class="color-info">
      这家伙很懒
    </div>
    <div class="m-t-10">
      <el-button type="primary" size="small" @click="followItem">
        <i class="ri-add-fill"></i>关注TA
      </el-button>
      <el-button type="primary" size="small" @click="$router.push({name:'question-publish',query:{user_id:userInfo.to_user_id}})">
        向TA提问
      </el-button>
    </div>
  </div>
</template>

<script>
import AuthorCard from '~/components/ask/AuthorCard'
import { urlWebAskFollow } from '~/api/ask'
export default {
  name: 'UserThumbnail',
  components: { AuthorCard },
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
      is_follow:0
    }
  },
  watch:{
    userInfo:{
      handler(val){
        this.is_follow=val.is_follow||0
      },
      immediate:true
    }
  },
  methods:{
    followItem(){
      let data={
        type:'user',
        theme_id:this.userInfo.to_user_id
      }
      if(this.is_follow===1){
        this.$axios.delete(urlWebAskFollow, { params:data }).then(res=>{
          this.$message.success('已取消关注')
          this.is_follow=0
        })
      }else{
        this.$axios.post(urlWebAskFollow,data).then(res=>{
          this.$message.success('成功关注')
          this.is_follow=1
        })
      }
    },
  }
}
</script>

<style scoped lang="scss">
.user-thumbnail{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &-avatar{
    width: 100%;
    padding: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &-name{
    color: #333;
    &:hover{
      color: $--color-primary;
    }
  }
}
</style>
