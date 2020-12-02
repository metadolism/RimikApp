<template>
  <div class="dashboard background">
    <toast />
    <dashboard-page pcontent="1" page="TEACHERS">
      <!-- teacher manager  -->
      <card w='80%' minWidth='950px' v-if='this.teacherManage && !this.showEdit'>
        <!-- card header -->
        <div class='fRow fullWidth jStart aStart'>
          <div class='growFull fCol jStart aStart'>
            <h3 class='growFull text-right'>مدیریت دبیران</h3>
            <p class='note'>دبیران را اضافه، حذف، ویرایش و مشاهده کنید.</p>
          </div>
          <btn fabBtn='true' label='اضافه کردن' bc='#61187A'
            icon='add' @click.native="teacherAddToggle"/>
          <btn fabBtn='true' label='به روز رسانی' bc='#9a9a9a'
            style="margin-right: 8px !important;"
            icon='loop' @click.native="refreshAll"/>
        </div>
        <div class='sepLine'></div>
        <!-- filter list  -->
        <div class="filterLessons fullWidth fRow jStart aCenter">
          <div class="fullWidth fRow jStart aStart wrap" v-bind:class="{err: emptyError}">
            <p class='growFull'
            style="margin: 16px 0; text-align: right; width: calc(100%);">
              لیست دبیران را فیلتر کنید.</p>
            <div class="inputWrapper fCol aStart jStart ptitle" style="width: 170px;">
              <label class="rContainer checkBoxHolder dark fRow jStart aCenter fullWidth"
                id='showall' style="padding: 8px; margin-top: 16px">
                <input type="radio"
                name="parents"
                id='showAllLessons'
                class="parent fullWidth"
                    v-on:change="ch($event, 'all')"/>
                <div class="checkmark dark"></div>
                <div class="checkText fRow jCenter aCenter">
                  <div>مشاهده همه</div>
                </div>
              </label>
            </div>
            <div class="inputWrapper fCol aStart jStart ptitle growFull">
              <span>نام درس را جستجو و از لیست انتخاب کنید</span>
              <input @focus="openLessons" @input="filterLessonList" @blur="closeLessons"
              placeholder="مثلا: «ریاضی»" type="text" v-model="lessonTitle"/>
              <div class="dropDown fCol jStart aStart fullWidth" v-if="this.dropdown">
                <progress-bar v-if="!this.isLessonDataLoad" w='100%' h='100%'
                  msg='لطفا صبر کنید' load='true'/>
                <div class="fCol fullWidth jStart aStart" v-if="this.dropDownLoad">
                  <label v-bind:key="item.id" v-for="item in this.lessons"
                  class="rContainer checkBoxHolder lll dark fullWidth fRow jStart aCenter"
                  style="overflow: unset;">
                    <input type="radio"
                    name="lesson"
                    class="lesson"
                    :id='item.id'
                    :data-title='`${item.title} ${item.gradeName} ${sayFieldName(item.field)}`'
                    v-on:change="ch($event, 'filter')"/>
                    <div class="checkmark dark fRow jCenter aCenter"></div>
                    <div class="checkText fCol jStart aCenter">
                      <div>{{item.title}} {{item.gradeName}} ({{sayFieldName(item.field)}})</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class='sepLine'></div>
        <!-- grid header -->
        <div class='gridHead gridRow fRow jBetween fullWidth'>
          <div class='tableHead index'>ردیف</div>
          <div class='tableHead itemImg'>تصویر</div>
          <div class='tableHead title big' style="text-align: right;">مشخصات</div>
          <div class='tableHead state'>وضعیت</div>
          <div class='tableHead state'>قطع دسترسی</div>
          <div class='tableHead actions big'>عملیات</div>
        </div>
        <empty-bar v-if="responseEmpty" w='100%' h='152px'
          msg='شما هنوز هیچ دبیری ثبت نکرده اید'/>
        <error-bar v-if="responseError" w='100%' h='152px'
          :msg='errorMsg'/>
        <progress-bar v-if="!isDataLoad" w='100%' h='160px'
          msg='لطفا صبر کنید'/>
        <div class="fullWidth fCol aCenter jStart" v-if="isDataLoad">
          <teacher-row
            v-bind:key="item.id"
            v-for="(item, index) in TeacherDatas"
            :index='((activePage - 1) * pageSize) + index + 1'
            :page='activePage'
            :pages='howManyPages'
            :teacher='item' />
        </div>
        <pagination v-if="isDataLoad" :active='activePage' :psize='pageSize'
        @resetPageSize="resetPageSize($event)"
        :pages='howManyPages' @goToPage="GoToPages($event)" />
      </card>
      <!-- ▬▬▬▬↓↓↓ teacher add ↓↓↓▬▬▬▬ -->
      <card w='80%' minWidth='950px' v-if='this.teacherAdd'>
        <!-- hameye content bad az load shodan inja show mishan ↓ -->
        <div class="fCol jStart aStart" v-if="showAddNow">
          <!-- card header -->
          <div class='fRow fullWidth jStart aStart'>
            <div class='growFull fCol jStart aStart'>
              <h3 class='growFull text-right'>اضافه کردن دبیر جدید</h3>
              <p class='note'>
                برای اضافه کردن دبیر جدید فرم زیر را پر کنید. تمام فیلدها اجباری می‌باشند.
              </p>
            </div>
            <btn fabBtn='false' label='بازگشت' bc='#9a9a9a'
              icon='keyboard_arrow_left' @click.native="teacherAddToggle"/>
          </div>
          <div class='sepLine'></div>
          <!-- Add teacher form  -->
          <div class="fullWidth fRow wrap jBetween aStart formHolder">
            <div class="inputWrapper fCol aStart jStart w33">
              <inp len='50' inputType='text' place='مثلا علیرضا'
                :initData='this.tName.data' req='true' validation='name'
                @vmodel='getFromInput($event, "name")'
                icon='account_circle' label='نام دبیر را وارد کنید' />
            </div>
            <div class="inputWrapper fCol aStart jStart w33">
              <inp len='50' inputType='text' place='مثلا احمدیان'
                :initData='this.tLastname.data' req='true' validation='lname'
                @vmodel='getFromInput($event, "lname")'
                icon='account_circle' label='نام خانوادگی دبیر را وارد کنید' />
            </div>
            <div class="inputWrapper fCol aStart jStart w33">
              <inp len='11' min='11' inputType='number' place='مثلا 09305943207'
                :initData='this.tMobile.data' req='true' validation='phone'
                @vmodel='getFromInput($event, "mobile")'
                icon='phone_iphone' label='شماره همراه دبیر را وارد کنید' />
            </div>
            <div class="inputWrapper fCol aStart jStart w33">
              <inp len='30' min='6' inputType='text' place='مثلا alirezaRahimi'
                :initData='this.tUsername.data' req='true' validation='username'
                @vmodel='getFromInput($event, "username")' from='add'
                icon='verified' label='نام کاربری لاتین وارد کنید' />
            </div>
            <div class="inputWrapper fCol aStart jStart w33">
              <inp len='8' inputType='text' place='مثلا AB1234cd'
                :initData='this.tPassword.data' validation='password'
                @vmodel='getFromInput($event, "password")'
                icon='vpn_key' label='رمزعبور به‌صورت خودکار تولید می‌شود' />
            </div>
            <div class="inputWrapper fCol aStart jStart w33">
              <div class="top-row fRow jStart aCenter">
                <p>وضعیت دبیر را فعال/غیرفعال کنید</p>
              </div>
              <div class="fRow jStart aCenter fullWidth" @click="changeTeacherStatus">
                <p class="growFull rtlText" style="padding-right: 12px;">وضعیت دبیر</p>
                <switch-button
                  id="teacherStatus"
                  :val="this.teacherStatus"
                  activeLabel="فعال"
                  deactiveLabel="غیرفعال"
                />
              </div>
            </div>
            <div class="inputWrapper fCol aStart jStart w50">
              <inp noLimit='true' inputType='text' place='انتخاب از لیست'
                :list='this.filteredAccesses' compType='radio' req='true'
                @vmodel='getFromInput($event, "access")' complete="false"
                icon='admin_panel_settings' label='انتخاب دسترسی دبیر' />
            </div>
            <div class="inputWrapper fCol aStart jStart w50">
              <inp noLimit='true' inputType='text' place='انتخاب از لیست'
                :list='this.filteredLessons' compType='checkbox' req='true'
                @vmodel='getFromInput($event, "lessons")'
                icon='menu_book' label='انتخاب درس‌ها' />
            </div>
            <div class="inputWrapper fCol aStart jStart w50">
              <inp len='120' inputType='text' place='خلاصه' compType='textarea'
                :initData='this.tSummary.data'
                lines=2 @vmodel='getFromInput($event, "summary")'
                icon='short_text' label='توضیحات کوتاه' />
              <inp len='120' inputType='text'
                place='متن توضیحات کامل را وارد کنید' compType='textarea'
                :initData='this.tDescription.data'
                lines=4 @vmodel='getFromInput($event, "desc")'
                icon='subject' label='توضیحات کامل' />
            </div>
            <div class="inputWrapper fCol aStart jStart w50">
              <div class="top-row fRow jStart aCenter">
                <p>تصویر دبیر را آپلود کنید</p>
              </div>
              <get-photo
                w='100%'
                style="margin-top: -8px"
                v-on:photoupload="getUploaded"
                photoFor='teacher'
                :initImg='this.computedInitImage'
                uploadMsg='آپلود تصویر الزامیست'
                uploadLabel='تصویر دبیر'/>
            </div>
            <btn label="ایجاد دبیر جدید" btnWidth='70%'
              class="flexGrow"
              icon="add" @click.native="createNewTeacher"/>
          </div>
        </div>
        <!-- <empty-bar v-if="responseEmpty" w='100%' h='152px'
          msg='شما هنوز هیچ دسترسی ای ثبت نکرده اید'/>
        <error-bar v-if="responseError" w='100%' h='152px'
          :msg='errorMsg'/> -->
        <progress-bar v-if="!showAddNow" w='100%' h='160px'
          msg='لطفا صبر کنید'/>
      </card>
      <!-- ▬▬▬▬↑↑↑ teacher add ↑↑↑ ▬▬▬▬ -->
      <!--                                              -->
      <!-- ▌▌▌▌▌▌▌↓↓↓ teacher edit ↓↓↓▌▌▌▌▌▌▌ -->
      <card w='80%' minWidth='950px' v-if='this.showEdit'>
        <!-- hameye content bad az load shodan inja show mishan ↓ -->
        <div class="fCol jStart aStart" v-if="this.teacherEdit">
          <!-- card header -->
          <div class='fRow fullWidth jStart aStart'>
            <div class='growFull fCol jStart aStart'>
              <h3 class='growFull text-right'>ویرایش مشخصات دبیر</h3>
              <p class='note'>
                برای ویرایش دبیر فرم زیر را پر کنید. تمام فیلدها اجباری می‌باشند.
              </p>
            </div>
            <btn fabBtn='false' label='بازگشت' bc='#9a9a9a'
              icon='keyboard_arrow_left' @click.native="backToList"/>
          </div>
          <div class='sepLine'></div>
          <!-- Add teacher form  -->
          <div class="fullWidth fRow wrap jBetween aStart formHolder">
            <div class="inputWrapper fCol aStart jStart w33">
              <inp len='50' inputType='text' place='مثلا علیرضا'
                :initData='this.tName.data' req='true' validation='name'
                @vmodel='getFromInput($event, "name")'
                icon='account_circle' label='نام دبیر را وارد کنید' />
            </div>
            <div class="inputWrapper fCol aStart jStart w33">
              <inp len='50' inputType='text' place='مثلا احمدیان'
                :initData='this.tLastname.data' req='true' validation='lname'
                @vmodel='getFromInput($event, "lname")'
                icon='account_circle' label='نام خانوادگی دبیر را وارد کنید' />
            </div>
            <div class="inputWrapper fCol aStart jStart w33">
              <inp len='11' min='11' inputType='number' place='مثلا 09305943207'
                :initData='this.tMobile.data' req='true' validation='phone'
                @vmodel='getFromInput($event, "mobile")'
                icon='phone_iphone' label='شماره همراه دبیر را وارد کنید' />
            </div>
            <div class="inputWrapper fCol aStart jStart w50">
              <inp noLimit='true' inputType='text' place='انتخاب از لیست'
                :list='this.filteredAccesses' compType='radio' req='true'
                :initData='this.tAccess' from='edit'
                @vmodel='getFromInput($event, "access")'
                icon='admin_panel_settings' label='انتخاب دسترسی دبیر' />
            </div>
            <div class="inputWrapper fCol aStart jStart w50">
              <inp noLimit='true' inputType='text' place='انتخاب از لیست'
                :list='this.filteredLessons' compType='checkbox' req='true'
                :initData='this.tLessons' from='edit'
                @vmodel='getFromInput($event, "lessons")'
                icon='menu_book' label='انتخاب درس‌ها' />
            </div>
            <div class="inputWrapper fCol aStart jStart w50">
              <inp len='120' inputType='text' place='خلاصه' compType='textarea'
                :initData='this.tSummary.data'
                lines=2 @vmodel='getFromInput($event, "summary")'
                icon='short_text' label='توضیحات کوتاه' />
              <inp len='120' inputType='text'
                place='متن توضیحات کامل را وارد کنید' compType='textarea'
                :initData='this.tDescription.data'
                lines=4 @vmodel='getFromInput($event, "desc")'
                icon='subject' label='توضیحات کامل' />
            </div>
            <div class="inputWrapper fCol aStart jStart w50">
              <div class="top-row fRow jStart aCenter">
                <p>تصویر دبیر را آپلود کنید</p>
              </div>
              <get-photo
                w='100%'
                style="margin-top: -8px"
                v-on:photoupload="getUploaded"
                photoFor='teacher'
                :initImg='this.tAvatar'
                uploadMsg='آپلود تصویر الزامیست'
                uploadLabel='تصویر دبیر'/>
            </div>
            <btn label="آپدیت مشخصات دبیر" btnWidth='70%'
              class="flexGrow"
              icon="save" @click.native="editTeacher"/>
          </div>
        </div>
        <!-- <empty-bar v-if="responseEmpty" w='100%' h='152px'
          msg='شما هنوز هیچ دسترسی ای ثبت نکرده اید'/>
        <error-bar v-if="responseError" w='100%' h='152px'
          :msg='errorMsg'/> -->
        <progress-bar v-if="!this.teacherEdit" w='100%' h='160px'
          msg='لطفا صبر کنید'/>
      </card>
      <!-- ▌▌▌▌▌▌▌↑↑↑ teacher edit ↑↑↑ ▌▌▌▌▌▌▌ -->
      <modal v-if="computedModalState" @changeMsg="refreshAll()">
        <card :w="`${computedCardWidth}`">
        <!-- add / edit lesson -->
          <teacher-manager v-if="computedWorkOn" @changeMsg="refreshAll()"
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
import Inp from '@/components/Inp.vue';
import errorHandler from '@/mixins/mixin';
import makeToast from '@/mixins/makeToast';
import Toast from '@/components/Toast.vue';
import ticks from '@/mixins/ticks';
import fp from '@/mixins/fp';
import SwitchButton from '@/components/SwitchButton.vue';
import ProgressBar from '@/components/ProgressBar.vue';
import ErrorBar from '@/components/ErrorBar.vue';
import EmptyBar from '@/components/EmptyBar.vue';
import Pagination from '@/components/Pagination.vue';
import axios from 'axios';
import Modal from '@/components/Modal.vue';
import GetPhoto from '@/components/GetPhoto.vue';
// کامپوننت های مربوط به teacher
import TeacherRow from '@/components/teacher/TeacherRow.vue';
import TeacherManager from '@/components/teacher/TeacherManager.vue';

