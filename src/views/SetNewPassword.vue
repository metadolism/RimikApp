<template>
  <div class="login aStart aStart fRow">
    <div class="rightSide aCenter jCenter fCol">
      <div class="loginForm fCol jCenter aCenter">
        <linput
          len="6"
          inputType="text"
          place="کد 6 رقمی"
          icon="dialpad"
          complete="off"
          validation="numberCode"
          label="کد ارسال شده به شماره همراهتان را وارد کنید"
        />
        <div class="freeSpace8"></div>
        <linput
          len="6"
          inputType="password"
          place="رمز جدید"
          icon="vpn_key"
          noLimit="true"
          complete="off"
          label="رمز دلخواه جدید را وارد کنید"
        />
        <div class="freeSpace8"></div>
        <linput
          len="6"
          inputType="password"
          place="تکرار رمز جدید"
          icon="vpn_key"
          noLimit="true"
          complete="off"
          label="رمز جدید را دوباره وارد کنید"
        />
        <div class="freeSpace8"></div>
        <div class="freeSpace16"></div>
        <lbutton label="ثبت رمز جدید و ورود به سایت"
        @click.native="goTo('login')"
        icon="login" isDisable="false" />
        <div class="freeSpace16"></div>
        <a @click="goTo('login')">بازگشت و ورود به سایت</a>
      </div>
    </div>
    <div class="leftSide aCenter jCenter fCol">
      <img class="logo light" alt="Vue logo" src="../assets/lLight.svg" />
      <div class="small">پلتفرم آموزشی</div>
      <div class="name">لـُـطـفــی</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: #61187a;
}

.loginForm {
  width: 50%;
  max-width: 450px;
  min-width: 296px;
}

.loginForm a{
  text-decoration: none;
  color: white;
  padding: 8px;
  border-bottom: solid 2px white;
  font-size: 12px;
  cursor: pointer;
  transition: all ease-in-out 0.3s;
}

.loginForm a:hover{
  color: yellow;
}
.logo {
  width: 72px;
  margin-bottom: 8px;
}

.captchaHolder {
  width: 100%;
}

.captchaHolder img {
  border-radius: 48px;
  box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.1);
  margin-right: 8px;
}

.leftSide,
.rightSide {
  width: 50%;
  height: 100%;
}

.leftSide{
  background-position: center center;
  background-size: 200%;
  background-image: url("../assets/patt.svg");
}

.rightSide {
  background-color: #410057;
  min-width: 450px;
}

.leftSide .small {
  font-size: 12px;
  color: white;
}

.leftSide .name {
  font-size: 24px;
  font-weight: 600;
  color: white;
}

a.remember {
  color: white;
}

@media only screen and (max-width: 600px) {
  .leftSide {
    display: none;
  }

  .rightSide{
    width: 100% !important;
  }
}
</style>

<script>
import Linput from '@/components/Linput.vue';
import Lbutton from '@/components/Lbutton.vue';

export default {
  methods: {
    goTo(path) {
      console.log(path);
      this.$router.push(path);
    },
  },
  mounted() {},
  components: {
    Linput,
    Lbutton,
  },
};
</script>
