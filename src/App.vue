<template>
  <div id="app" class="appHolder">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/Forgot">Forgot</router-link> |
      <router-link to="/SetNewPassword">SetNewPassword</router-link> |
      <router-link to="/dashboard">Dashboard</router-link>
    </div>
    <router-view />
    <div class="loading primary transition-cubic fCol jCenter aCenter "
      v-bind:class="{hide: !loading}">
      <div class="p"></div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {

    };
  },
  computed: {
    loading() {
      return this.$store.state.superLoading;
    },
  },
  watch: {
    loading() {
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
@keyframes l {
  0% {
    transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
    -moz-transform: rotate(-360deg);
    -webkit-transform: rotate(-360deg);
    -ms-transform: rotate(-360deg);
    -o-transform: rotate(-360deg);
  }
}
.appHolder {
  position: relative;

  .loading{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 99999999999999999999;
  }

  .p{
    width: 24px;
    height: 24px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url('./assets/load.svg');
    animation: l linear 1s infinite;
  }

  .loading.hide{
    transform: translateY(-100%);
    -webkit-transform: translateY(-100%);
    -moz-transform: translateY(-100%);
    -o-transform: translateY(-100%);
    -ms-transform: translateY(-100%);
  }
}
</style>
