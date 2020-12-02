<template>
  <div class="zadakHolder">
    <a v-if="this.row" href="https://zadak.ir" title="Developed by Zadak"
      class="fRow jCenter aCenter smallRow">
      <div class="zadaktypo" v-if="this.typo"
        v-bind:class="{d: this.dark}"></div>
      <div class="zadaklogo m4r" v-if="this.logo"
        v-bind:class="{d: this.dark}"></div>
    </a>
    <a v-if="!this.row" href="https://zadak.ir" title="Developed by Zadak"
      class="fCol jCenter aCenter smallRow">
      <div class="zadaklogo m4b" v-if="this.logo"
        v-bind:class="{d: this.dark}"></div>
      <div class="zadaktypo" v-if="this.typo"
        v-bind:class="{d: this.dark}"></div>
    </a>
  </div>
</template>

<script>
export default {
  props: ['dark', 'row', 'logo', 'typo'],
};
</script>

<style lang="scss" scoped>
.zadakHolder{
  margin: 16px;
  opacity: 0.5;
}

.zadakHolder a{
  cursor: pointer !important;
}

.zadakHolder a *{
  pointer-events: none;
}
.zadaklogo {
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url("../assets/zadaklogo.svg");
  width: 18px;
  height: 20px;
}
.zadaklogo.d{
  background-image: url("../assets/zadaklogodark.svg");
}
.zadaktypo {
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url("../assets/zadaktype.svg");
  width: 44px;
  height: 20px;
}
.zadaktypo.d{
  background-image: url("../assets/zadaktypodark.svg");
}
.m4l{
  margin-left: 4px;
}

.m4r{
  margin-right: 4px;
}

.m4t{
  margin-top: 4px;
}

.m4b{
  margin-bottom: 4px;
}

</style>
