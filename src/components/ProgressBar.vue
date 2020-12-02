<template>
  <div class="pbar fCol aCenter jCenter" v-bind:style="{width: `${wi}`, height: `${he}`}">
    <span class="secondary"></span>
    <label>{{msge}}</label>
  </div>
</template>

<script>
export default {
  props: ['w', 'h', 'msg', 'err', 'load', 'empt'],
  data() {
    return {
      wi: this.w,
      he: this.h,
      msge: this.msg,
    };
  },
  created() {},
};
</script>

<style lang='scss' scoped>
.pbar span{
  width:  48px;
  height: 48px;
  background-image: url("../assets/load.svg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 32px;
  border-radius: 50%;
  animation: load ease-in-out 1s infinite;
}

.pbar label{
  margin-top: 16px;
  font-weight: 300;
  font-size: 14px;
}

.er {
  animation: error infinite alternate 1s linear;
}

.emp {
  animation: empty infinite alternate 1s linear;
}

@keyframes load{
  0%{
    box-shadow: 0 0 0 16px rgba($color: #000000, $alpha: 0.05);
    transform: rotate(0deg);
  }
  100%{
    box-shadow: 0 0 0 64px rgba($color: #000000, $alpha: 0.0);
    transform: rotate(-360deg);
  }
}
@keyframes error{
  0%{
    color: #ff2210;
  }
  100%{
    color: #85231a;
  }
}
@keyframes empty{
  0%{
    color: #858585;
  }
  100%{
    color: #a8a8a8;
  }
}

</style>
