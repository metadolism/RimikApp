<template>
  <div class="dashboard background">
    <toast />
    <dashboard-page pcontent="1" page="GRADES">
      <card w='80%' minWidth='950px'>
        <!-- card header -->
        <div class='fRow fullWidth jStart aStart'>
          <div class='growFull fCol jStart aStart'>
            <h3 class='growFull text-right'>مدیریت پایه‌های تحصیلی</h3>
            <p class='note'>پایه‌های تحصیلی را اضافه، حذف، ویرایش و مشاهده کنید.</p>
          </div>
          <btn fabBtn='true' label='اضافه کردن' icon='add' @click.native="addGrade"/>
          <btn fabBtn='true' label='به روز رسانی' bc='#9a9a9a' style="margin-right: 8px !important;"
          icon='loop' @click.native="refreshAll"/>
        </div>
        <div class="filters fullWidth fRow jStart aStart wrap">
          <label id='all' class="rContainer fRow jStart aCenter" @click="getGrades(0)">
            <input type="radio" name="radio">
            <span class="checkmark"></span>
            <div class="label">همه رشته‌ها</div>
          </label>
          <label class="rContainer fRow jStart aCenter" @click="getGrades(1)">
            <input type="radio" name="radio">
            <span class="checkmark"></span>
            <div class="label">ریاضی فیزیک</div>
          </label>
          <label class="rContainer fRow jStart aCenter" @click="getGrades(2)">
            <input type="radio" name="radio">
            <span class="checkmark"></span>
            <div class="label">علوم تجربی</div>
          </label>
          <label class="rContainer fRow jStart aCenter" @click="getGrades(3)">
            <input type="radio" name="radio">
            <span class="checkmark"></span>
            <div class="label">علوم انسانی</div>
          </label>
          <label class="rContainer fRow jStart aCenter" @click="getGrades(4)">
            <input type="radio" name="radio">
            <span class="checkmark"></span>
            <div class="label">فنی حرفه‌ای</div>
          </label>
          <label class="rContainer fRow jStart aCenter" @click="getGrades(5)">
            <input type="radio" name="radio">
            <span class="checkmark"></span>
            <div class="label">هنر</div>
          </label>
          <label class="rContainer fRow jStart aCenter" @click="getGrades(6)">
            <input type="radio" name="radio">
            <span class="checkmark"></span>
            <div class="label">زبان</div>
          </label>
        </div>
        <div class='sepLine'></div>
        <!-- grid header -->
        <div class='gridHead gridRow fRow jBetween fullWidth'>
          <div class='tableHead title'>پایه و رشته‌ی تحصیلی</div>
          <div class='tableHead itemImg'>تصویر</div>
          <div class='tableHead state'>وضعیت</div>
          <div class='tableHead actions'>عملیات</div>
        </div>
        <empty-bar v-if="responseEmpty" w='100%' h='152px'
          msg='شما هنوز هیچ دسترسی ای ثبت نکرده اید' empt='true'/>
        <error-bar v-if="responseError" w='100%' h='152px'
          :msg='errorMsg' err='true'/>
        <progress-bar v-if="!isDataLoad" w='100%' h='160px'
          msg='لطفا صبر کنید' load='true'/>
        <div class="fullWidth fCol aCenter jStart" v-if="isDataLoad">
          <grade-row
            v-bind:key="item.id"
            v-for="item in gradesDatas.data"
            :gradesData='item' />
        </div>
      </card>
      <modal v-if="computedModalState" @changeMsg="refreshAll()">
        <card :w="`${computedCardWidth}`">
        <!-- add / edit permission -->
          <grade-manager v-if="computedWorkOn" @changeMsg="refreshAll()"
          :mode='computedMode'/>
        </card>
      </modal>
    </dashboard-page>
    <tool-bar/>
    <right-menu/>
  </div>
</template>

