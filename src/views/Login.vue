<template>
  <div class="login aStart aStart fRow">
    <toast />
    <div class="rightSide aCenter jCenter fCol">
      <div class="loginForm fCol jCenter aCenter">
        <div class="inputWrapper fCol aStart jStart fullWidth" v-if="false">
          <inp len='11' min='11' inputType='number' place='مثلا 09305943207'
            :initData='this.phone.data' req='true' validation='phone'
            @vmodel='getFromInput($event, "mobile")'
            icon='phone_iphone' label='شماره همراه دبیر را وارد کنید' />
        </div>
        <div class="inputWrapper fCol aStart jStart fullWidth">
          <inp len='30' inputType='text' place='نام کاربری' from='login'
            :initData='this.username.data' req='true' validation='username'
            @vmodel='getFromInput($event, "username")'
            icon='account_circle' label='نام کاربری را وارد کنید' />
        </div>
        <div class="freeSpace8"></div>
        <div class="inputWrapper fCol aStart jStart fullWidth">
          <inp len='208' inputType='password' place='رمز عبور'
            :initData='this.password.data' req='true' validation='login-password'
            @vmodel='getFromInput($event, "password")'
            icon='vpn_key' label='رمز عبور را وارد کنید' />
        </div>
        <div class="freeSpace8"></div>
        <div class="inputWrapper fRow aStart jStart fullWidth">
          <inp len='4' inputType='text' place='کد امنیتی'
            :initData='this.captcha.data' req='true' validation='captcha'
            @vmodel='getFromInput($event, "captcha")'
            class="growFull"
            icon='security' label='کد تصویر را وارد کنید' />
          <div class="captchaHolder">
            <img :src="this.capSrc" @click="getChaptcha"
              style="color: #00000000; font-size: 1px;"
              title='برای عوض کردن کد روی تصویر کلیک کنید'>
          </div>
        </div>
        <div class="freeSpace16"></div>
        <label class="container fullWidth">
          <input type="checkbox" checked="checked" />
          <span class="checkmark"></span>
          <span class="checkText">من را به خاطر بسپار</span>
        </label>
        <lbutton
        label="ورود به حساب"
        icon="login"
        @click.native="login"
        isDisable="false" />
        <div class="freeSpace16"></div>
        <a @click="goTo('forgot')">رمز عبور خود را فراموش کرده اید؟</a>
      </div>
    </div>
    <div class="leftSide aCenter jCenter fCol">
      <div class="growFull fCol jCenter aCenter">
        <a href="https://rimik.ir">
          <img class="logo light" alt="Vue logo" src="../assets/rimiksite.svg" />
        </a>
      </div>
      <zadak logo='true' typo='true'/>
    </div>
  </div>
</template>

<script>
import Inp from '@/components/Inp.vue';
import Lbutton from '@/components/Lbutton.vue';
import axios from 'axios';
import errorHandler from '@/mixins/mixin';
import fp from '@/mixins/fp';
import ticks from '@/mixins/ticks';
import makeToast from '@/mixins/makeToast';
import vigener from '@/mixins/vigener';
import Toast from '@/components/Toast.vue';
import Zadak from '@/components/Zadak.vue';
// bcrypt
import bcrypt from 'bcryptjs';
// import debounce from 'lodash.debounce';

const METHODS = { BCRYPT: 'bcrypt' };