export default {
  mixins: [errorHandler, makeToast, ticks, fp],
  data() {
    return {
      // true = manage mode, false = add mode ↓
      teacherManage: true,
      teacherAdd: false,
      teacherEdit: false,
      TeacherDatas: [],
      teacherStatus: true,
      lessonTitle: '',
      dropDownLessons: [],
      lessonsDatas: [],
      lessons: [],
      lastLesson: '',
      dropDownLoad: false,
      dropdown: false,
      isLessonDataLoad: false,
      howManyPages: 0,
      pageSize: 10,
      activePage: 1,
      // data for add teacher ↓
      letShowAddPage: false,
      lessonsLoaded: false,
      allLessons: [],
      filteredLessons: [],
      accessesLoaded: false,
      allAccesses: [],
      filteredAccesses: [],
      filter: 0,
      testList: [
        {
          value: '465221351',
          label: 'آیتم اول',
        },
        {
          value: '846135483',
          label: 'آیتم دوم',
        },
        {
          value: '135546846',
          label: 'آیتم سوم',
        },
      ],
      // v models ↓
      tName: { data: '' },
      tLastname: { data: '' },
      tUsername: { data: '' },
      tPassword: { data: '' },
      tAccess: { data: '' },
      tLessons: [],
      tMobile: { data: '' },
      tStatus: 1,
      tAvatar: '',
      tSummary: { data: '' },
      tDescription: { data: '' },
      tLock: false,
      // new ↑
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
      modalManager: this.$store.state.modalState,
    };
  },
  methods: {
    backToList() {
      this.clearForm();
      this.teacherEdit = false;
      this.$store.commit('setTeacherEditFalse');
    },
    getEditInitData() {
      if (this.$store.state.teacherEdit) {
        this.teacherManage = false;
        // alert(this.$store.state.focusedTeacherId);
        // eslint-disable-next-line
        const reqUrl = `${this.baseURL}/api/v${this.V}/Teachers/${this.$store.state.focusedTeacherId}`;
        axios({
          method: 'get',
          url: reqUrl,
          headers: {
            Authorization: this.$authObeject.authToken(),
          },
        }).then((response) => {
          // JSON responses are automatically parsed.
          this.posts = response.data;
          if (this.posts.isSuccess) {
            const resp = response.data.data;
            this.tName.data = resp.user.firstName;
            this.tLastname.data = resp.user.lastName;
            this.tMobile.data = resp.user.mobile.replace('98', '0');
            this.tUsername.data = resp.user.lastName;
            this.tDescription.data = resp.teacher.description;
            this.tSummary.data = resp.teacher.summary;
            this.tAvatar = resp.user.avatar;
            this.tAccess.data = resp.user.accessId;
            this.tLessons = resp.teacher.lessonIds;
            this.teacherEdit = true;
          }
          return this.$store.state.teacherEdit;
        }, (error) => {
          this.makeToast('error', this.errorHandler(error), 3000);
          this.teacherEdit = false;
          // console.log(error);
        });
      }
      this.teacherManage = true;
      return false;
    },
    GoToPages(event) {
      // بر اساس درس میگیریم لیست معلما رو
      // اگه درس نداشته باشیم ورودی تابع میشه 0 که همه رو بر میگردونه
      // اگه درس یا فیلتر داشته باشیم ورودی تابع میشه آی دی درس
      let getTeacherFilter = 0;
      if (this.filter !== 0) {
        getTeacherFilter = this.filter;
      }
      if (event === 'next') {
        // alert('next');
        this.activePage += 1;
        if (this.activePage > this.howManyPages) {
          this.activePage = 1;
        }
        this.getTeachers(getTeacherFilter, this.activePage);
        return;
      }
      if (event === 'prev') {
        this.activePage -= 1;
        if (this.activePage < 1) {
          this.activePage = this.howManyPages;
        }
        this.getTeachers(getTeacherFilter, this.activePage);
        return;
      }
      this.getTeachers(getTeacherFilter, event);
      this.activePage = event;
    },
    resetPageSize(e) {
      this.pageSize = e;
      this.activePage = 1;
      this.getTeachers(0);
    },
    clearForm() {
      // alert('clear form');
      this.tName.data = '';
      this.tLastname.data = '';
      this.tMobile.data = '';
      this.tUsername.data = '';
      this.tPassword.data = '';
      this.tSummary.data = '';
      this.tDescription.data = '';
      this.tLessons = [];
      this.tAccess.data = '';
      this.tAvatar = '';
    },
    teacherFormValidation() {
      // name
      if (this.tName.error || this.tName.data === '') {
        this.makeToast('error', 'نام دبیر را وارد کنید', 3000);
        return false;
      }
      // lname
      if (this.tLastname.error || this.tLastname.data === '') {
        this.makeToast('error', 'نام خانوادگی دبیر را وارد کنید', 3000);
        return false;
      }
      // mobile
      if (this.tMobile.error) {
        this.makeToast('error', 'شماره همراه را درست وارد کنید', 1000);
        return false;
      }
      // username
      if (this.tUsername.error) {
        this.makeToast('error', 'نام کاربری را بررسی کنید', 1000);
        return false;
      }
      // password
      if (this.tPassword.error) {
        this.makeToast('error', 'رمز عبور را بررسی کنید', 1000);
        return false;
      }
      // access
      if (this.tAccess.data === '') {
        this.makeToast('error', 'دسترسی دبیر را انتخاب کنید', 1000);
        return false;
      }
      // lessons
      if (this.tLessons.length === 0) {
        this.makeToast('error', 'دروس مربوط به دبیر را انتخاب کنید', 1000);
        return false;
      }
      // avatar
      if (this.tAvatar === '') {
        this.makeToast('error', 'تصویر دبیر را آپلود کنید', 1000);
        return false;
      }
      return true;
    },
    createNewTeacher() {
      // console.clear();
      // console.log('createNewTeacher', this.tSummary, this.tDescription);
      if (this.teacherFormValidation()) {
        axios({
          method: 'post',
          url: `${this.baseURL}/api/v${this.V}/Teachers`,
          headers: {
            Authorization: this.$authObeject.authToken(),
          },
          data: {
            AccessId: this.tAccess.data,
            FirstName: this.tName.data,
            LastName: this.tLastname.data,
            Username: this.tUsername.data,
            Password: this.tPassword.data,
            Status: this.tStatus,
            Mobile: this.tMobile.data,
            Summary: this.tSummary.data,
            Avatar: this.tAvatar,
            LessonIds: this.tLessons.data,
            Description: this.tDescription.data,
          },
        }).then(
          (response) => {
            // console.log(response);
            if (response.data.isSuccess) {
              console.log(response);
              this.clearForm();
              this.teacherAddToggle();
              this.getTeachers(0);
            } else {
              this.makeToast('warning', 'نام کاربری تکراری است. لطفا نام کاربری جدید وارد کنید.', 4000);
            }
          },
          (error) => {
            this.whileState = false;
            // console.log(error);
            this.makeToast('error', this.errorHandler(error), 2000);
          },
        );
      }
    },
    editTeacher() {
      // console.clear();
      // console.log('createNewTeacher', this.tSummary, this.tDescription);
      // console.log(this.tAccess.data, this.tName.data, this.tLastname.data);
      // console.log(this.tMobile.data, this.tSummary.data, this.tAvatar);
      // console.log(this.tDescription.data, this.tLessons.data);
      if (this.teacherFormValidation()) {
        axios({
          method: 'put',
          url: `${this.baseURL}/api/v${this.V}/Teachers/${this.$store.state.focusedTeacherId}`,
          headers: {
            Authorization: this.$authObeject.authToken(),
            'Content-Type': 'application/json',
          },
          data: {
            AccessId: this.tAccess.data,
            FirstName: this.tName.data,
            LastName: this.tLastname.data,
            Mobile: this.tMobile.data,
            Summary: this.tSummary.data,
            Avatar: this.tAvatar,
            Description: this.tDescription.data,
            LessonIds: this.tLessons.data,
          },
        }).then(
          (response) => {
            if (response.data.isSuccess) {
              this.clearForm();
              this.backToList();
              this.getTeachers(0);
            }
          },
          (error) => {
            this.whileState = false;
            // console.log(error);
            this.makeToast('error', this.errorHandler(error), 2000);
          },
        );
      }
    },
    changeTeacherStatus() {
      this.teacherStatus = !this.teacherStatus;
      // console.log('ch');
    },
    teacherAddToggle() {
      if (!this.teacherAdd) {
        this.teacherAdd = true;
        this.initAddTeacher();
        this.teacherManage = false;
      } else {
        this.teacherAdd = false;
        this.teacherManage = true;
      }
    },
    initAddTeacher() {
      // first get lessons and make a filtered list
      this.lessonsLoaded = false;
      const reqUrl = `${this.baseURL}/api/v${this.V}/Lessons`;
      axios({
        method: 'get',
        url: reqUrl,
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
      }).then((response) => {
        this.posts = response.data;
        if (this.posts.isSuccess) {
          this.lessonsLoaded = true;
          this.allLessons = JSON.parse(JSON.stringify(this.posts.data));
          let lessonObject = {};
          this.filteredLessons = [];
          for (let i = 0; i < this.allLessons.length; i += 1) {
            lessonObject = {};
            lessonObject.value = this.allLessons[i].id;
            // eslint-disable-next-line
            lessonObject.label = `${this.allLessons[i].title} (${this.allLessons[i].gradeName} ${this.sayFieldName(this.allLessons[i].field)})`;
            this.filteredLessons.push(lessonObject);
          }
          // console.log('all filtered ▄░▄░▄░▄░▄░▄', this.filteredLessons);
        } else {
          this.makeToast('error', 'خطا در دریافت اطلاعات', 3000);
        }
      }, (error) => {
        this.lessonsLoaded = false;
        this.makeToast('error', this.errorHandler(error), 3000);
      });

      // then get access and make a filtered list
      this.accessesLoaded = false;
      const reqUrlAccess = `${this.baseURL}/api/v${this.V}/Accesses`;
      axios({
        method: 'get',
        url: reqUrlAccess,
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
      }).then((response) => {
        this.posts = response.data;
        if (this.posts.isSuccess) {
          this.accessesLoaded = true;
          this.allAccesses = JSON.parse(JSON.stringify(this.posts.data));
          let accessObject = {};
          this.filteredAccesses = [];
          for (let i = 0; i < this.allAccesses.length; i += 1) {
            accessObject = {};
            accessObject.value = this.allAccesses[i].id;
            accessObject.label = `${this.allAccesses[i].title}`;
            this.filteredAccesses.push(accessObject);
          }
          // console.log('all accesses ▄░▄░▄░▄░▄░▄', this.filteredAccesses);
        } else {
          this.makeToast('error', 'خطا در دریافت اطلاعات', 3000);
        }
      }, (error) => {
        this.accessesLoaded = false;
        this.makeToast('error', this.errorHandler(error), 3000);
      });
    },
    sayFieldName(num) {
      let sfn = '';
      switch (num) {
        case 1: {
          sfn = 'ریاضی فیزیک';
          break;
        }
        case 2: {
          sfn = 'علوم تجربی';
          break;
        }
        case 3: {
          sfn = 'انسانی';
          break;
        }
        case 4: {
          sfn = 'فنی حرفه‌ای';
          break;
        }
        case 5: {
          sfn = 'هنر';
          break;
        }
        case 6: {
          sfn = 'زبان';
          break;
        }
        default:
          break;
      }
      return sfn;
    },
    getUploaded(event) {
      this.tAvatar = event;
    },
    getFromInput(event, inp) {
      switch (inp) {
        case 'name': {
          this.tName = event;
          // console.log(this.tName.data, event.error, event.warn);
          break;
        }
        case 'lname': {
          this.tLastname = event;
          // console.log(this.tLastname.data, event.error, event.warn);
          break;
        }
        case 'username': {
          this.tUsername = event;
          // console.log(this.tUsername.data, event.error, event.warn);
          break;
        }
        case 'password': {
          this.tPassword = event;
          // console.log(this.tPassword.data, event.error, event.warn);
          break;
        }
        case 'summary': {
          this.tSummary = event;
          // console.log(this.tSummary.data, event.error, event.warn);
          break;
        }
        case 'desc': {
          this.tDescription = event;
          // console.log(this.tDescription.data, event.error, event.warn);
          break;
        }
        case 'mobile': {
          this.tMobile = event;
          // console.log(this.tMobile.data, event.error, event.warn);
          break;
        }
        case 'access': {
          this.tAccess = event;
          console.log('access list -> ', this.tAccess.data, event.error);
          break;
        }
        case 'lessons': {
          this.tLessons = event;
          // console.log(event);
          console.log('lessons list -> ', this.tLessons.data, this.tLessons.error);
          break;
        }
        default:
          break;
      }
    },
    filterLessonList() {
      // console.log(this.lessonTitle);
      if (this.lessonTitle === '') {
        this.lessons = this.lessonsDatas;
      } else {
        this.lessons = [];
        for (let i = 0; i < this.lessonsDatas.length; i += 1) {
          if (this.lessonsDatas[i].title.includes(this.lessonTitle)) {
            this.lessons.push(this.lessonsDatas[i]);
          }
        }
      }
    },
    closeLessons() {
      // console.log('close Lessons');
      setTimeout(() => {
        this.dropDownLoad = false;
        this.dropdown = false;
        this.lessonTitle = this.lastLesson;
      }, 300);
    },
    openLessons() {
      this.dropdown = true;
      this.dropDownLoad = false;
      axios({
        method: 'get',
        url: `${this.baseURL}/api/v${this.V}/Lessons`,
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
      }).then((response) => {
        // JSON responses are automatically parsed.
        this.posts = response.data;
        if (this.posts.isSuccess) {
          // اگه درست بود همه چی
          // this.lessonsDatas = JSON.parse(JSON.stringify(this.posts));
          this.dropDownLessons = JSON.parse(JSON.stringify(response.data.data));
          this.lessonsDatas = JSON.parse(JSON.stringify(this.posts.data));
          this.lessons = JSON.parse(JSON.stringify(this.posts.data));
          // console.log('╪┘╪┘╪┘╪┘╪┘╪┘', this.dropDownLessons);
          // اگه لیست خالی بود
          this.dropDownLoad = true;
        } else {
          this.dropDownLoad = true;
        }
      }, (error) => {
        this.makeToast('error', this.errorHandler(error), 3000);
        // console.log(error);
      });
    },
    changeTab() {
      this.teacherManage = !this.teacherManage;
    },
    ch(event, type) {
      switch (type) {
        case 'filter': {
          document.getElementById('showAllLessons').checked = false;
          this.activePage = 1;
          this.filter = event.target.id;
          this.getTeachers(this.filter, this.activePage);
          this.lessonTitle = event.target.getAttribute('data-title');
          this.lastLesson = event.target.getAttribute('data-title');
          break;
        }
        case 'all': {
          this.activePage = 1;
          this.getTeachers(0);
          this.lessonTitle = '';
          this.lastLesson = '';
          this.filter = 0;
          break;
        }
        default:
          break;
      }
    },
    refreshAll() {
      this.activePage = 1;
      this.getTeachers(0);
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
      this.isLessonDataLoad = false;
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
          this.isLessonDataLoad = true;
          this.lessonsDatas = JSON.parse(JSON.stringify(this.posts.data));
          this.lessons = JSON.parse(JSON.stringify(this.posts.data));
          // console.log('all lessons █▄█▄█data', this.lessons);
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
        this.isLessonDataLoad = true;
        this.responseEmpty = false;
        this.responseFalse = false;
        this.responseLoad = false;
        this.makeToast('error', this.errorHandler(error), 3000);
        // console.log(error);
      });
    },
    getTeachers(f, p) {
      // alert(f);
      this.isDataLoad = false;
      this.responseFalse = false;
      this.responseEmpty = false;
      this.responseError = false;
      this.responseLoad = true;
      let tpage = 1;
      if (p !== undefined) {
        tpage = p;
      }
      // eslint-disable-next-line
      let reqUrl = `${this.baseURL}/api/v${this.V}/Teachers/?type=1&query=null&pageNo=${tpage}&pageSize=${this.pageSize}`;
      if (f !== 0) {
        // eslint-disable-next-line
        reqUrl = `${this.baseURL}/api/v${this.V}/Teachers?type=2&query=${f}&pageNo=${tpage}&pageSize=${this.pageSize}`;
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
          this.TeacherDatas = JSON.parse(JSON.stringify(response.data.data.users));
          // this.TeacherDatas = this.TeacherDatas.slice().reverse();
          this.howManyPages = response.data.data.pageCount;
          // console.clear();
          // console.log(this.howManyPages);
          // console.log('all ███████ data', JSON.parse(JSON.stringify(this.TeacherDatas)));
          // اگه لیست خالی بود
          if (response.data.data.users.length === 0) {
            this.responseEmpty = true;
            // console.log('hey hey hey hey', this.responseEmpty);
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
        url: `${this.baseURL}/api/v${this.V}/Lessons`,
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
      document.getElementById('showall').click();
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
    GetPhoto,
    Pagination,
    SwitchButton,
    Inp,
    Toast,
    TeacherRow,
    TeacherManager,
    Modal,
  },
  computed: {
    showAddNow() {
      let san = false;
      if (this.accessesLoaded && this.lessonsLoaded) {
        san = true;
      }
      return san;
    },
    showEdit() {
      if (this.$store.state.teacherEdit) {
        this.initAddTeacher();
        this.getEditInitData();
      }
      return this.$store.state.teacherEdit;
    },
    computedInitImage() {
      const cii = 'none';
      if (this.teacherAdd) {
        return cii;
      }
      return cii;
    },
    computedModalState() {
      return this.$store.state.modalState;
    },
    computedCardWidth() {
      let ww = '0';
      switch (this.$store.state.teacherManagerMode) {
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
        case 'teachers': {
          cwo = true;
          break;
        }
        default:
          break;
      }
      return cwo;
    },
    computedMode() {
      // alert(this.$store.state.teacherManagerMode);
      return this.$store.state.teacherManagerMode;
    },
    computedEmpty() {
      return this.emptyError;
    },
  },
};
</script>

<style lang="scss" scoped>
.filters {
  padding: 16px 0 0 0;
}

.checkText{

}

input:disabled{
  display: none;
}

.filters label{
  width: 20%;
}

.formHolder{
  margin-top: 16px;
}

.inputWrapper{
    margin-bottom: 24px;
    position: relative;
}

.inputWrapper .inputIcon{
  position: absolute;
  top: 32px;
  right: 8px;
  color: #61187a50;
  pointer-events: none;
}

.hasIcon{
  padding-right: 36px !important;
}

.inputWrapper span{
    font-size: 10px;
    padding-right: 8px;
    margin-bottom: 8px;
}

.inputWrapper input, .dropDownBtn{
    border: solid 2px rgba($color: #000000, $alpha: 0.2);
    border-radius: 4px;
    width: 100%;
    padding: 0px 12px;
    position: relative;
    height: 40px;
    transition: all ease-in-out 0.3s;
}

#showAllLessons {
  display: none;
}

.lesson{
  display: none;
}

.dropDownBtn{
  width: 100%;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.inputValue{
  font-size: 14px;
  text-align: right;
}

.inputWrapper .hide{
  opacity: 0;
  transform: scale(0);
}

.inputWrapper input:focus{
    border: solid 2px rgba($color: #000000, $alpha: 0.4);
    outline: none;
    border-radius: 8px;
    width: 100%;
    padding: 8px 12px;
}

.inputWrapper .dropDown{
    position: absolute;
    top: calc(24px + 40px);
    left: 0px;
    width: 100%;
    height: 200px;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 264px;
    background-color: white;
    box-shadow: 0 8px 32px 0 rgba($color: #000000, $alpha: 0.25);
    border-radius: 8px;
    z-index: 300;
}

.lll {
  border-bottom: dashed 1px rgba($color: #000000, $alpha: 0.05);
}

.lll:hover{
  background-color: #0000001e;
}

.inputWrapper .err {
  border-color: red;
  color: red;
}

.inputWrapper .dropDown .item{
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 200;
    color: black;
    text-align: right;
    cursor: pointer;
    transition: all ease-in-out 0.3s;
}

.item.icon{
    width:  25% !important;
    height: 40px !important;
    display: flex;
    border-radius: 80px;
    justify-content: center;
    align-items: center;
    font-size: 24px !important;
}

.inputWrapper .dropDown .item:hover{
    background-color: rgba($color: #000000, $alpha: 0.00);
    color: #61187A;
}

.top-row {
  padding: 8px 12px 0px 12px;
  color: rgb(71, 71, 71);
}

.top-row p {
  padding: 0;
  margin: 0;
  flex-grow: 1;
  color: rgb(71, 71, 71);
  font-size: 12px;
  margin-bottom: 8px;
  text-align: right;
}

</style>
