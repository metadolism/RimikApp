import v from 'vue';
import router from '@/router';
import store from '@/store';
import VueJWT from 'vuejs-jwt';
import axios from 'axios';

const CryptoJS = require('crypto-js');
// const axios = require('axios').default;

v.use(VueJWT);
export default class Employe {
  accToken;

  decAccToken;

  exp;

  refToken;

  decRefToken;

  ax;

  // constructor() {
  //   this.ax = axios;
  // }

  checkDate() {
    return (async () => {
      this.accToken = JSON.parse(localStorage.getItem('user')).accessToken;
      this.refToken = JSON.parse(localStorage.getItem('user')).refreshToken;
      let bytes = CryptoJS.AES.decrypt(this.accToken, store.state.fp);
      this.decAccToken = bytes.toString(CryptoJS.enc.Utf8);
      bytes = CryptoJS.AES.decrypt(this.refToken, store.state.fp);
      this.decRefToken = bytes.toString(CryptoJS.enc.Utf8);
      this.exp = Date.now() > (v.$jwt.decode(this.decAccToken).exp * 1000);
      if (this.exp) {
        // call refresh token
        console.log('♦ توکن منقضی شده ♦');
        store.commit('setLoadingOn');
        this.refresh();
      } else {
        // console.log('♦ توکن منقضی نشده، ادامه... ♦');
        setTimeout(() => {
          store.commit('setLoadingOff');
        }, 500);
      }
      return this.exp;
    })();
  }

  refresh() {
    (async () => {
      axios({
        method: 'post',
        headers: {
          Authorization: `bearer ${this.decAccToken}`,
        },
        url: `${store.state.baseUrl}/api/v${store.state.apiVersion}/Accounts/refresh`,
        data: {
          AccessToken: this.decAccToken,
          RefreshToken: this.decRefToken,
          IsApp: true,
        },
      }).then((response) => {
        if (response.data.isSuccess) {
          // console.log(response.data);
          const refreshedUser = {
            accessToken: CryptoJS.AES.encrypt(response.data.data.accessToken, store.state.fp)
              .toString(),
            refreshToken: CryptoJS.AES.encrypt(response.data.data.refreshToken, store.state.fp)
              .toString(),
          };
          const newuser = JSON.stringify(refreshedUser);
          localStorage.setItem('user', newuser);
          store.commit('setLoadingOff');
          router.go();
        } else {
          console.log('response is not success');
        }
      }, (error) => {
        switch (error.response.status) {
          case 401: {
            localStorage.removeItem('user');
            router.push('/login');
            break;
          }
          default:
            break;
        }
      });
    })();
  }

  authToken() {
    this.accToken = JSON.parse(localStorage.getItem('user')).accessToken;
    const bytes = CryptoJS.AES.decrypt(this.accToken, store.state.fp);
    this.decAccToken = bytes.toString(CryptoJS.enc.Utf8);
    return `bearer ${this.decAccToken}`;
  }
}