export default {
  mixins: [errorHandler, makeToast, vigener, ticks, fp],
  data() {
    return {
      baseURL: this.$store.state.baseUrl,
      V: this.$store.state.apiVersion,
      phone: { data: Number },
      // password: { data: '$2a$11$Lo4Lx9NZQVx1JOpy6LbXz.nQL1/3lYPrElQOW92zqHtsPyI4eYQA2' },
      capSrc: '',
      saltLength: 11,
      captcha: { data: '' },
      cload: false,
      fingerprint: '',
      username: { data: 'aliali' },
      password: { data: 'KY1252tt' },
      passwordMd5: '',
      pass: 'SB0701hk',
      calculating: false,
      selectedMethod: METHODS.BCRYPT,
      accessToken: '',
      refreshToken: '',
      // user auth
      loading: false,
      message: '',
    };
  },
  computed: {
  },
  watch: {
    pass() {
      this.generatePassword();
      // console.log(this.result);
    },
  },
  methods: {
    makeMD5() {
      return this.CryptoJS.MD5(this.password.data).toString();
    },
    goTo(path) {
      // console.log(path);
      this.$router.push(path);
    },
    getFromInput(event, inp) {
      switch (inp) {
        case 'mobile': {
          this.phone.data = event.data;
          console.log(this.phone.data, event.error, event.warn);
          break;
        }
        case 'username': {
          this.username.data = event.data;
          console.log(this.username.data, event.error, event.warn);
          break;
        }
        case 'password': {
          this.password.data = event.data;
          this.pass = this.password.data;
          this.passwordMd5 = this.makeMD5();
          // console.log(this.pass, event.error, event.warn);
          break;
        }
        case 'captcha': {
          this.captcha.data = event.data;
          console.log(this.captcha.data, event.error, event.warn);
          break;
        }
        default:
          break;
      }
    },
    getChaptcha() {
      this.capSrc = '';
      axios({
        method: 'get',
        url: `${this.baseURL}/api/v${this.V}/Accounts/captcha/${this.$store.state.fp}/112/44`,
      }).then((response) => {
        if (response.data.isSuccess) {
          this.capSrc = response.data.data;
          this.$store.commit('setLoadingOff');
          // console.log(response.data.data);
        } else {
          this.makeToast('error', 'کد امنیتی بارگزاری نشد، دوباره تلاش کنید', 4000);
        }
      }, (error) => {
        this.makeToast('error', this.errorHandler(error), 3000);
        // console.log(error);
      });
    },
    login() {
      // alert(this.fingerprint);
      axios({
        method: 'post',
        url: `${this.baseURL}/api/v${this.V}/Accounts/login`,
        headers: {},
        data: {
          Username: this.username.data,
          Password: this.passwordMd5,
          FingerPrint: this.$store.state.fp,
          AppVersion: '1',
          Captcha: this.captcha.data,
        },
      }).then(
        (response) => {
          // console.log(response);
          if (response.data.isSuccess) {
            this.accessToken = response.data.data.accessToken;
            this.refreshToken = response.data.data.refreshToken;
            // eslint-disable-next-line
            const encAccess = this.CryptoJS.AES.encrypt(this.accessToken, this.$store.state.fp).toString();
            // eslint-disable-next-line
            const encRefresh = this.CryptoJS.AES.encrypt(this.refreshToken, this.$store.state.fp).toString();
            const user = {
              accessToken: encAccess,
              refreshToken: encRefresh,
            };
            localStorage.setItem('user', JSON.stringify(user));
            this.goTo('/access');
          } else {
            this.getChaptcha();
            this.makeToast('warning', 'مشکلی پیش آمده است. دوباره تلاش کنید.', 4000);
          }
        },
        (error) => {
          this.getChaptcha();
          this.whileState = false;
          // console.log(error);
          this.makeToast('error', this.errorHandler(error), 2000);
        },
      );
    },
    generatePassword() {
    },
    setBcryptHash() {
      const self = this;
      self.calculating = true;
      bcrypt.genSalt(self.saltLength, (err, salt) => {
        if (!err) {
          bcrypt.hash(self.password, salt, (er, hash) => {
            if (!er) {
              self.result = `${hash}`;
              console.log('joone madaret', self.result);
              self.calculating = false;
            }
          });
        }
      });
    },
    initUserData() {
      // این اول صفحه اجرا میشه
      if (this.$store.state.fp === 'undefined') {
        this.fpGenerator().then(() => {
          this.initPage();
        });
      } else {
        this.initPage();
      }
    },
    initPage() {
      // اینیت اولیه پیج
      this.getChaptcha();
      this.password.data = 'SB0701hk';
      this.pass = this.password.data;
    },
  },
  mounted() {
    this.initUserData();
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/dashboard');
    }
  },
  components: {
    Inp,
    Lbutton,
    Toast,
    Zadak,
  },
};
</script>

<style lang="scss" scoped>

</style>
