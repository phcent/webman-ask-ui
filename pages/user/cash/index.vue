<template>
  <div class="wrapper user-page">
    <div class="user-page-left">
      <user-left-nav></user-left-nav>
    </div>
    <div class="user-page-right">
      <div class="blog-page-left-tabs">
        <div class="blog-page-left-tabs-item">
          <nuxt-link to="" class="item-a">
            余额提现
          </nuxt-link>
          <span class="color-danger">当前余额 {{cashCommission}}</span>
        </div>
        <div class="float-right m-t-15">
          <el-button type="primary" size="mini" @click="$router.push('/user/cash/log')">提现日志</el-button>
        </div>
      </div>
      <el-card>
        <el-alert :closable="false">
          <p class="p-b-5">你可以将余额提现至支付宝账户</p>
        </el-alert>
        <el-form ref="form" :model="form" label-width="120px" class="m-t-15">
          <el-form-item label="提现金额">
            <el-input-number v-model="form.amount" :min="0" controls-position="right" />
          </el-form-item>
          <el-form-item label="提现银行名称">
            <el-input v-model="form.bank_name"></el-input>
          </el-form-item>
          <el-form-item label="提现用户名字">
            <el-input v-model="form.bank_user"></el-input>
          </el-form-item>
          <el-form-item label="提现银行账户">
            <el-input v-model="form.bank_account"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">立即提现</el-button>
          </el-form-item>
        </el-form>
      </el-card>
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
    titleTemplate: '余额提现 - 会员中心 - %s',
  },
  data(){
    return{
      cashCommission:0,
      form:{}
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
</style>

