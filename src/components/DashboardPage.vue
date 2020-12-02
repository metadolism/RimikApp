<template>
  <div class="pageHolder fCol aCenter jStart">
    <slot v-if="pcontent !== '0'" class="fullWidth" ></slot>
    <div class="fCol jCenter aCenter fullWidth">
      <div class="simple"></div>
      <div class="allRights">کلیه حقوق متعلق به
        <a href="https://rimik.ir">ریمیک</a> می‌باشد. پاییز 1399</div>
      <zadak row='true' dark='true' typo='true'/>
    </div>
    <div v-if="pcontent === '0'" class="noContent fCol jCenter aCenter">
      <img alt="const" src="../assets/const.svg">
      <span>{{ page }} PAGE</span>
    </div>
  </div>
</template>

<script>
import Zadak from '@/components/Zadak.vue';

export default {
  name: 'dashboard-page',
  data() {
    return {};
  },
  components: {
    Zadak,
  },
  props: ['pcontent', 'page'],
  computed: {
    // inpLen() {
    //   const ml = this.message;
    //   return ml.length;
    // },
  },
  methods: {},
  directives: {},
};
</script>

<style lang="scss" scoped>
.dashboard .pageHolder {
  position: fixed;
  top: 56px;
  left: 0;
  right: 56px;
  bottom: 0;
  padding: 32px;
  background-color: #f0f0f0;
  overflow-x: hidden;
  overflow-y: auto;
  align-content: flex-start;
}

.pageHolder .noContent{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  user-select: none;
}

.noContent span{
  font-weight: 100;
  font-size: 32px;
  letter-spacing: 4px;
  color: rgba($color: #000000, $alpha: 0.2);
  margin-top: 24px;
}

.noContent img{
  width: 256px;
}

.allRights{
  color: #454545;
  font-size: 12px;
  font-weight: 100;
  width: 100%;
  padding: 0px 8px 16px 8px;
  user-select: none;
}

.allRights a{
  color: black;
  font-weight: 500;
}

.simple{
  width: 80px;
  height: 80px;
  background-image: url("../assets/rimikdark.svg");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.6;
}
</style>
