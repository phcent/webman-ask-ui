<template>
  <div  class="phcent-main">
    <div class="phcent-ask-header" style="background: #FFFFFF">
      <div class="wrapper flex">
        <div class="phcent-ask-header--logo">
          <nuxt-link to="/">
          <phcent-svg name="phcent-logo" size="4rem" />
          </nuxt-link>
        </div>
        <div class="phcent-ask-header--login phcent-show--1000" v-if="$route.name != 'auth-login'">
          我已经注册，现在就<nuxt-link to="/auth/login" class="p-l-5">登录</nuxt-link>
        </div>
      </div>
      <div class="phcent-show--web phcent-ask-header--tip">
        <i class="ri-information-line m-t-0"></i>
        为确保您账户的安全及正常使用，依《网络安全法》相关要求，会员账户需绑定手机。如您还未绑定，请尽快完成，感谢您的理解及支持！
      </div>
    </div>
    <div class="phcent-content">
      <nuxt />
    </div>
    <easy-footer />
  </div>
</template>

<script>
import EasyFooter from "~/components/layout/EasyFooter";
import PhcentSvg from "~/components/PhcentSvg";
export default {
  name: 'loginLayout',
  components: {PhcentSvg, EasyFooter}
}
</script>
<style scoped lang="scss">
.phcent-footer{
  background-color: transparent;
  text-align: center;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
.phcent-ask-header--login{
  font-size: 0.35rem;
  color: #AAA;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  height: 100%;
  padding-bottom: 0.5rem;
  flex: 1;
}
.phcent-ask-header--tip{
  text-align: center;
  font-size: 12px;
  color: #AAA;
  padding-top: 20px;
}
@media (max-width: 1000px) {
  .phcent-ask-header--logo {
    padding-right: 0;
    flex: 1;
    justify-content: center;
  }
}
</style>

