<template>
  <div class="login">
    <div class="login-box">
      <div class="login-box--img phcent-show--1000"></div>
      <div class="login-box-wrapper">
        <login-box />
      </div>
    </div>
  </div>
</template>

<script>
import LoginBox from "~/components/layout/LoginBox";
export default {
  name: "login",
  components: {LoginBox},
  layout:"login",
  head: {
    titleTemplate: '登入 - %s',
  },
}
</script>
<style scoped lang="scss">
.login{
  padding: 0 1rem;
  &-box{
    width: 100%;
    max-width: 1000px;
    height: 15rem;
    background: rgba(255,255,255,1);
    box-shadow: 0 0 20px 0 rgb(12 1 4 / 5%);
    border-radius: 4px;
    margin: 5rem auto 0 auto;
    display: flex;
    &-wrapper{
      flex: 1;
      width: 100%;
      height: 15rem;
      float: right;
    }
    &--img{
      width: 422px;
      height: 100%;
      background-color: #3e4457;
    }
  }
}
</style>
