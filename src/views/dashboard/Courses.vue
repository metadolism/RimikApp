<template>
  <div class="dashboard background">
    <toast />
    <dashboard-page pcontent="1" page="COURSES">
      <!-- course manager  -->
      <card w='80%' minWidth='950px' v-if='this.teacherManage && !this.showEdit'>
        <!-- card header -->
        <div class='fRow fullWidth jStart aStart'>
          <div class='growFull fCol jStart aStart'>
            <h3 class='growFull text-right'>مدیریت دوره‌ها</h3>
            <p class='note'>دوره‌ها را اضافه، حذف، ویرایش و مشاهده کنید.</p>
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
            <p class='growFull' style="margin: 16px 0; text-align: right; width: calc(100%);">
              لیست دوره‌ها را فیلتر کنید.
            </p>
            <!-- مشاهده همه -->
            <div class="inputWrapper fCol aStart jStart ptitle">
              <label class="rContainer checkBoxHolder dark fRow jStart aCenter fullWidth"
                id='showall' style="padding: 8px;">
                <input type="radio"
                name="filter"
                id='showAllLessons'
                class="parent fullWidth"
                v-on:change="ch($event, 'all')"/>
                <div class="checkmark dark"></div>
                <div class="checkText fRow jCenter aCenter">
                  <div>مشاهده همه</div>
                </div>
              </label>
            </div>
            <!-- جستجو در عنوان -->
            <div class="inputWrapper fCol aStart jStart ptitle">
              <label class="rContainer checkBoxHolder dark fRow jStart aCenter fullWidth"
                id='showall' style="padding: 8px;">
                <input type="radio"
                name="filter"
                id='byQuery'
                class="parent fullWidth"
                    v-on:change="ch($event, 'title')"/>
                <div class="checkmark dark"></div>
                <div class="checkText fRow jCenter aCenter">
                  <div>عنوان دوره</div>
                </div>
              </label>
            </div>
            <!-- بر اساس دبیر -->
            <div class="inputWrapper fCol aStart jStart ptitle">
              <label class="rContainer checkBoxHolder dark fRow jStart aCenter fullWidth"
                id='showall' style="padding: 8px;">
                <input type="radio"
                name="filter"
                id='byTeacher'
                class="parent fullWidth"
                    v-on:change="ch($event, 'teacher')"/>
                <div class="checkmark dark"></div>
                <div class="checkText fRow jCenter aCenter">
                  <div>بر اساس دبیر</div>
                </div>
              </label>
            </div>
            <!-- بر اساس درس -->
            <div class="inputWrapper fCol aStart jStart ptitle">
              <label class="rContainer checkBoxHolder dark fRow jStart aCenter fullWidth"
                id='showall' style="padding: 8px;">
                <input type="radio"
                name="filter"
                id='byLesson'
                class="parent fullWidth"
                    v-on:change="ch($event, 'lesson')"/>
                <div class="checkmark dark"></div>
                <div class="checkText fRow jCenter aCenter">
                  <div>بر اساس درس</div>
                </div>
              </label>
            </div>
            <!-- دراپ دان انتخاب دبیر -->
            <keep-alive>
              <div class="inputWrapper fCol aStart jStart w66" v-if="this.reqType === 3">
                <inp noLimit='true' inputType='text' place='دبیر را انتخاب کنید'
                  :list='this.filteredTeachers' compType='radio' req='true'
                  @vmodel='getFromInput($event, "teacher")' complete="false"
                  icon='school' @getTeachers='getTeachers' from='chooseTeacher'
                  label='برای مشاهده دوره‌های هر دبیر، دبیر را از لیست زیر انتخاب کنید' />
              </div>
            </keep-alive>
            <!-- دراپ دان انتخاب درس -->
            <keep-alive>
              <div class="inputWrapper fCol aStart jStart w66" v-if="this.reqType === 2">
                <inp noLimit='true' inputType='text' place='درس را انتخاب کنید'
                  :list='this.filteredLessons' compType='radio' req='true'
                  @vmodel='getFromInput($event, "lesson")' complete="false"
                  icon='menu_book' @getLessons='getLessons(0)' from='chooseLesson'
                  label='برای مشاهده دوره‌های هر درس، درس را از لیست زیر انتخاب کنید' />
              </div>
            </keep-alive>
            <!-- جستجوی عنوان دوره -->
            <keep-alive>
              <div class="inputWrapper fCol aStart jStart w66" v-if="this.reqType === 4">
                <inp len='50' inputType='text' place='مثلا دوره ریاضی عمومی'
                  req='true' validation='searchQuery'
                  @vmodel='getFromInput($event, "searchQuery")' @goSearch='getCourses'
                  icon='search' label='جستجو در عنوان دوره' />
              </div>
            </keep-alive>
            <!-- بقیه -->
            <div v-if="false" class="inputWrapper fCol aStart jStart ptitle growFull">
              <div class="fullWidth fRow jStart aCenter">
                <label class="rContainer checkBoxHolder dark fRow jStart aCenter"
                  id='showall' style="padding: 8px;">
                  <input type="radio"
                  name="searchBy"
                  id='searchByLesson'
                  class="parent fullWidth"
                      v-on:change="ch($event, 'all')"/>
                  <div class="checkmark dark"></div>
                  <div class="checkText fRow jCenter aCenter">
                    <div>بر اساس درس</div>
                  </div>
                </label>
              </div>
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
          <div class='tableHead itemImg big'>تصویر</div>
          <div class='tableHead title big' style="text-align: right;">مشخصات</div>
          <div class='tableHead state'>وضعیت</div>
          <div class='tableHead state'>رایگان</div>
          <div class='tableHead actions big'>عملیات</div>
        </div>
        <empty-bar v-if="responseEmpty" w='100%' h='152px'
          msg='هیچ دوره‌ای ثبت نشده'/>
        <error-bar v-if="responseError" w='100%' h='152px'
          :msg='errorMsg'/>
        <progress-bar v-if="!isDataLoad" w='100%' h='160px'
          msg='لطفا صبر کنید'/>
        <div class="fullWidth fCol aCenter jStart" v-if="isDataLoad">
          <teacher-row
            v-bind:key="item.id"
            v-for="(item, index) in CourseDatas"
            :index='((activePage - 1) * pageSize) + index + 1'
            :page='activePage'
            :pages='howManyPages'
            :course='item' />
        </div>
        <pagination v-if="isDataLoad" :active='activePage' :psize='pageSize'
        @resetPageSize="resetPageSize($event)"
        :pages='howManyPages' @goToPage="GoToPages($event)" />
      </card>
      <!-- ▬▬▬▬↓↓↓ course add ↓↓↓▬▬▬▬ -->
      <card w='80%' minWidth='950px' v-if='this.teacherAdd'>
        <!-- hameye content bad az load shodan inja show mishan ↓ -->
        <div class="fCol jStart aStart" v-if="showAddNow">
          <!-- card header -->
          <div class='fRow fullWidth jStart aStart'>
            <div class='growFull fCol jStart aStart'>
              <h3 class='growFull text-right'>اضافه کردن دوره جدید</h3>
              <p class='note'>
                برای اضافه کردن دوره جدید فرم زیر را پر کنید. تمام فیلدها اجباری می‌باشند.
              </p>
            </div>
            <btn fabBtn='false' label='بازگشت' bc='#9a9a9a'
              icon='keyboard_arrow_left' @click.native="teacherAddToggle"/>
          </div>
          <div class='sepLine'></div>
          <!-- Add course form  -->
          <div class="fullWidth fRow wrap jBetween aStart formHolder">
            <div class="inputWrapper fCol aStart jStart w50">
              <inp noLimit='true' inputType='text' place='درس را انتخاب کنید'
                :list='this.filteredLessons' compType='radio' req='true'
                @vmodel='getFromInput($event, "addCourseLesson")' complete="false"
                icon='menu_book' @getLessons='getLessons(0)' from='addCourseLesson'
                label='انتخاب درس' />
            </div>
            <div class="inputWrapper fCol aStart jStart w50">
              <inp noLimit='true' inputType='text' place='دبیر را انتخاب کنید'
                v-if="!reset"
                :list='this.filteredTeachers' compType='radio' req='true'
                @vmodel='getFromInput($event, "addCourseTeacher")' complete="false"
                icon='school' @gtbl='getTeachers(lessonIdForAdd, true)'
                from='addCourseTeacher'
                label='انتخاب دبیر (ابتدا درس را انتخاب کنید)' />
            </div>
            <div class="inputWrapper fCol aStart jStart w50">
              <inp len='120' inputType='text' place='دوره آموزشی شیمی دوم ریاضی'
                :initData='this.courseTitle.data' req='true' validation='courseTitle'
                @vmodel='getFromInput($event, "title")'
                icon='ondemand_video' label='عنوان دوره را وارد کنید' />
            </div>
            <div class="inputWrapper fCol aStart jStart w25">
              <inp noLimit='true' inputType='text' place='قیمت به تومان'
                :initData='this.coursePrice.data' req='true' validation='price'
                @vmodel='getFromInput($event, "price")'
                icon='monetization_on' label='قیمت دوره' />
            </div>
            <div class="inputWrapper fCol aStart jStart w25">
              <inp len='2' inputType='number' place='درصد تخفیف'
                :initData='this.courseDiscount.data' req='true' validation='discount'
                @vmodel='getFromInput($event, "discount")'
                icon='local_offer' label='درصد تخفیف را وارد کنید' />
            </div>
            <div class="inputWrapper fCol aStart jStart w33">
              <inp len='5' inputType='text' place='مثلا: 09:30'
                :initData='this.courseDuration.data' req='true' validation='duration'
                @vmodel='getFromInput($event, "duration")'
                icon='timelapse' label='مدت زمان دوره' />
              <p style="font-size: 10px; text-align: right; padding-right: 16px; color: red;"
              >برای مثال دوره با مدت 9 ساعت و 30 دقیقه: 09:30</p>
            </div>
            <div class="inputWrapper fCol aStart jStart w25">
              <div class="top-row fRow jStart aCenter">
                <p>وضعیت دوره</p>
              </div>
              <div class="fRow jStart aCenter fullWidth" @click="changeTeacherStatus">
                <p class="growFull rtlText" style="padding-right: 12px;">وضعیت دوره</p>
                <switch-button
                  id="courseStatus"
                  :val="this.statusSwitch"
                  activeLabel="فعال"
                  deactiveLabel="غیرفعال"
                />
              </div>
            </div>
            <div class="inputWrapper fCol aStart jStart w25">
              <div class="top-row fRow jStart aCenter">
                <p>آیا این دوره رایگان است؟</p>
              </div>
              <div class="fRow jStart aCenter fullWidth" @click="changeTeacherState">
                <p class="growFull rtlText" style="padding-right: 12px;">دوره رایگان</p>
                <switch-button
                  id="courseState"
                  :val="this.stateSwitch"
                  activeLabel="رایگان"
                  deactiveLabel="رایگان"
                />
              </div>
            </div>
            <div class="inputWrapper fCol aStart jStart w66">
              <inp len='120' inputType='text' place='خلاصه' compType='textarea'
                :initData='this.tSummary.data' style="margin-bottom: 16px;"
                lines=2 @vmodel='getFromInput($event, "summary")'
                icon='short_text' label='توضیحات کوتاه' />
                <!-- این کامپوننت اچ تی ام ال ادیتوره -->
              <div class="inputWrapper fCol aStart jStart fullWidth" v-if="true">
                <div class="top-row fRow jStart aCenter">
                  <p>توضیحات کامل</p>
                </div>
                <vue-editor v-model="courseDesc.data" class="fullWidth"
                  @text-change="getFromInput($event, 'editor')"></vue-editor>
              </div>
              <inp noLimit="true" inputType='text' v-if='false'
                place='متن توضیحات کامل را وارد کنید' compType='textarea'
                :initData='this.courseDesc.data'
                lines=6 @vmodel='getFromInput($event, "editor")'
                icon='subject' label='توضیحات کامل' />
            </div>
            <div class="inputWrapper fCol aStart jStart w33">
              <div class="top-row fRow jStart aCenter">
                <p>تصویر دوره را آپلود کنید</p>
              </div>
              <get-photo
                w='100%'
                style="margin-top: -8px"
                v-on:photoupload="getUploaded"
                photoFor='addCourse'
                :initImg='this.computedInitImage'
                uploadMsg='آپلود تصویر الزامیست'
                uploadLabel='تصویر دوره'/>
            </div>
            <btn label="ایجاد دوره‌ی جدید" btnWidth='calc(66.666% - 8px)'
              class="flexGrow"
              icon="add" @click.native="createNewCourse"/>
          </div>
        </div>
        <!-- <empty-bar v-if="responseEmpty" w='100%' h='152px'
          msg='شما هنوز هیچ دسترسی ای ثبت نکرده اید'/>
        <error-bar v-if="responseError" w='100%' h='152px'
          :msg='errorMsg'/> -->
        <progress-bar v-if="!showAddNow" w='100%' h='160px'
          msg='لطفا صبر کنید'/>
      </card>
      <!-- ▬▬▬▬↑↑↑ course add ↑↑↑ ▬▬▬▬ -->
      <!--                                              -->
      <!-- ▌▌▌▌▌▌▌↓↓↓ course edit ↓↓↓▌▌▌▌▌▌▌ -->
      <card w='80%' minWidth='950px' v-if='this.showEdit'>
        <!-- hameye content bad az load shodan inja show mishan ↓ -->
        <div class="fCol jStart aStart" v-if="this.teacherEdit">
          <!-- card header -->
          <div class='fRow fullWidth jStart aStart'>
            <div class='growFull fCol jStart aStart'>
              <h3 class='growFull text-right'
                >ویرایش دوره‌ی {{this.$store.state.focusCourseName}}</h3>
              <p class='note'>
                دوره را ویرایش کنید.
              </p>
            </div>
            <btn fabBtn='false' label='بازگشت' bc='#9a9a9a'
              icon='keyboard_arrow_left' @click.native="backToList"/>
          </div>
          <div class='sepLine'></div>
          <!-- edit course form  -->
          <div class="fullWidth fRow wrap jBetween aStart formHolder">
            <div class="inputWrapper fCol aStart jStart w50">
              <inp noLimit='true' inputType='text' place='دبیر را انتخاب کنید'
                v-if="!reset" :initData="this.teacherIdForAdd"
                :list='this.filteredTeachers' compType='radio' req='true'
                @vmodel='getFromInput($event, "addCourseTeacher")' complete="false"
                icon='school' @gtbl='getTeachers(lessonIdForAdd, true)'
                from='editCourse'
                label='انتخاب دبیر (ابتدا درس را انتخاب کنید)' />
            </div>
            <div class="inputWrapper fCol aStart jStart w50">
              <inp len='120' inputType='text' place='دوره آموزشی شیمی دوم ریاضی'
                :initData='this.courseTitle.data' req='true' validation='courseTitle'
                @vmodel='getFromInput($event, "title")'
                icon='ondemand_video' label='عنوان دوره را وارد کنید' />
            </div>
            <div class="inputWrapper fCol aStart jStart w33">
              <inp noLimit='true' inputType='text' place='قیمت به تومان'
                :initData='this.coursePrice.data' req='true' validation='price'
                @vmodel='getFromInput($event, "price")'
                icon='monetization_on' label='قیمت دوره' />
            </div>
            <div class="inputWrapper fCol aStart jStart w33">
              <inp len='2' inputType='number' place='درصد تخفیف'
                :initData='this.courseDiscount.data' req='true' validation='discount'
                @vmodel='getFromInput($event, "discount")'
                icon='local_offer' label='درصد تخفیف را وارد کنید' />
            </div>
            <div class="inputWrapper fCol aStart jStart w33">
              <inp len='5' inputType='text' place='مثلا: 09:30'
                :initData='this.courseDuration.data' req='true' validation='duration'
                @vmodel='getFromInput($event, "duration")'
                icon='timelapse' label='مدت زمان دوره' />
              <p style="font-size: 10px; text-align: right; padding-right: 16px; color: red;"
              >برای مثال دوره با مدت 9 ساعت و 30 دقیقه: 09:30</p>
            </div>
            <div class="inputWrapper fCol aStart jStart w66">
              <inp len='120' inputType='text' place='خلاصه' compType='textarea'
                :initData='this.courseSummary.data' style="margin-bottom: 16px;"
                lines=2 @vmodel='getFromInput($event, "summary")'
                icon='short_text' label='توضیحات کوتاه' />
                <!-- این کامپوننت اچ تی ام ال ادیتوره -->
              <div class="inputWrapper fCol aStart jStart fullWidth" v-if="true">
                <div class="top-row fRow jStart aCenter">
                  <p>توضیحات کامل</p>
                </div>
                <vue-editor v-model="courseDesc.data" class="fullWidth"
                  @text-change="getFromInput($event, 'editor')"></vue-editor>
              </div>
              <inp noLimit="true" inputType='text' v-if='false'
                place='متن توضیحات کامل را وارد کنید' compType='textarea'
                :initData='this.courseDesc.data'
                lines=6 @vmodel='getFromInput($event, "editor")'
                icon='subject' label='توضیحات کامل' />
            </div>
            <div class="inputWrapper fCol aStart jStart w33">
              <div class="top-row fRow jStart aCenter">
                <p>تصویر دوره را آپلود کنید</p>
              </div>
              <get-photo
                w='100%'
                style="margin-top: -8px"
                v-on:photoupload="getUploaded"
                photoFor='addCourse'
                :initImg='this.computedInitImage'
                uploadMsg='آپلود تصویر الزامیست'
                uploadLabel='تصویر دوره'/>
            </div>
            <btn label="ثبت تغییرات" btnWidth='calc(66.666% - 8px)'
              class="flexGrow"
              icon="add" @click.native="editCourse"/>
          </div>
        </div>
        <progress-bar v-if="!this.teacherEdit" w='100%' h='160px'
          msg='لطفا صبر کنید'/>
      </card>
      <!-- ▌▌▌▌▌▌▌↑↑↑ course edit ↑↑↑ ▌▌▌▌▌▌▌ -->
      <modal v-if="computedModalState" @changeMsg="refreshAll()">
        <card :w="`${computedCardWidth}`">
        <!-- add / edit lesson -->
          <course-manager v-if="computedWorkOn" @changeMsg="refreshAll()"
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
import fp from '@/mixins/fp';
import makeToast from '@/mixins/makeToast';
import Toast from '@/components/Toast.vue';
import ticks from '@/mixins/ticks';
import SwitchButton from '@/components/SwitchButton.vue';
import ProgressBar from '@/components/ProgressBar.vue';
import ErrorBar from '@/components/ErrorBar.vue';
import EmptyBar from '@/components/EmptyBar.vue';
import Pagination from '@/components/Pagination.vue';
import axios from 'axios';
import Modal from '@/components/Modal.vue';
import GetPhoto from '@/components/GetPhoto.vue';
// کامپوننت های مربوط به teacher
import TeacherRow from '@/components/course/CourseRow.vue';
import CourseManager from '@/components/course/CourseManager.vue';
import { VueEditor } from 'vue2-editor';

