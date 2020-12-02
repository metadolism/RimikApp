<template>
  <div class="dashboard background">
    <toast />
    <dashboard-page pcontent="1" page="COURSES">
      <!-- course manager  -->
      <card w='80%' minWidth='950px' v-if='true'>
        <!-- card header -->
        <div class='fRow fullWidth jStart aCenter'>
          <div class='growFull fCol jStart aStart'>
            <h3 class='growFull text-right'>اضافه کردن ویدئو</h3>
            <p class='note'>اضافه و حذف ویدئوهای «{{this.cName}}»</p>
          </div>
          <btn isMini='true' label='بازگشت به دوره‌ها' bc='#667089'
            style="margin: 8px !important;"
            icon='keyboard_arrow_left' @click.native="backToCourse"/>
        </div>
        <div class="courseInfoHolder fRow jStart aCenter fullWidth">
          <img :src="`${this.baseURL}/photo/${this.cPhoto}`"
            :alt="this.cName" class="c">
          <div class="fCol jCenter aStart infos growFull">
            <div class="courseName">{{this.cName}}</div>
            <div class="courseId">{{this.cId}}</div>
            <div class="fRow jStart aCenter fullWidth teacherHolder">
              <img :src="`${this.baseURL}/photo/${this.teacherImg}`" alt="" class="t">
              <div class="fCol growFull jStart aStart">
                <!-- eslint-disable-next-line -->
                <div class="courseTeacher">{{this.cTeacher}}</div>
                <div class="courseLesson">{{this.cLesson}}</div>
              </div>
            </div>
            <div class="courseSummary">{{this.cSummary}}</div>
          </div>
          <div class="counter fRow jCenter aCenter wrap">
            <i class="material-icons-round">duo</i>
            <label>{{this.cVideoCount}}</label>
            <span class="fullWidth">ویدئوهای این دوره</span>
          </div>
        </div>
        <div class="tabHeader fRow jCenter aCenter fullWidth" id="tab">
          <a @click="toggleUploader('upload')"
            class="tabBtn fRow jCenter aCenter
            w33 transition-fast" v-bind:class="{selected: uploaderShow}">
            <i class="material-icons-round transition-fast">backup</i>
            <span class="transition-fast">آپلود ویدئوی جدید</span>
          </a>
          <a @click="toggleUploader('list')"
            class="tabBtn fRow jCenter aCenter
            w33 transition-fast" v-bind:class="{selected: !uploaderShow}">
            <i class="material-icons-round transition-fast">movie_creation</i>
            <span class="transition-fast">نمایش ویدئوهای دوره</span>
          </a>
        </div>
        <!-- آپلودر ها اینجا نشون داده میشن -->
        <div class="uploadersHolder fCol jStart aCenter fullWidth"
          v-if='uploaderShow' id="uploaders">
          <div class="rules fullWidth fRow jStart aStart wrap">
            <h3>قوانین و مقررات آپلود فایل</h3>
            <div class="ruleBox fCol jStart aStart w25">
              <h4>حجم ویدئو</h4>
              <p>حجم فایل باید زیر 1 گیگابایت باشد.</p>
              <p>برای بهبود سرعت آپلود حتماً فیلترشکن خود را قطع کنید.</p>
            </div>
            <div class="ruleBox fCol jStart aStart w25">
              <h4>ابعاد ویدئو</h4>
              <p>ویدئوها باید دارای نسبت طول به ارتفاع 16:9 باشد.</p>
              <p class="ltr">برای مثال 1080 × 1920  یا  720 × 1280</p>
            </div>
            <div class="ruleBox fCol jStart aStart w25">
              <h4>فرمت‌های مجاز</h4>
              <p>فرمت‌های مجاز برای ویدئو .MP4 و .webM می‌باشند.</p>
            </div>
            <div class="ruleBox fCol jStart aStart w25">
              <h4>تعداد ویدئو</h4>
              <p>شما می‌توانید با توجه به سرعت اینترنت،
                به تعداد دلخواه ویدئو به صورت همزمان آپلود کنید.</p>
            </div>
          </div>
          <uploader v-for="(item, index) in uploaderArray" v-bind:key="item.id"
            :id='`uploader${index}`' :uploaderId='index'
            :course='cName' :courseId='cId'
            @fileSelected='addNewUploader'/>
        </div>
        <!-- نمایش ویدئوهای دوره -->
        <div class="videoList fRow jBetween aStart fullWidth wrap ltr"
          id='list' v-if="!uploaderShow">
          <div class="rules fullWidth fRow jStart aStart wrap">
            <h3>لیست ویدئو‌های «{{this.cName}}»</h3>
            <div class="ruleBox fCol jStart aStart w20">
              <h4>فیلتر لیست</h4>
              <p>لیست ویدئو را فیلتر کنید</p>
            </div>
            <div class="ruleBox fCol jStart aStart w40">
              <h4>بر اساس عنوان</h4>
              <input type="text" placeholder="عنوان ویدئوی مورد نظر">
            </div>
            <div class="ruleBox fCol jStart aStart w20">
              <h4>شماره قسمت</h4>
              <input type="number" placeholder="قسمت">
            </div>
            <div class="ruleBox fCol jStart aStart w20">
              <h4>وضعیت</h4>
            </div>
          </div>
          <div class="w33 fCol jStart aCenter">
            <video-item />
          </div>
          <div class="w33 fCol jStart aCenter">
            <video-item />
          </div>
          <div class="w33 fCol jStart aCenter">
            <video-item />
          </div>
          <div class="w33 fCol jStart aCenter">
            <video-item />
          </div>
        </div>
        <empty-bar v-if="false" w='100%' h='152px' msg='هیچ دوره‌ای ثبت نشده'/>
        <error-bar v-if="false" w='100%' h='152px' :msg='errorMsg'/>
        <progress-bar v-if="false" w='100%' h='160px' msg='لطفا صبر کنید'/>
      </card>
    </dashboard-page>
    <tool-bar/>
    <right-menu/>
    <modal v-if="modalShow">
      <card w="580px">
        <label class="question">با ترک این صفحه آپلودها متوقف می‌شوند.
          آیا مایل به ترک این صفحه هستید؟</label>
        <div class="fullWidth wrap aStart jStart fRow btnRow">
          <btn label="نمایش لیست ویدئوها" btnWidth='236px' bc='#ff0533'
          icon="delete_sweep" @click.native="showListAnyWay"/>
          <keep-alive>
            <btn fabBtn='true' label="بازگشت" btnWidth='auto'
              @click.native="closeModal" bc='#aaaaaa' icon="close"/>
          </keep-alive>
        </div>
      </card>
    </modal>
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
import Uploader from '@/components/Uploader.vue';
import VideoItem from '@/components/VideoItem.vue';
import Modal from '@/components/Modal.vue';
import axios from 'axios';

