<template>
  <div>
    <div class="wrapper user-page">
      <div class="user-page-left">
        <user-left-nav></user-left-nav>
      </div>
      <div class="user-page-right">
        <div class="blog-page-left-tabs">
          <div class="blog-page-left-tabs-item tabs-on">
            <nuxt-link to="" class="item-a">
              个人中心
            </nuxt-link>
          </div>
          <div class="float-right m-t-20">
            <el-button size="mini" type="primary" icon="ri-pencil-fill" @click="$router.push('/user/profile')">
              个人资料
            </el-button>
          </div>
        </div>
        <el-card class="user-card">
          <div class="flex p-t-20">
            <div class="user-avatar">
              <nuxt-link to="/user/profile">
                <el-avatar :size="150" :src="user.avatar_url"></el-avatar>
              </nuxt-link>
            </div>
            <div class="m-l-40 user-info">
              <nuxt-link to="/user/profile">
                <span>{{ user.nick_name }}</span>
              </nuxt-link>
              <p class="m-t-5 color-info">这个人很懒</p>
              <div class="user-details">
                <el-row :gutter="10">
                  <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                    Level
                  </el-col>
                  <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                    1
                  </el-col>
                  <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                    积分
                  </el-col>
                  <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                    {{ user.points }}
                  </el-col>
                  <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                    连续签到
                  </el-col>
                  <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                    0天
                  </el-col>
                  <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                    注册时间
                  </el-col>
                  <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                    2021-09-27 08:12:12
                  </el-col>
                  <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                    登录时间
                  </el-col>
                  <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                    {{ user.login_time }}
                  </el-col>
                  <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                    最后登录
                  </el-col>
                  <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                    {{ user.last_login_time }}
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import UserLeftNav from '~/components/ask/UserLeftNav'
export default {
  name: "index",
  components: { UserLeftNav },
  layout:"ask",
  head: {
    titleTemplate: '会员中心 - %s',
  },
  computed:{
    user(){
      return this.$auth.user
    }
  }
}
</script>

<style scoped lang="scss">
.user-page-right{
  .user-card{
    padding: 20px 40px;
    .user-avatar{

    }
    .user-info{
      flex: 1;
      .user-details{
        width: 100%;
        margin-top: 10px;
        .el-col{
          margin: 5px 0;
        }
      }
    }
  }
}


</style>
