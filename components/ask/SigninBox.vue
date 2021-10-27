<template>
  <div class="phcent-ask-sidebar-pancel">
    <div class="phcent-ask-sidebar-pancel-hd flex flex-col-between flex-row-center">
      <h3 class="phcent-ask-sidebar-pancel-title">每日签到</h3>
      <span class="fz-14 color-primary cursor-pointer" @click="$refs.signRankingModal.open()">排行榜</span>
    </div>
    <div class="phcent-ask-sidebar-pancel-body flex flex-col-center">
      <template v-if="is_login">
        <el-button v-if="is_signin" type="primary">今日已签到，已连续签到{{signin_days}}天</el-button>
        <el-button v-else type="primary" @click="signin">立即签到</el-button>
      </template>
      <template v-else>
        <el-button type="primary">请登录后签到</el-button>
        <el-button>注册</el-button>
      </template>
    </div>

    <!--排行榜-->
    <sign-ranking-modal :table-data="tableData" ref="signRankingModal"/>
  </div>
</template>

<script>
import SignRankingModal from '~/components/ask/SignRankingModal'
import { urlWebAskSignin } from '~/api/ask'
import { urlUserAskSignin } from '@/api/user/ask'
export default {
  name: 'SigninBox',
  components: { SignRankingModal },
  data(){
    return{
      is_login:0,
      is_signin:0,
      signin_days:0,
      tableData:[]
    }
  },
  mounted() {
    this.getList()
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
    signin(){
      this.$axios.post(urlUserAskSignin+'/create').then(res=>{
        this.$message.success('签到成功')
        this.getList()
      })
    }
  }
}
</script>

