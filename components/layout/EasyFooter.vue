<template>
<div>
  <div class="phcent-ask-footer">
    <div class="wrapper">
      <div class="phcent-footer-copyright">
        <a hidefocus="true" href="" target="_blank">
          <span>沪公网安备 0000000000号</span>
        </a>
        <span>|</span>
        <span>Copyright © 2014-2022 上海象讯科技有限公司</span>
        <a hidefocus="true" href="https://beian.miit.gov.cn/" target="_blank">
          <span>{{ icp }}</span>
        </a>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import * as config from '~/config';
export default {
  name: "EasyFooter",
  data(){
    return {
      icp:config.ICP
    }
  }
}
</script>

<style lang="scss" scoped>
.phcent-ask-footer{
  padding: 0 1rem ;
  background-color: transparent;
  text-align: center;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  color: #7b7e93;
  font-size: 0.35rem;
  .wrapper{
    min-width: auto;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
}
@media screen and (max-height: 850px){
  .phcent-ask-footer {
    position: relative;
    margin-top: 1.25rem;
  }
}
</style>
