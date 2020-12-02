<template>
  <div class='dashboard background'>
    <dashboard-page pcontent='1' page='ACCESS'>
      <toast />
      <!-- قسمت اکسس ها -->
      <card w='80%' minWidth='950px'>
        <!-- card header -->
        <div class='fRow fullWidth jStart aStart'>
          <div class='growFull fCol jStart aStart'>
            <h3 class='growFull text-right'>لیست دسترسی‌ها</h3>
            <p class='note'>دسترسی‌ها را اضافه، حذف، ویرایش و مشاهده کنید.</p>
          </div>
          <btn fabBtn='true' label='اضافه کردن' icon='add' @click.native="addAccess"/>
          <btn fabBtn='true' label='به روز رسانی' bc='#9a9a9a' style="margin-right: 8px !important;"
          icon='loop' @click.native="getAccessData"/>
        </div>
        <div class='sepLine'></div>
        <!-- grid header -->
        <div class='gridHead gridRow fRow jBetween fullWidth'>
          <div class='tableHead title'>عنوان و توضیحات</div>
          <div class='tableHead state'>وضعیت</div>
          <div class='tableHead actions'>عملیات</div>
        </div>
        <div v-if="isAccessDataLoad" class="fullWidth fCol aStart jStart">
          <access-row
            v-bind:key="item.id"
            v-for="item in accArray.data"
            :accessObject='item'
            :accessArray="item.permissionsId" />
        </div>
        <empty-bar v-if="aresponseEmpty" w='100%' h='256px'
          msg='شما هنوز هیچ دسترسی ای ثبت نکرده اید' empt='true'/>
        <error-bar v-if="aresponseError" w='100%' h='256px'
          :msg='errorMsg' err='true'/>
        <progress-bar v-if="!isAccessDataLoad" w='100%' h='256px'
          msg='لطفا صبر کنید' load='true'/>
      </card>
      <card w='80%' minWidth='950px'>
        <!-- card header -->
        <div class='fRow fullWidth jStart aStart'>
          <div class='growFull fCol jStart aStart'>
            <h3 class='growFull text-right'>لیست مجوزها</h3>
            <p class='note'>مجوز ها را اضافه، حذف، ویرایش و مشاهده کنید.</p>
          </div>
          <btn fabBtn='true' label='اضافه کردن' icon='add' @click.native="addPermission"/>
          <btn fabBtn='true' label='به‌روز رسانی' bc='#9a9a9a' icon='loop'
          @click.native="getData" style="margin-right: 8px !important;"/>
        </div>
        <div class='sepLine'></div>
        <!-- grid header -->
        <div class='gridHead gridRow fRow jBetween fullWidth'>
          <div class='tableHead title'>عنوان</div>
          <div class='tableHead icon'>آیکن</div>
          <div class='tableHead path'>آدرس محلی</div>
          <div class='tableHead path'>آدرس سرور</div>
          <div class='tableHead method'>متــُـد</div>
          <div class='tableHead state'>وضعیت</div>
          <div class='tableHead actions'>عملیات</div>
        </div>

        <empty-bar v-if="presponseEmpty" w='100%' h='256px'
          msg='شما هنوز هیچ مجوزی ثبت نکرده اید' empt='true'/>
        <error-bar v-if="presponseError" w='100%' h='256px'
          msg='خطایی رخ داده است. لطفا دوباره تلاش کنید' err='true'/>
        <progress-bar v-if="presponseLoad" w='100%' h='256px'
          msg='لطفا صبر کنید' load='true'/>

        <div class="fullWidth fCol jStart aStart" v-if="isDataLoad">
          <permision-row
          v-bind:key="item.id"
          v-for="item in perArray.data"
          :permissionObject='item'  />
        </div>
        <!-- sssssssss -->
        <!-- <div v-for="item in perArray.data" v-bind:key="item.id">
          {{ item.permission.title }}
        </div> -->
      </card>
      <modal v-if="computedModalState" @changeMsg="getData">
        <card :w="`${computedCardWidth}`">
        <!-- add / edit permission -->
          <permission-manager v-if="computedWorkOn" @changeMsg="getData"
          :mode='computedPermissionMode'/>
          <access-manager v-if="!computedWorkOn" @changeMsg="getAccessData"
          :mode='computedPermissionMode'/>
        </card>
      </modal>
    </dashboard-page>
    <tool-bar />
    <right-menu />
  </div>
