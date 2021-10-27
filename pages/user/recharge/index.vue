<template>
  <div class="wrapper user-page">
    <div class="user-page-left">
      <user-left-nav></user-left-nav>
    </div>
    <div class="user-page-right">
      <div class="blog-page-left-tabs">
        <div class="blog-page-left-tabs-item">
          <nuxt-link to="" class="item-a">
            充值余额
          </nuxt-link>
          <span class="color-danger">当前余额123456</span>
        </div>
        <div class="float-right m-t-15">
          <el-button type="primary" size="mini" @click="$router.push('/user/recharge/log')">充值日志</el-button>
        </div>
      </div>
      <el-card>
        <el-alert :closable="false">
          <p class="p-b-5">余额可用于购买商品或用于商城消费</p>
        </el-alert>
        <el-form ref="form" :model="form" label-width="120px" class="m-t-15">
          <el-form-item label="充值金额">
            <el-input-number v-model="form.amount" :min="0" controls-position="right" />
          </el-form-item>
          <el-form-item label="支付方式">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">立即充值</el-button>
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
    titleTemplate: '余额充值- 会员中心 - %s',
  },
  data(){
    return{
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