export default {
  mixins: [errorHandler, makeToast, ticks],
  data() {
    return {
      baseURL: this.$store.state.baseUrl,
      V: this.$store.state.apiVersion,
      teacherId: this.$store.state.courseObject.TeacherId,
      cName: this.$store.state.courseObject.Name,
      cId: this.$store.state.courseObject.Id,
      cPhoto: this.$store.state.courseObject.Photo,
      cTeacher: this.$store.state.courseObject.Teacher,
      cLesson: this.$store.state.courseObject.Lesson,
      cSummary: this.$store.state.courseObject.Summary,
      cVideoCount: this.$store.state.courseObject.Videos,
      teacherImg: '',
      uploaderCount: 1,
      uploaderArray: ['1'],
      uploaderShow: true,
      isVideoUploading: false,
      modalShow: false,
    };
  },
  methods: {
    backToCourse() {
      this.$store.commit('resetCourseObject');
      this.$router.push('/courses');
    },
    getTeacherPhoto() {
      const reqUrl = `${this.baseURL}/api/v${this.V}/Teachers/${this.teacherId}`;
      axios({
        method: 'get',
        url: reqUrl,
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
      }).then((response) => {
        this.posts = response.data;
        if (this.posts.isSuccess) {
          // console.log(this.posts);
          this.teacherImg = this.posts.data.user.avatar;
        } else {
          this.responseFalse = true;
        }
      }, (error) => {
        this.makeToast('error', this.errorHandler(error), 3000);
      });
    },
    addNewUploader() {
      // alert(event);
      this.isVideoUploading = true;
      this.uploaderCount += 1;
      this.uploaderArray.push(this.uploaderCount.toString());
    },
    closeModal() {
      this.modalShow = false;
    },
    showListAnyWay() {
      this.isVideoUploading = false;
      this.modalShow = false;
      this.toggleUploader('list');
    },
    toggleUploader(order) {
      switch (order) {
        case 'upload': {
          this.uploaderShow = true;
          break;
        }
        case 'list': {
          if (this.isVideoUploading) {
            // this.makeToast('warning', 'ویدئو ها چی؟', 2500);
            this.modalShow = true;
            return;
          }
          this.uploaderShow = false;
          this.uploaderArray = ['1'];
          this.uploaderCount = 1;
          break;
        }
        default:
          break;
      }
    },
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
    Uploader,
    VideoItem,
    Modal,
  },
  computed: {},
  mounted() {
    if (this.cId === '') {
      this.$router.push('/courses');
    }
    this.getTeacherPhoto();
  },
};
</script>

