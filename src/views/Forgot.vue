<template>
  <div class="login aStart aStart fRow">
    <div class="rightSide aCenter jCenter fCol">
      <div class="loginForm fCol jCenter aCenter">
        <linput
          len="11"
          inputType="tel"
          place="شماره همراه"
          icon="dialpad"
          validation="phone"
          label="شماره همراه خود را وارد کنید"
        />
        <div class="freeSpace8"></div>
        <div class="captchaHolder fRow jCenter aEnd">
          <linput
            len="200"
            inputType="text"
            place="کد امنیتی"
            noLimit="true"
            icon="vpn_key"
            validation="captcha"
            label="کد تصویر مقابل را وارد کنید"
          />
          <img src="../assets/cap.jpg" alt="" />
        </div>
        <div class="freeSpace16"></div>
        <lbutton @click.native="goTo('setnewpassword')"
        label="دریافت کد تغییر رمز عبور" icon="login" isDisable="false" />
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
