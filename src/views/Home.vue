<template>
  <div class="splash aCenter jCenter fCol">
    <img class="logo light growFull" alt="Vue logo" src="../assets/rimik.svg" />
    <div class="load"></div>
    <zadak />
  </div>
</template>

<script>
import Zadak from '@/components/Zadak.vue';

export default {
  name: 'Home',
  components: {
    Zadak,
  },
  mounted() {
    setTimeout(() => {
      this.$router.push('login');
    }, 2000);
  },
};
</script>

<style lang="scss" scoped>
.splash {
  background-color: #410057;
  width: 100%;
  height: 100vh;
  position: relative;
}

@keyframes load{
  0%{
    transform: rotate(0deg);
    box-shadow: 0 0 0px 0px rgba($color: #000000, $alpha: 0.6);
  }
  100%{
    transform: rotate(720deg);
    box-shadow: 0 0 0px 128px rgba($color: #000000, $alpha: 0.0);
  }
}
.load{
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  background-position: center;
  background-image: url('../assets/load.svg');
  background-size: 70%;
  background-repeat: no-repeat;
  animation: load linear infinite 4s;
  -moz-animation: load linear infinite 4s;
  -webkit-animation: load linear infinite 4s;
}

.logo{
  background-image: none !important;
}
</style>