<style lang="scss" scoped>
  .counter{
    min-width: 96px;
  }
  .counter label{
    font-weight: bold;
    margin-right: 8px;
    font-size: 32px;
    color: rgba($color: #363636, $alpha: 1.0);
  }
  .counter span{
    font-weight: 100;
    font-size: 12px;
    color: rgba($color: #363636, $alpha: 1.0);
  }
  .courseInfoHolder {
    padding: 24px;
    margin-bottom: 24px;
    border-bottom: dashed 1px rgba($color: #000000, $alpha: 0.2);
  }
  $iw: 204px;
  .courseInfoHolder img.c{
    width: $iw;
    height: $iw;
    border-radius: 8px;
  }
  .infos{
    padding: 0 24px;
  }
  .courseInfoHolder .courseName{
    font-size: 28px;
    word-spacing: -2px;
    font-weight: 400;
  }
  .courseInfoHolder .courseTeacher{
    font-size: 16px;
    word-spacing: -2px;
    font-weight: 400;
  }
  .courseInfoHolder .courseLesson{
    font-size: 13px;
    word-spacing: 0px;
    font-weight: 400;
  }
  .courseId{
    padding: 2px 8px;
    font-size: 10px;
    margin-bottom: 16px;
    letter-spacing: 2px;
    border-right: solid 2px rgba($color: #000000, $alpha: 0.2);
  }
  .courseSummary{
    padding: 16px 8px 8px;
    font-size: 12px;
    margin-bottom: 16px;
    text-align: right;
    color: #646464;
    border-right: solid 2px rgba($color: #000000, $alpha: 0.2);
  }

  .teacherHolder img.t{
    width: 64px;
    height: 64px;
    margin-left: 8px;
    border-radius: 80px 80px 0 80px;
  }

  .question{
    font-size: 18px;
    font-weight: 300;
    margin-bottom: 16px;
    text-align: right;
  }

  .ltr {
    direction: ltr !important;
  }

  .tabHeader{
    height: 48px;
    position: relative;
    margin-bottom: 24px;
  }

  .tabBtn{
    height: 100%;
    border-radius: 12px;
    background-color: #c79dd63b;
    cursor: pointer;
    padding: 0 18px;
    margin: 0 8px;
  }

  .tabBtn i{
    color: #9a9a9a;
  }

  .tabBtn span{
    padding: 0;
    margin-right: 8px;
    color: #9a9a9a;
    flex-grow: 1;
  }

  .tabBtn.selected{
    background-color: #61187A;
    box-shadow: 0 8px 8px 0 rgba($color: #000000, $alpha: 0.1);
  }

  .tabBtn.selected i{
    color: #ffffff;
  }

  .tabBtn.selected span{
    padding: 0;
    margin-right: 8px;
    color: #ffffff;
  }

  .rules{
    margin: 24px 24px 50px;
  }

  .ruleBox {
    padding: 0 8px;
  }

  .uploadersHolder h3, .videoList h3 {
    width: 100%;
    text-align: right;
    padding: 8px 16px;
    word-spacing: -2px;
    font-size: 20px;
    font-weight: 400;
  }

  .uploadersHolder h4, .videoList h4 {
    width: 100%;
    text-align: right;
    padding: 8px 16px;
    word-spacing: -2px;
    font-size: 14px;
    font-weight: 200;
    position: relative;
  }

  .uploadersHolder h4::before, .videoList h4::before{
    position: absolute;
    content: ' ';
    border-radius: 50%;
    width: 8px;
    height: 8px;
    background-color: royalblue;
    left: calc(100% - 8px);
    top: 50%;
    transform: translateY(-50%);
  }

  .uploadersHolder p, .videoList p {
    width: 100%;
    text-align: right;
    padding: 0px 16px;
    word-spacing: -1px;
    font-size: 12px;
    font-weight: 200;
    margin: 0 0 4px 0;
    position: relative;
  }

  .uploadersHolder p::before, .videoList p::before{
    position: absolute;
    content: ' ';
    border-radius: 50%;
    width: 8px;
    height: 8px;
    background-color: rgba(65, 105, 225, 0.301);
    left: calc(100% - 8px);
    top: 5px;
  }

  input[type="text"], input[type='number'] {
    border-radius: 4px;
    border: solid 1px rgba($color: #000000, $alpha: 0.2);
    padding: 4px 8px;
    font-size: 13px;
    font-weight: 200;
    width: 100%;
  }
</style>
