<template>
  <div class="dashboard background">
    <toast />
    <dashboard-page pcontent="1" page="COURSES">
      <!-- course manager  -->
      <card w='80%' minWidth='950px' v-if='this.teacherManage && !this.showEdit'>
        <!-- card header -->
        <div class='fRow fullWidth jStart aStart'>
          <div class='growFull fCol jStart aStart'>
            <h3 class='growFull text-right'>اضافه کردن ویدئو</h3>
            <p class='note'>دوره‌ها را اضافه، حذف، ویرایش و مشاهده کنید.</p>
          </div>
          <btn fabBtn='true' label='اضافه کردن' bc='#61187A'
            icon='add' @click.native="teacherAddToggle"/>
          <btn fabBtn='true' label='به روز رسانی' bc='#9a9a9a'
            style="margin-right: 8px !important;"
            icon='loop' @click.native="refreshAll"/>
        </div>
        <empty-bar v-if="false" w='100%' h='152px'
          msg='هیچ دوره‌ای ثبت نشده'/>
        <error-bar v-if="false" w='100%' h='152px'
          :msg='errorMsg'/>
        <progress-bar v-if="false" w='100%' h='160px'
          msg='لطفا صبر کنید'/>
      </card>
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
import Toast from '@/components/Toast.vue';
import ticks from '@/mixins/ticks';
import ProgressBar from '@/components/ProgressBar.vue';
import ErrorBar from '@/components/ErrorBar.vue';
import EmptyBar from '@/components/EmptyBar.vue';
// import axios from 'axios';

export default {
  mixins: [errorHandler, makeToast, ticks],
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
      search: { data: 'استوکیومتری' },
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
      courseTitle: { data: 'دوره آموزش دین و زندگی' },
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
      tDescription: { data: '<h1>Some initial content</h1>' },
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
  methods: {},
  mounted() {},
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
  },
  computed: {},
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
