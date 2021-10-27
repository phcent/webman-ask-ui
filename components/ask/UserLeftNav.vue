<template>
  <div class="nav-box">
    <ul v-for="(item,index) in navList" :key="index" class="nav-box-list">
      <li class="nav-box-list-head">
        {{item.name}}
      </li>
      <li v-for="(item2,index2) in item.list" :key="index2" class="nav-box-list-item" :class="{'nav-on':navPath+item2.path===$route.path}">
        <template v-if="item2.name === '退出'">
          <nuxt-link to="" class="nav-box-list-item-a" @click.native="$auth.logout().then(() => {
                      this.$message.success('退出成功');
                    })" >
            <i :class="[item2.icon]"></i>
            {{item2.name}}
          </nuxt-link>
        </template>
        <template v-else>
          <nuxt-link :to="navPath+item2.path" class="nav-box-list-item-a">
            <i :class="[item2.icon]"></i>
            {{item2.name}}
          </nuxt-link>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'UserLeftNav',
  data(){
    return{
      navPath:'/user',
      navList:[
        {
          name:'会员中心',
          list:[
            {
              name:'会员中心',
              icon:'ri-account-circle-fill',
              path:''
            },
            {
              name:'个人资料',
              icon:'ri-contacts-line',
              path:'/profile'
            },
            {
              name:'修改密码',
              icon:'ri-key-2-line',
              path:'/changepwd'
            },
            {
              name:'退出',
              icon:'ri-logout-box-r-line'
            }
          ]
        },
        {
          name:'内容管理',
          list:[
            {
              name:'我的收藏',
              icon:'ri-bookmark-line',
              path:'/collection'
            },
            {
              name:'我的通知',
              icon:'ri-notification-3-line',
              path:'/notice'
            },
            {
              name:'我的私信',
              icon:'ri-chat-private-line',
              path:'/message'
            },
            {
              name:'邀请我回答的',
              icon:'ri-questionnaire-line',
              path:'/invite'
            }
          ]
        },
        {
          name:'',
          list:[
            {
              name:'每日签到',
              icon:'ri-calendar-check-line',
              path:'/signin'
            }
          ]
        },
        {
          name:'积分中心',
          list:[
            {
              name:'积分日志',
              icon:'ri-calendar-check-line',
              path:'/points/log'
            }
          ]
        },
        {
          name:'充值中心',
          list:[
            {
              name:'充值余额',
              icon:'ri-money-cny-box-line',
              path:'/recharge'
            },
            {
              name:'余额日志',
              icon:'ri-list-check',
              path:'/recharge/log'
            }
          ]
        },
        {
          name:'提现中心',
          list:[
            {
              name:'余额提现',
              icon:'ri-money-cny-circle-line',
              path:'/cash'
            },
            {
              name:'提现日志',
              icon:'ri-list-check',
              path:'/cash/log'
            }
          ]
        },
      ]
    }
  }
}
</script>
<style scoped lang="scss">
.nav-box{
  font-size: 0.35rem;
  width: 100%;
  border-radius: 5px;
  //box-shadow: 0 0 10px rgba(0,0,0,0.1);
  padding: 20px 0;
  &-list{
    &-head{
      margin-left: 40px;
      padding: 10px 0;
      color: #999;
    }
    &-item{
      border-radius: 5px;
      &-a{
        display: inline-block;
        width: 100%;
        padding: 10px 0 10px 40px;
        color: #333;
        i{
          margin-top: -1%;
        }
      }
      &:hover{
        background-color: rgba($--color-primary,0.05);
      }
      &.nav-on{
        background-color: rgba($--color-primary,1);
        .nav-box-list-item-a{
          color: $--color-white;
        }
      }
    }
  }
}
</style>