</template>

<style lang='scss' scoped>

.permisionRow.opened{
    background-color: rgba($color: #000000, $alpha: 0.05);
    margin: 8px 0px;
    border-radius: 16px;
}

.expandList{
    transform-origin: top center;
    overflow: hidden;
    height: 0;
    background-color: rgba($color: #000000, $alpha: 0.05);
    transition: all cubic-bezier(0.5,0,0,1) 0.5s;
}

.permisionRow {
  transition: all cubic-bezier(0.5,0,0,1) 0.5s;
  border-radius: 0px;
  overflow: hidden;
}

</style>

<script>
import RightMenu from '@/components/RightMenu.vue';
import ToolBar from '@/components/ToolBar.vue';
import DashboardPage from '@/components/DashboardPage.vue';
import Card from '@/components/Card.vue';
import Btn from '@/components/Btn.vue';
import PermisionRow from '@/components/PermisionRow.vue';
import AccessRow from '@/components/AccessRow.vue';
import Modal from '@/components/Modal.vue';
import ProgressBar from '@/components/ProgressBar.vue';
import ErrorBar from '@/components/ErrorBar.vue';
import EmptyBar from '@/components/EmptyBar.vue';
import Toast from '@/components/Toast.vue';
// import LotfiInput from '@/components/LotfiInput.vue';
import PermissionManager from '@/components/PermissionManager.vue';
import AccessManager from '@/components/AccessManager.vue';
import axios from 'axios';
import errorHandler from '@/mixins/mixin';
import makeToast from '@/mixins/makeToast';
import vigener from '@/mixins/vigener';
import fp from '@/mixins/fp';

export default {
  mixins: [errorHandler, makeToast, vigener, fp],
  methods: {
    // Triggered when `childToParent` event is emitted by the child.
    callBackPerID(value) {
      this.fromChild = value;
      // console.log(this.fromChild[0], this.fromChild[1]);
      // console.log(this.collectedData);
    },
    addPermission() {
      this.$store.commit('setWorkOn', 'permission');
      this.$store.commit('openCard', this.perId);
      this.$store.commit('setAddMode');
    },
    addAccess() {
      this.$store.commit('setWorkOn', 'access');
      this.$store.commit('setAddMode');
      this.$store.commit('openAccessCard', '');
    },
    getData() {
      this.isDataLoad = false;
      this.presponseFalse = false;
      this.presponseEmpty = false;
      this.presponseError = false;
      this.presponseLoad = true;
      axios({
        method: 'get',
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
        url: `${this.baseURL}/api/v${this.V}/Permissions`,
      }).then((response) => {
        // JSON responses are automatically parsed.
        this.presponseLoad = false;
        this.posts = response.data;
        if (this.posts.isSuccess) {
          // this.makeToast('info', 'اطلاعات مجوزها با موفقیت دریافت شد', 2000);
          this.presponseFalse = false;
          // اگه درست بود همه چی
          this.isDataLoad = true;
          // console.log('all permissions data', this.posts.data);
          this.perArray = JSON.parse(JSON.stringify(this.posts));
          // اگه لیست خالی بود
          if (this.posts.data.length === 0) {
            this.presponseEmpty = true;
          } else {
            this.presponseEmpty = false;
          }
        } else {
          this.presponseFalse = true;
        }
      }, (error) => {
        this.presponseError = true;
        this.isDataLoad = true;
        this.presponseEmpty = false;
        this.presponseFalse = false;
        this.presponseLoad = false;
        this.makeToast('error', this.errorHandler(error), 3000);
        // console.log(error);
      });
    },
    getAccessData() {
      this.isAccessDataLoad = false;
      this.aresponseFalse = false;
      this.aresponseEmpty = false;
      this.aresponseError = false;
      // const user = JSON.parse(localStorage.getItem('user'));
      // const at = user.accessToken;
      // const rt = localStorage.getItem('refresh_token');
      // const [fp] = [this.$store.state.fp];
      // console.log('at: - > ', at);
      // console.log('rt: - > ', rt);
      // console.log('fp: - > ', this.$store.state.fp);
      // eslint-disable-next-line
      // console.log(this.CryptoJS.AES.decrypt(at, this.$store.state.fp).toString(this.CryptoJS.enc.Utf8));
      axios({
        method: 'get',
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
        url: `${this.baseURL}/api/v${this.V}/Accesses`,
      }).then((response) => {
        this.accessPosts = response.data;
        if (this.accessPosts.isSuccess) {
          this.aresponseFalse = false;
          this.isAccessDataLoad = true;
          // console.log('all accesses data', this.accessPosts);
          this.accArray = JSON.parse(JSON.stringify(this.accessPosts));
          // اگه لیست خالی بود
          // console.log(this.accessPosts.data);
          if (this.accessPosts.data.length === 0) {
            this.aresponseEmpty = true;
          } else {
            this.aresponseEmpty = false;
          }
        } else {
          this.aresponseFalse = true;
        }
      }, (error) => {
        this.errorMsg = this.errorHandler(error);
        this.aresponseError = true;
        this.isAccessDataLoad = true;
        this.aresponseEmpty = false;
        this.aresponseFalse = false;
        this.errorHandler(error);
        this.makeToast('error', this.errorHandler(error), 2000);
        // console.log(error);
      });
    },
    test() {
      alert('test');
    },
    initUserData() {
      // این اول صفحه اجرا میشه
      if (this.$store.state.fp === 'undefined') {
        this.fpGenerator().then(() => {
          this.$authObeject.checkDate().then((result) => {
            if (result) {
              // console.log('توکن منقضی شده، درخواست ریفرش توکن');
            } else {
              this.initPage();
            }
          });
        });
      } else {
        this.initPage();
      }
    },
    initPage() {
      // اینیت اولیه پیج
      this.getData();
      this.getAccessData();
    },
  },
  data() {
    return {
      perArray: [],
      accArray: [],
      accPersArray: [],
      p: {},
      ps: [],
      isDataLoad: false,
      isAccessDataLoad: false,
      key: 0,
      fromChild: '', // This value is set to the value emitted by the child
      collectedData: [],
      permissionMode: 'edit',
      cardWidth: 0,
      cardMaxWidth: 0,
      cardMinWidth: 0,
      errorMsg: '',
      presponseFalse: false,
      presponseError: false,
      presponseEmpty: false,
      presponseLoad: false,
      aresponseFalse: false,
      aresponseError: false,
      aresponseEmpty: false,
      modalManager: this.$store.state.modalState,
      baseURL: this.$store.state.baseUrl,
      V: this.$store.state.apiVersion,
    };
  },
  mounted() {
    this.initUserData();
  },
  components: {
    RightMenu,
    ToolBar,
    DashboardPage,
    Card,
    Btn,
    Modal,
    PermisionRow,
    AccessRow,
    PermissionManager,
    ProgressBar,
    EmptyBar,
    ErrorBar,
    Toast,
    AccessManager,
  },
  computed: {
    computedArray() {
      const per = this.perArray;
      return per;
    },
    computedModalState() {
      return this.$store.state.modalState;
    },
    computedPermissionMode() {
      return this.$store.state.permissionManagerMode;
    },
    computedAccessMode() {
      return this.$store.state.accessManagerMode;
    },
    computedWorkOn() {
      let cwo = false;
      switch (this.$store.state.workOn) {
        case 'access': {
          cwo = false;
          break;
        }
        case 'permission': {
          cwo = true;
          break;
        }
        default:
          break;
      }
      return cwo;
    },
    computedCardWidth() {
      let ww = '0';
      switch (this.$store.state.permissionManagerMode) {
        case 'add': {
          ww = '850px';
          break;
        }
        case 'edit': {
          ww = '750px';
          break;
        }
        case 'delete': {
          ww = '356px';
          break;
        }
        default:
          break;
      }
      // console.log(this.$store.state.permissionManagerMode, ww);
      return ww;
    },
  },
};
</script>
