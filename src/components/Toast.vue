<template>
  <div class="toastBox fCol jEnd aEnd">
    <div class="toast fRow jStart aCenter"
    v-for="item in this.$store.state.toastData" v-bind:key="item.id"
    v-bind:style="{background: item.bg}" >
      <i class="material-icons-round ic">{{item.ic}}</i>
      <div class="msg">{{item.msg}}</div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    toastData() {
      console.log('toast data is => ', this.$store.state.toastData[0].bg);
      return this.$store.state.toastData;
    },
  },
};
</script>

<style lang='scss' scoped>
  .toastBox{
    z-index: 99999999999999990000;
    position: fixed;
    bottom: 0px;
    left: 32px;
    cursor: pointer;
  }

  .toastBox *{
    pointer-events: none;
  }

  .toast {
    border-radius: 8px;
    box-shadow: 0 4px 16px 0 rgba($color: #000000, $alpha: 0.2);
    padding: 20px;
    margin-bottom: 16px;
  }

  .toast .ic{
    color: white;
    margin-left: 16px;
    cursor: pointer;
  }

  .toast .msg{
    font-size: 14px;
    font-weight: 300;
    line-height: 1.2;
    color: white;
  }
</style>