<script>
import RightMenu from '@/components/RightMenu.vue';
import ToolBar from '@/components/ToolBar.vue';
import DashboardPage from '@/components/DashboardPage.vue';
import Card from '@/components/Card.vue';
import Btn from '@/components/Btn.vue';
import errorHandler from '@/mixins/mixin';
import makeToast from '@/mixins/makeToast';
import fp from '@/mixins/fp';
import Toast from '@/components/Toast.vue';
import ProgressBar from '@/components/ProgressBar.vue';
import ErrorBar from '@/components/ErrorBar.vue';
import EmptyBar from '@/components/EmptyBar.vue';
import axios from 'axios';
import Modal from '@/components/Modal.vue';
// کامپوننت های مربوط به Grade
import GradeRow from '@/components/grades/GradeRow.vue';
import GradeManager from '@/components/grades/GradeManager.vue';

export default {
  mixins: [errorHandler, makeToast, fp],
  data() {
    return {
      isDataLoad: false,
      responseFalse: false,
      responseError: false,
      responseEmpty: false,
      selectedFieldToShow: 0,
      baseURL: this.$store.state.baseUrl,
      V: this.$store.state.apiVersion,
      gradesDatas: [],
      modalManager: this.$store.state.modalState,
    };
  },
  methods: {
    refreshAll() {
      document.getElementById('all').click();
    },
    addGrade() {
      this.$store.commit('setWorkOn', 'grades');
      this.$store.commit('setGradeAddMode');
      this.$store.commit('openGradeCard', '');
    },
    getGrades(f) {
      this.isDataLoad = false;
      this.responseFalse = false;
      this.responseEmpty = false;
      this.responseError = false;
      this.responseLoad = true;
      let reqUrl = `${this.baseURL}/api/v${this.V}/Grades`;
      if (f !== 0) {
        reqUrl = `${this.baseURL}/api/v${this.V}/Grades?field=${f}`;
      }
      axios({
        method: 'get',
        url: reqUrl,
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
      }).then((response) => {
        // JSON responses are automatically parsed.
        this.responseLoad = false;
        this.posts = response.data;
        if (this.posts.isSuccess) {
          // this.makeToast('info', 'اطلاعات پایه های تحصیلی با موفقیت دریافت شد', 2000);
          this.responseFalse = false;
          // اگه درست بود همه چی
          this.isDataLoad = true;
          this.gradesDatas = JSON.parse(JSON.stringify(this.posts));
          // console.log('all grades data', this.gradesDatas);
          // اگه لیست خالی بود
          if (this.posts.data.length === 0) {
            this.responseEmpty = true;
          } else {
            this.responseEmpty = false;
          }
        } else {
          this.responseFalse = true;
        }
      }, (error) => {
        this.responseError = true;
        this.isDataLoad = true;
        this.responseEmpty = false;
        this.responseFalse = false;
        this.responseLoad = false;
        this.makeToast('error', this.errorHandler(error), 3000);
        // console.log(error);
      });
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
      this.getGrades(0);
    },
  },
  mounted() {
    this.initUserData();
  },
  components: {
    ProgressBar,
    ErrorBar,
    EmptyBar,
    RightMenu,
    ToolBar,
    DashboardPage,
    Card,
    Btn,
    Toast,
    GradeRow,
    GradeManager,
    Modal,
  },
  computed: {
    computedModalState() {
      return this.$store.state.modalState;
    },
    computedCardWidth() {
      let ww = '0';
      switch (this.$store.state.gradeManagerMode) {
        case 'add': {
          ww = '880px';
          break;
        }
        case 'edit': {
          ww = '710px';
          break;
        }
        case 'delete': {
          ww = '426px';
          break;
        }
        default:
          break;
      }
      // console.log(this.$store.state.permissionManagerMode, ww);
      return ww;
    },
    computedWorkOn() {
      let cwo = false;
      switch (this.$store.state.workOn) {
        case 'grades': {
          cwo = true;
          break;
        }
        default:
          break;
      }
      return cwo;
    },
    computedMode() {
      return this.$store.state.gradeManagerMode;
    },
  },
};
</script>

<style lang="scss" scoped>
.filters {
  padding: 16px 0 0 0;
}

.filters label{
  width: 20%;
}
</style>
