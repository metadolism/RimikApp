<template>
  <div class="dashboard background">
    <toast />
    <dashboard-page pcontent="1" page="LESSONS">
      <card  w='80%' minWidth='950px'>
        <!-- card header -->
        <div class='fRow fullWidth jStart aStart'>
          <div class='growFull fCol jStart aStart'>
            <h3 class='growFull text-right fullWidth'>مدیریت درس‌ها</h3>
            <p class='note'>درس‌ها را اضافه، حذف، ویرایش و مشاهده کنید.</p>
          </div>
          <btn fabBtn='true' label='اضافه کردن' icon='add' @click.native="addLessons"/>
          <btn fabBtn='true' label='به روز رسانی' bc='#9a9a9a' style="margin-right: 8px !important;"
          icon='loop' @click.native="refreshAll"/>
        </div>
        <!-- filter list  -->
        <div class="filterLessons fullWidth fRow jStart aStart">
          <div v-if="!this.plsWait"
          class="fullWidth fRow jStart aStart wrap" v-bind:class="{err: emptyError}">
            <p class='growFull fullWidth' style="margin: 16px 0; text-align: right;">
              رشته و پایه تحصیلی را انتخاب کنید و دروس مربوط به همان را ببینید.</p>
            <label class="rContainer checkBoxHolder dark fRow jStart aCenter">
              <input type="radio"
              name="parents"
              id='showAllLessons'
              class="parent"
              @click="refreshAll()"/>
              <span class="checkmark dark"></span>
              <span class="checkText fRow jCenter aCenter">
                <div>مشاهده همه</div>
              </span>
            </label>
            <div class="holder fRow wrap jBetween aCenter growFull">
              <div v-for="item in gradeArrayByField" v-bind:key="item.id"
              style="width: calc(33.3333% - 8px)" class="checkGroup">
                <label class="rContainer checkBoxHolder dark fullWidth fRow jStart aCenter">
                  <input type="radio" disabled
                  name="parents"
                  :id='item.parentId'
                  class="parent"
                  v-on:change="ch($event, 'parent')"/>
                  <span class="checkmark dark"></span>
                  <span class="checkText fRow jCenter aCenter">
                    <div>{{item.parent}}</div>
                    <i class="material-icons-round arrow">keyboard_arrow_down</i>
                  </span>
                </label>
                  <!-- zirmajmooee -->
                <div class="subs fullWidth fCol jStart" >
                  <label v-for="items in item.data" v-bind:key="items.index"
                  class="rContainer checkBoxHolder level2 dark fullWidth fRow jStart aCenter">
                    <input type="radio"
                    v-on:change="ch($event, 'child')"
                    class="childs"
                    :id="`${items.id}`"
                    :name="item.parentId"
                    :data-parent='item.parentId'
                    :data-title='items.title'
                    :class="item.parentId"/>
                    <span class="checkmark dark"></span>
                    <span class="checkText fRow jCenter aCenter">
                      <div>{{items.title}}</div>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
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
          <lesson-row
            v-bind:key="item.id"
            v-for="item in lessonsDatas.data"
            :lessonsData='item' />
        </div>
      </card>
      <modal v-if="computedModalState" @changeMsg="refreshAll()">
        <card :w="`${computedCardWidth}`">
        <!-- add / edit lesson -->
          <lesson-manager v-if="computedWorkOn" @changeMsg="refreshAll()"
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
// کامپوننت های مربوط به lesson
import LessonRow from '@/components/lessons/LessonRow.vue';
import LessonManager from '@/components/lessons/LessonManager.vue';

