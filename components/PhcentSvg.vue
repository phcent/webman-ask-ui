<template>
  <div :style="{width: size}" class="phcent-svg">
    <img :src="require(`../assets/svg/${name}.svg`)" width="100%" height="100%" style="color: #1b1f44" />
  </div>
</template>

<script>
export default {
  name: 'PhcentSvg',
  props: {
    name: { type: String, default: "image" },
    size: { type: String ,default: "25px"}
  }
}
</script>
<style lang="scss" scoped>
.phcent-svg{
  display: flex;
  img{
    vertical-align: middle;
  }
}
</style>