export default {
  mixins: [errorHandler, makeToast, ticks, fp],
  data() {
    return {
      // true = manage mode, false = add mode ↓
      teacherManage: true,
      teacherAdd: false,
      teacherEdit: false,
      CourseDatas: [],
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
      pageSize: 5,
      activePage: 1,
      reqType: 1,
      // data for add teacher ↓
      letShowAddPage: false,
      lessonsLoaded: false,
      allLessons: [],
      filteredLessons: [],
      filteredTeachers: [],
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
      // for courses ↓
      search: { data: '' },
      teacher: { data: '' },
      lesson: { data: '' },
      lessonIdForAdd: '',
      teacherIdForAdd: '',
      customToolbar: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['heading', 'code-block'],
      ],
      // vmodels for course form
      courseTitle: { data: '' },
      coursePrice: { data: '0' },
      courseDiscount: { data: 0 },
      stateSwitch: false,
      courseState: { data: 1 },
      statusSwitch: true,
      courseStatus: { data: 1 },
      coursePhoto: { data: '' },
      courseDesc: { data: '' },
      courseSummary: { data: '' },
      courseDuration: { data: '' },
      desc: '',
      // v models ↓
      reset: false,
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
      test: [
        {
          value: '1',
          label: 'دبیر',
        },
      ],
      test2: [
        {
          value: '1',
          label: 'درس',
        },
        {
          value: '2',
          label: 'درس 2',
        },
      ],
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
      this.$store.commit('setCourseEditFalse');
    },
    getEditInitData() {
      if (this.$store.state.courseEdit) {
        this.teacherManage = false;
        // alert(this.$store.state.focusedTeacherId);
        // eslint-disable-next-line
        const reqUrl = `${this.baseURL}/api/v${this.V}/Courses/${this.$store.state.focusedCourseId}`;
        axios({
          method: 'get',
          headers: {
            Authorization: this.$authObeject.authToken(),
          },
          url: reqUrl,
        }).then((response) => {
          // JSON responses are automatically parsed.
          this.posts = response.data;
          if (this.posts.isSuccess) {
            const resp = response.data.data;
            // set vmodels
            // console.log('ey baba -> ', resp);
            this.courseTitle.data = resp.title;
            this.lessonIdForAdd = resp.lessonId;
            this.teacherIdForAdd = resp.teacherId;
            this.coursePhoto.data = resp.photo;
            this.courseSummary.data = resp.summary;
            // alert(this.courseSummary.data);
            this.courseDesc.data = resp.description;
            this.coursePrice.data = this.commaSep(resp.price.toString());
            this.courseDiscount.data = resp.discountPercent;
            this.courseDuration.data = resp.duration;
            if (resp.status === 1) {
              this.statusSwitch = true;
            } else {
              this.statusSwitch = false;
            }
            if (resp.state === 1) {
              this.stateSwitch = true;
            } else {
              this.stateSwitch = false;
            }
            // console.log(resp.state, resp.status);
            this.teacherEdit = true;
          }
          return this.$store.state.teacherEdit;
        }, (error) => {
          this.makeToast('error', this.errorHandler(error), 3000);
          this.teacherEdit = false;
          // console.log(error);
        });
        // this.$nextTick();
      }
      this.teacherManage = true;
      return false;
    },
    GoToPages(event) {
      // بر اساس درس میگیریم لیست معلما رو
      // اگه درس نداشته باشیم ورودی تابع میشه 0 که همه رو بر میگردونه
      // اگه درس یا فیلتر داشته باشیم ورودی تابع میشه آی دی درس

      // let getTeacherFilter = 0;
      // if (this.filter !== 0) {
      //   getTeacherFilter = this.filter;
      // }
      if (event === 'next') {
        // alert('next');
        this.activePage += 1;
        if (this.activePage > this.howManyPages) {
          this.activePage = 1;
        }
        this.getCourses(this.activePage);
        return;
      }
      if (event === 'prev') {
        this.activePage -= 1;
        if (this.activePage < 1) {
          this.activePage = this.howManyPages;
        }
        this.getCourses(this.activePage);
        return;
      }
      this.getCourses(event);
      this.activePage = event;
    },
    resetPageSize(e) {
      this.pageSize = e;
      this.activePage = 1;
      this.getCourses();
    },
    clearForm() {
      // alert('clear form');
      this.teacherIdForAdd = '';
      this.filteredTeachers = [];
      this.lessonIdForAdd = '';
      this.filteredLessons = [];
      this.courseTitle.data = '';
      this.coursePrice.data = 0;
      this.courseDiscount.data = 0;
      this.courseDuration.data = '';
      this.stateSwitch = false;
      this.statusSwitch = true;
      this.courseSummary.data = '';
      this.courseDesc.data = '';
      this.coursePhoto.data = '';
    },
    courseFormValidation() {
      // lessonId
      if (this.lessonIdForAdd === '') {
        this.makeToast('error', 'درس مربوط به دوره را انتخاب کنید', 5000);
        return false;
      }
      // teacherId
      if (this.teacherIdForAdd === '') {
        this.makeToast('error', 'دبیر مربوط به دوره را انتخاب کنید', 5000);
        return false;
      }
      // title
      if (this.courseTitle.error) {
        this.makeToast('error', 'عنوان دوره را وارد کنید', 5000);
        return false;
      }
      // price
      if (this.coursePrice.error) {
        this.makeToast('error', 'قیمت را به درستی وارد کنید.', 5000);
        return false;
      }
      // Discount
      if (this.courseDiscount.error) {
        this.makeToast('error', 'درصد تخفیف را به درستی وارد کنید', 5000);
        return false;
      }
      // duration
      if (this.courseDuration.error) {
        this.makeToast('error', 'دسترسی دبیر را انتخاب کنید', 1000);
        return false;
      }
      // avatar
      if (this.coursePhoto.data === '') {
        this.makeToast('error', 'تصویر دبیر را آپلود کنید', 5000);
        return false;
      }
      return true;
    },
    createNewCourse() {
      // console.clear();
      // console.log('createNewCourse', this.tSummary, this.tDescription);
      if (this.courseFormValidation()) {
        let state = 1;
        if (this.stateSwitch) {
          state = 1;
        } else {
          state = 2;
        }
        let status = 1;
        if (this.statusSwitch) {
          status = 1;
        } else {
          status = 2;
        }
        axios({
          method: 'post',
          url: `${this.baseURL}/api/v${this.V}/Courses`,
          headers: {
            Authorization: this.$authObeject.authToken(),
          },
          data: {
            Title: this.courseTitle.data,
            LessonId: this.lessonIdForAdd,
            TeacherId: this.teacherIdForAdd,
            Price: parseInt(this.coursePrice.data.replace(/,/g, ''), 10),
            DiscountPercent: parseInt(this.courseDiscount.data, 10),
            Photo: this.coursePhoto.data,
            Duration: this.courseDuration.data,
            summary: this.courseSummary.data,
            Description: this.courseDesc.data.toString(),
            Status: status,
            State: state,
          },
        }).then(
          (response) => {
            // console.log(response);
            if (response.data.isSuccess) {
              // console.log(response);
              this.clearForm();
              this.teacherAddToggle();
              this.getCourses();
            } else {
              this.makeToast('warning', 'خطایی رخ داده است، لطفا ورودی‌ها را بررسی کنید.', 4000);
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
    editCourse() {
      // console.clear();
      // console.log('createNewCourse', this.tSummary, this.tDescription);
      // console.log(this.tAccess.data, this.tName.data, this.tLastname.data);
      // console.log(this.tMobile.data, this.tSummary.data, this.tAvatar);
      // console.log(this.tDescription.data, this.tLessons.data);
      if (this.courseFormValidation()) {
        axios({
          method: 'put',
          url: `${this.baseURL}/api/v${this.V}/Courses/${this.$store.state.focusedCourseId}`,
          headers: {
            Authorization: this.$authObeject.authToken(),
            'Content-Type': 'application/json',
          },
          data: {
            Title: this.courseTitle.data,
            TeacherId: this.teacherIdForAdd,
            Price: parseInt(this.coursePrice.data.replace(/,/g, ''), 10),
            DiscountPercent: parseInt(this.courseDiscount.data, 10),
            Photo: this.coursePhoto.data,
            Duration: this.courseDuration.data,
            summary: this.courseSummary.data,
            Description: this.courseDesc.data.toString(),
          },
        }).then(
          (response) => {
            if (response.data.isSuccess) {
              this.clearForm();
              this.backToList();
              this.getCourses();
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
      this.statusSwitch = !this.statusSwitch;
      // console.log('ch');
    },
    changeTeacherState() {
      this.stateSwitch = !this.stateSwitch;
      // console.log('ch');
    },
    teacherAddToggle() {
      if (!this.teacherAdd) {
        this.teacherAdd = true;
        this.initAddCourse();
        this.teacherManage = false;
      } else {
        this.teacherAdd = false;
        this.teacherManage = true;
      }
    },
    initAddCourse() {
      // first get lessons and make a filtered list
      // this.lessonsLoaded = false;
      // const reqUrl = `${this.baseURL}/api/v${this.V}/Lessons`;
      // axios({
      //   method: 'get',
      //   url: reqUrl,
      // }).then((response) => {
      //   this.posts = response.data;
      //   if (this.posts.isSuccess) {
      //     this.lessonsLoaded = true;
      //     this.allLessons = JSON.parse(JSON.stringify(this.posts.data));
      //     this.makeShortList(this.allLessons);
      //     // console.log('all filtered ▄░▄░▄░▄░▄░▄', this.filteredLessons);
      //   } else {
      //     this.makeToast('error', 'خطا در دریافت اطلاعات', 3000);
      //   }
      // }, (error) => {
      //   this.makeToast('error', this.errorHandler(error), 3000);
      // });

      // // then get access and make a filtered list
      // this.accessesLoaded = false;
      // const reqUrlAccess = `${this.baseURL}/api/v${this.V}/Accesses`;
      // axios({
      //   method: 'get',
      //   url: reqUrlAccess,
      // }).then((response) => {
      //   this.posts = response.data;
      //   if (this.posts.isSuccess) {
      //     this.accessesLoaded = true;
      //     this.allAccesses = JSON.parse(JSON.stringify(this.posts.data));
      //     let accessObject = {};
      //     this.filteredAccesses = [];
      //     for (let i = 0; i < this.allAccesses.length; i += 1) {
      //       accessObject = {};
      //       accessObject.value = this.allAccesses[i].id;
      //       accessObject.label = `${this.allAccesses[i].title}`;
      //       this.filteredAccesses.push(accessObject);
      //     }
      //     // console.log('all accesses ▄░▄░▄░▄░▄░▄', this.filteredAccesses);
      //   } else {
      //     this.makeToast('error', 'خطا در دریافت اطلاعات', 3000);
      //   }
      // }, (error) => {
      //   this.makeToast('error', this.errorHandler(error), 3000);
      // });
      this.lessonsLoaded = false;
      this.accessesLoaded = false;
    },
    // این متد لیست نمایش ساده درس ها رو نشون میده
    makeShortList(allLessons) {
      if (allLessons.length === 0) {
        this.filteredLessons = [
          {
            value: '',
            label: 'هیچ آیتمی ثبت نشده است',
          },
        ];
        return;
      }
      let lessonObject = {};
      this.filteredLessons = [];
      for (let i = 0; i < allLessons.length; i += 1) {
        lessonObject = {};
        lessonObject.value = allLessons[i].id;
        // eslint-disable-next-line
        lessonObject.label = `${allLessons[i].title} (${allLessons[i].gradeName} ${this.sayFieldName(allLessons[i].field)})`;
        this.filteredLessons.push(lessonObject);
      }
      // console.log('خلاصه', this.filteredLessons);
    },
    // این متد لیست نمایش ساده دبیر ها رو نشون میده
    makeShortTeacherList(allTeachers) {
      if (allTeachers.length === 0) {
        this.filteredTeachers = [
          {
            value: '',
            label: 'هیچ آیتمی ثبت نشده است',
          },
        ];
        return;
      }
      let teacherObject = {};
      this.filteredTeachers = [];
      for (let i = 0; i < allTeachers.length; i += 1) {
        teacherObject = {};
        teacherObject.value = allTeachers[i].id;
        // eslint-disable-next-line
        teacherObject.label = `${allTeachers[i].firstName} ${allTeachers[i].lastName}`;
        this.filteredTeachers.push(teacherObject);
      }
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
      this.coursePhoto.data = event;
    },
    getFromInput(event, inp) {
      switch (inp) {
        case 'searchQuery': {
          this.search = event;
          // console.log('search query -> ', this.search.data, event.error);
          break;
        }
        case 'teacher': {
          this.teacher = event;
          this.getCourses(this.activePage);
          // console.log('search query -> ', this.teacher.data, event.error);
          break;
        }
        case 'lesson': {
          this.lesson = event;
          this.getCourses(this.activePage);
          // console.log('search query -> ', this.teacher.data, event.error);
          break;
        }
        case 'addCourseTeacher': {
          this.teacherIdForAdd = event.data;
          // console.log('teacherIdForAdd -> ', this.teacherIdForAdd, event.error);
          break;
        }
        case 'addCourseLesson': {
          this.lessonIdForAdd = event.data;
          this.reset = true;
          setTimeout(() => {
            this.reset = false;
            this.filteredTeachers = [];
            this.teacherIdForAdd = '';
          }, 10);
          // console.log('addCourseLesson -> ', this.lessonIdForAdd, event.error);
          break;
        }
        // form inputs
        case 'title': {
          this.courseTitle = event;
          // console.log('course title -> ', this.courseTitle.data, event.error);
          break;
        }
        case 'price': {
          this.coursePrice = event;
          // console.log('course Price -> ', this.coursePrice.data, event.error);
          break;
        }
        case 'discount': {
          this.courseDiscount = event;
          // console.log('course Discount -> ', this.courseDiscount.data, event.error);
          break;
        }
        case 'duration': {
          this.courseDuration = event;
          // console.log('course Duration -> ', this.courseDuration.data, event.error);
          break;
        }
        case 'summary': {
          this.courseSummary = event;
          // console.log('course Summary -> ', this.courseSummary.data, event.error);
          break;
        }
        case 'editor': {
          // this.courseDesc = event;
          // console.log('course desc -> ', this.courseDesc.data);
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
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
        url: `${this.baseURL}/api/v${this.V}/Lessons`,
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
        case 'title': {
          this.reqType = 4;
          this.teacher.data = '';
          this.lesson.data = '';
          break;
        }
        case 'teacher': {
          this.reqType = 3;
          this.search.data = '';
          this.lesson.data = '';
          break;
        }
        case 'lesson': {
          this.reqType = 2;
          this.search.data = '';
          this.teacher.data = '';
          break;
        }
        case 'all': {
          this.reqType = 1;
          this.activePage = 1;
          this.getCourses();
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
      this.getCourses();
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
          // console.log(this.lessons);
          this.makeShortList(this.lessons);
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
    getCourses(p) {
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
      let reqUrl = '';
      switch (this.reqType) {
        case 1: {
          // نمایش همه دوره ها
          // eslint-disable-next-line
          reqUrl = `${this.baseURL}/api/v${this.V}/Courses/?type=1&query=null&pageNo=${tpage}&pageSize=${this.pageSize}`;
          break;
        }
        case 2: {
          // نمایش دوره بر اساس درس
          // eslint-disable-next-line
          reqUrl = `${this.baseURL}/api/v${this.V}/Courses/?type=2&query=${this.lesson.data}&pageNo=${tpage}&pageSize=${this.pageSize}`;
          break;
        }
        case 3: {
          // نمایش دوره بر اساس دبیر
          // eslint-disable-next-line
          reqUrl = `${this.baseURL}/api/v${this.V}/Courses/?type=3&query=${this.teacher.data}&pageNo=${tpage}&pageSize=${this.pageSize}`;
          break;
        }
        case 4: {
          // بر اساس سرچ
          // eslint-disable-next-line
          reqUrl = `${this.baseURL}/api/v${this.V}/Courses/?type=4&query=${this.search.data}&pageNo=${tpage}&pageSize=${this.pageSize}`;
          break;
        }
        default:
          break;
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
          this.responseFalse = false;
          this.CourseDatas = JSON.parse(JSON.stringify(response.data.data.courses));
          // console.log('all ███████ data', response.data);
          // اگه درست بود همه چی
          this.isDataLoad = true;
          this.howManyPages = response.data.data.pageCount;
          // اگه لیست خالی بود
          if (response.data.data.courses.length === 0) {
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
    // گرفتن همه دبیرها و ساختن لیست خلاصه
    getTeachers(lid, withFilter) {
      // eslint-disable-next-line
      if (withFilter) {
        if (this.lessonIdForAdd === '') {
          this.makeToast('warning', 'برای مشاهده لیست دبیرها ابتدا درس را انتخاب کنید', 4000);
          return;
        }
      }
      let reqUrl = '';
      if (lid === undefined || lid === '') {
        reqUrl = `${this.baseURL}/api/v${this.V}/Teachers/?type=1&query=null&pageNo=1&pageSize=400`;
      } else {
        reqUrl = `${this.baseURL}/api/v${this.V}/Teachers/?type=2&query=${lid}&pageNo=1&pageSize=400`;
      }
      // console.log(reqUrl);
      axios({
        method: 'get',
        url: reqUrl,
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
      }).then((response) => {
        this.posts = response.data;
        if (this.posts.isSuccess) {
          const allTeachers = JSON.parse(JSON.stringify(this.posts.data.users));
          // console.log('همه دبیر ها', JSON.parse(JSON.stringify(this.posts.data.users)));
          this.makeShortTeacherList(allTeachers);
        } else {
          this.responseFalse = true;
        }
      }, (error) => {
        this.makeToast('error', this.errorHandler(error), 3000);
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
    commaSep(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
    CourseManager,
    Modal,
    VueEditor,
  },
  computed: {
    showAddNow() {
      let san = false;
      if (this.accessesLoaded && this.lessonsLoaded) {
        san = true;
      }
      san = true;
      return san;
    },
    showEdit() {
      if (this.$store.state.courseEdit) {
        this.initAddCourse();
        this.getEditInitData();
      }
      return this.$store.state.courseEdit;
    },
    computedInitImage() {
      let cii = 'none';
      if (this.teacherAdd) {
        return cii;
      }
      cii = this.coursePhoto.data;
      return cii;
    },
    computedModalState() {
      return this.$store.state.modalState;
    },
    computedCardWidth() {
      let ww = '0';
      switch (this.$store.state.courseManagerMode) {
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
        case 'course': {
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
      return this.$store.state.courseManagerMode;
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

.ql-editor{
  user-select: inherit !important;
}
.ql-image{
  display: none !important;
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
    margin-bottom: 16px;
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

.rContainer input{
  display: none;
  transform: scale();
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