export default {
  mixins: [errorHandler, makeToast, fp],
  data() {
    return {
      isDataLoad: false,
      responseFalse: false,
      responseError: false,
      responseEmpty: false,
      selectedGradeToShow: 0,
      emptyError: false,
      gradeArrayByField: [],
      plsWait: false,
      baseURL: this.$store.state.baseUrl,
      V: this.$store.state.apiVersion,
      lessonsDatas: [],
      modalManager: this.$store.state.modalState,
    };
  },
  methods: {
    ch(event) {
      switch (event.target.className) {
        case 'childs': {
          this.selectedGradeToShow = event.target.id;
          const hameyeChildha = document.getElementsByClassName('childs');
          for (let i = 0; i < hameyeChildha.length; i += 1) {
            hameyeChildha[i].checked = false;
          }
          document.getElementById(event.target.id).checked = true;
          this.gradeId = event.target.id;
          // console.log(this.gradeId);
          document.getElementById(event.target.getAttribute('data-parent')).checked = true;
          // alert(this.selectedGradeToShow);
          this.getLessons(this.selectedGradeToShow);
          document.getElementById('showAllLessons').checked = false;
          break;
        }
        case 'parents': {
          document.getElementById(event.target.id).checked = false;
          // alert('parent');
          break;
        }
        default:
          break;
      }
    },
    refreshAll() {
      const allCh = document.getElementsByClassName('childs');
      for (let i = 0; i < allCh.length; i += 1) {
        allCh[i].checked = false;
      }
      this.getLessons(0);
    },
    addLessons() {
      // console.clear();
      // console.log('dokmeye add zade shod');
      this.$store.commit('setWorkOn', 'lessons');
      this.$store.commit('setLessonAddMode');
      this.$store.commit('openLessonCard', '');
    },
    getLessons(f) {
      // alert(f);
      this.isDataLoad = false;
      this.responseFalse = false;
      this.responseEmpty = false;
      this.responseError = false;
      this.responseLoad = true;
      let reqUrl = `${this.baseURL}/api/v${this.V}/Lessons`;
      if (f !== 0) {
        reqUrl = `${this.baseURL}/api/v${this.V}/Lessons?gradeId=${f}`;
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
          this.lessonsDatas = JSON.parse(JSON.stringify(this.posts));
          // console.log('all lessons data', this.lessonsDatas);
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
    getSortedGrades() {
      // گرفتن لیست گرید ها برای چک باکس
      this.plsWait = true;
      axios({
        method: 'get',
        url: `${this.baseURL}/api/v${this.V}/Grades`,
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
      }).then((response) => {
        // console.log('from lesson manager in edit mode →', response.data.data);
        if (response.data.isSuccess) {
          this.initCheckBoxs(response);
          // console.log('response az lesson manager edit',
          //   JSON.parse(JSON.stringify(this.gradeArrayByField)));
        }
      }, (error) => {
        // console.log(error);
        this.makeToast('error', this.errorHandler(error), 2000);
      });
    },
    initCheckBoxs(response) {
      const gParent = {};
      const gData = {};
      const riaziObject = {};
      const riazi = [];
      const tajrobiObject = {};
      const tajrobi = [];
      const ensaniObject = {};
      const ensani = [];
      const faniObject = {};
      const fani = [];
      const honarObject = {};
      const honar = [];
      const zabanObject = {};
      const zaban = [];
      // const ensani = [];
      // const fani = [];
      // const honar = [];
      // const zaban = [];
      for (let t = 0; t < response.data.data.length; t += 1) {
        gData.title = response.data.data[t].title;
        gData.id = response.data.data[t].id;
        gParent.title = '';
        switch (response.data.data[t].field) {
          case 1: {
            riazi.push(response.data.data[t]);
            break;
          }
          case 2: {
            tajrobi.push(response.data.data[t]);
            break;
          }
          case 3: {
            ensani.push(response.data.data[t]);
            break;
          }
          case 4: {
            fani.push(response.data.data[t]);
            break;
          }
          case 5: {
            honar.push(response.data.data[t]);
            break;
          }
          case 6: {
            zaban.push(response.data.data[t]);
            break;
          }
          default:
            break;
        }
      }
      riaziObject.data = riazi;
      riaziObject.parent = 'ریاضی و فیزیک';
      riaziObject.parentId = 1;
      this.gradeArrayByField.push(riaziObject);
      // -|/-\|- //
      tajrobiObject.data = tajrobi;
      tajrobiObject.parent = 'علوم تجربی';
      tajrobiObject.parentId = 2;
      this.gradeArrayByField.push(tajrobiObject);
      // -|/-\|- //
      ensaniObject.data = ensani;
      ensaniObject.parent = 'علوم انسانی';
      ensaniObject.parentId = 3;
      this.gradeArrayByField.push(ensaniObject);
      // -|/-\|- //
      faniObject.data = fani;
      faniObject.parent = 'فنی و حرفه‌ای';
      faniObject.parentId = 4;
      this.gradeArrayByField.push(faniObject);
      // -|/-\|- //
      honarObject.data = honar;
      honarObject.parent = 'هنر';
      honarObject.parentId = 5;
      this.gradeArrayByField.push(honarObject);
      // -|/-\|- //
      zabanObject.data = zaban;
      zabanObject.parent = 'زبان';
      zabanObject.parentId = 6;
      this.gradeArrayByField.push(zabanObject);
      this.plsWait = false;
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
      this.getLessons(0);
      this.getSortedGrades();
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
    LessonRow,
    LessonManager,
    Modal,
  },
  computed: {
    computedModalState() {
      return this.$store.state.modalState;
    },
    computedCardWidth() {
      let ww = '0';
      switch (this.$store.state.lessonManagerMode) {
        case 'add': {
          ww = '980px';
          break;
        }
        case 'edit': {
          ww = '980px';
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
        case 'lessons': {
          cwo = true;
          break;
        }
        default:
          break;
      }
      return cwo;
    },
    computedMode() {
      // console.log('mode lesson manager: → computed ', this.$store.state.lessonManagerMode);
      return this.$store.state.lessonManagerMode;
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
