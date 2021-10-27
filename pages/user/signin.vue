<template>
  <div class="wrapper user-page">
    <div class="user-page-left">
      <user-left-nav></user-left-nav>
    </div>
    <div class="user-page-right">
      <div class="blog-page-left-tabs">
        <div class="blog-page-left-tabs-item tabs-on">
          <nuxt-link to="" class="item-a">
            每日签到
          </nuxt-link>
        </div>
        <div class="float-right p-t-24">
          <el-button size="mini" @click="$refs.signRankingModal.open()">排行榜</el-button>
          <el-button size="mini" >签到积分规则</el-button>
          <el-button size="mini" type="primary" :disabled="is_signin===1" @click="signin">
            {{is_signin===1?'已签到':'签到'}}
          </el-button>
        </div>
      </div>

      <el-card>
        <el-alert type="warning" :closable="false">
          <template v-if="is_signin">
            你当前已经连续签到 {{ signin_days }} 天，明天继续签到可获得 2 积分
          </template>
          <template v-else>
            签到可获得 1 积分
          </template>
        </el-alert>
        <el-calendar v-model="value"  class="calendar">
          <template #dateCell="{ data }">
            <template v-if="value">
              <div v-if="data.isSelected" class="calendar-month-bg">{{data.day.split('-')[1]}}</div>
            </template>
            <template v-else>
              <div class="today calendar-month-bg">{{data.day.split('-')[1]}}</div>
            </template>
            <!--data:{isSelected:true,type:'prev-month'/'current-month'/'next-month',day:'2021-09-30'}-->
            <div v-if="data.type==='current-month'">
              {{ data.day.split('-').slice(2).join('-') }}
              {{ signinList.includes(data.day) ? '✔️' : '' }}
              <span class="today">今</span>
              <!--{{getSigninInfo(data.day)}}-->
              <span v-if="getSigninInfo(data.day).id" >
                已签
                积分+{{ getSigninInfo(data.day).points }}
              </span>
            </div>
          </template>
        </el-calendar>
      </el-card>
    </div>
    <!--排行榜-->
    <sign-ranking-modal :table-data="tableData" ref="signRankingModal"/>
  </div>
</template>

<script>
import { urlUserAskSignin } from '~/api/user/ask'
import { urlWebAskSignin } from '@/api/ask'
import UserLeftNav from '~/components/ask/UserLeftNav'
import SignRankingModal from '~/components/ask/SignRankingModal'

export default {
  name: "signin",
  components: { SignRankingModal, UserLeftNav },
  layout:"ask",
  head: {
    titleTemplate: '我的签到 - 会员中心 - %s',
  },
  data(){
    return{
      value:'',
      is_login:0,
      is_signin:0,
      signin_days:0,
      tableData:[],
      signinList:['2021-09-27','2021-09-28','2021-09-29','2021-09-30']
    }
  },
  mounted() {
    this.getList()
    this.getSigninList()
  },
  watch:{
    value:{
      handler(newV){
        this.getSigninList()
      }
    }
  },
  methods:{
    getList(){
      this.$axios.get(urlWebAskSignin).then(res =>{
        this.is_login= res.data.is_login
        this.is_signin= res.data.is_signin
        this.signin_days= res.data.signin_days
        this.tableData = res.data.rank_list
      })
    },
    getSigninList(){
      this.$axios.get(urlUserAskSignin+'/index',{params:this.value}).then(res =>{
        this.signinList=res.data.list
      })
    },
    getSigninInfo(date){
      let signinInfo={}
      this.signinList.forEach(item=>{
        if(date===item.created_at_date){
          signinInfo = item
        }
      })
      return signinInfo
    },
    signin(){
      this.$axios.post(urlUserAskSignin+'/create').then(res=>{
        this.$message.success('签到成功')
        this.getList()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.user-page-right{
  .user-card {
    padding: 20px;
  }
}
.calendar{
  ::v-deep tbody{
    position: relative;
    z-index: 1;
  }
  .calendar-month-bg{
    display: flex;
    position: absolute;
    font-size: 500px;
    top: 0;
    left: 0;
    width: 100%;
    bottom: 0;
    z-index: -1;
    align-items: center;
    justify-content: center;
    color: #aaaaaa;
    opacity: 0.1;
    overflow: hidden;
  }
  .today{
    display: none;
  }
  .is-today{
    .today{
      display: flex;
    }
  }
  ::v-deep .el-calendar-table .el-calendar-day:hover{
    background-color: rgba($--color-primary,0.3);
  }
  ::v-deep .el-calendar-table td.is-selected{
    background-color: rgba($--color-primary,0.3);
  }
}
</style>

