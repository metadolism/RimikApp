<template>
  <div class="gradeRow fullWidth fCol aStart jStart"
  v-bind:class="{opened: expanded}" v-bind:style="{height: boxHeight + 'px'}">
  <!-- لودینک روی بار ↓ -->
    <div v-bind:class="{open: !nowShowRow}" class="load fCol aCenter jCenter">
      <i class="material-icons-round fCol aCenter jCenter">loop</i>
    </div>
    <div class="arrow" v-bind:class="{open: expanded}">
      <i class="material-icons-round fCol jCenter aCenter">keyboard_arrow_down</i>
    </div>
    <!-- main item renders s here ↓ -->
    <course-item
      :lessonId="this.course.lessonId"
      :lessonName="this.lessonFullName"
      :teacherId="this.course.teacherId"
      :teachername="this.teachername"
      :photo="this.course.photo"
      :title="this.course.title"
      :summary="this.course.summary"
      :description="this.course.description"
      :discountPercent="this.course.discountPercent"
      :price="this.course.price"
      :score="this.course.score"
      :status="this.course.status"
      :state="this.course.state"
      :duration="this.course.duration"
      :numberOfVideos="this.course.numberOfVideos"
      :id="this.course.id"
      :createdAt="this.course.createdAt"
      :modifiedAt="this.course.modifiedAt"
      :indx="this.index"
      class="transition-slow"
      v-bind:class="{blur: !nowShowRow}"
      @toggleRow='expandRow($event)'
    />
    <!-- expand list render here ↓ -->
    <div v-if="expanded" id="expnd" class="expandList fullWidth fRow wrap jBetween aStart">
      <div class="firstCol fullWidth fRow jStart aStart wrap">
        <div class="w20 fCol jCenter aStart">
          <p class="note">تاریخ ایجاد</p>
          <!-- eslint-disable-next-line -->
          <span class="item">{{this.displayTime(this.course.createdAt).DD}} {{this.displayTime(this.course.createdAt).MN}} {{this.displayTime(this.course.createdAt).YY}}
          </span>
          <!-- eslint-disable-next-line -->
          <span class="item mini">{{this.displayTime(this.course.createdAt).H}}:{{this.displayTime(this.course.createdAt).M}}</span>
        </div>
        <div class="w20 fCol jCenter aStart">
          <p class="note">تاریخ ویرایش</p>
          <!-- eslint-disable-next-line -->
          <span class="item">{{this.displayTime(this.course.modifiedAt).DD}} {{this.displayTime(this.course.modifiedAt).MN}} {{this.displayTime(this.course.modifiedAt).YY}}
          </span>
          <!-- eslint-disable-next-line -->
          <span class="item mini" v-if='this.course.modifiedAt === 0'>ویرایش نشده</span>
          <!-- eslint-disable-next-line -->
          <span class="item mini" v-if='this.course.modifiedAt !== 0'>{{this.displayTime(this.course.modifiedAt).H}}:{{this.displayTime(this.course.modifiedAt).M}}</span>
        </div>
        <div class="w20 fCol jCenter aStart">
          <p class="note">قیمت</p>
          <!-- eslint-disable-next-line -->
          <span class="item">{{this.commaSep(this.course.price)}} تومان</span>
        </div>
        <div class="w20 fCol jCenter aStart">
          <p class="note">تخفیف</p>
          <span class="item mini" v-if="this.course.discountPercent === 0"
            >بدون تخفیف</span>
          <span class="item" v-if="this.course.discountPercent !== 0"
            >{{this.course.discountPercent}}%</span>
        </div>
        <div class="w20 fCol jCenter aStart">
          <p class="note">مدت دوره</p>
          <span class="item">{{this.course.duration}}</span>
        </div>
        <div class="w20 fCol jCenter aStart">
          <p class="note">تعداد ویدئو‌ها</p>
          <span class="item" v-if="this.course.numberOfVideos !== 0"
            >{{this.course.numberOfVideos}} ویدئو</span>
          <span class="item mini" v-if="this.course.numberOfVideos === 0"
            >بدون ویدئو</span>
        </div>
        <div class="w20 fCol jCenter aStart">
          <p class="note">تعداد پرسش</p>
          <span class="item" v-if="this.course.numberOfQuestions !== 0"
            >{{this.course.numberOfQuestions}} پرسش</span>
          <span class="item mini" v-if="this.course.numberOfQuestions === 0"
            >بدون پرسش</span>
        </div>
        <div class="w20 fCol jCenter aStart">
          <p class="note">تعداد بازدید</p>
          <span class="item" v-if="this.course.numberOfViews !== 0"
            >{{this.course.numberOfViews}} بازدید</span>
          <span class="item mini" v-if="this.course.numberOfViews === 0"
            >بدون بازدید</span>
        </div>
        <div class="w20 fCol jCenter aStart">
          <p class="note">تعداد خرید</p>
          <span class="item" v-if="this.course.numberOfPurchases !== 0"
            >{{this.course.numberOfPurchases}} مرتبه</span>
          <span class="item mini" v-if="this.course.numberOfPurchases === 0"
            >بدون خرید</span>
        </div>
        <div class="w20 fCol jCenter aStart">
          <p class="note">امتیاز دوره</p>
          <span class="item">{{this.course.score}} از 5</span>
        </div>
        <div class="sepLine"></div>
        <div class="w50 fCol jStart aStart">
          <p class="note">توضیحات خلاصه</p>
          <span class="item">{{this.course.summary}}</span>
        </div>
        <div class="w50 fCol jStart aStart">
          <p class="note">توضیحات کامل</p>
          <span class="item fCol jStart aStart fullWidth">
            <div class="showDescBtn primary"
            @click="showDesc = showDesc = true">مشاهده توضیحات کامل</div>
          </span>
        </div>
      </div>
    </div>
    <div class="descHolder fCol jCenter aCenter" v-if="showDesc">
      <div class="descCloser" @click="showDesc = !showDesc"></div>
      <div class="descBox" ref="desc" v-html="renderEl()"></div>
    </div>
  </div>
</template>

<script>
import CourseItem from '@/components/course/CourseItem.vue';
import errorHandler from '@/mixins/mixin';
import makeToast from '@/mixins/makeToast';
import ticks from '@/mixins/ticks';
import axios from 'axios';

export default {
  mixins: [errorHandler,
    makeToast,
    ticks],
  data() {
    return {
      customToolbar: [
        [],
      ],
      test: '<a href="https://google.com">کلیک کنید</a>',
      des: 'salam',
      expanded: false,
      whileLoading: false,
      reqGradeName: '',
      reqGradeField: '',
      boxHeight: 172,
      t: [],
      showDesc: false,
      // permissionData: [],
      // permissionsData: [],
      // isPermissionsLoaded: false,
      lCourse: false,
      lTeacher: false,
      lLesson: false,
      // load flags↑
      teachername: '',
      lessonFullName: '',
      baseURL: this.$store.state.baseUrl,
      V: this.$store.state.apiVersion,
    };
  },
  props: ['course', 'index'],
  components: {
    CourseItem,
  },
  methods: {
    renderEl() {
      return this.course.description;
    },
    closeThisRow() {
      this.expanded = false;
      this.boxHeight = 96;
      this.expndHeight = 72;
    },
    expandRow(e) {
      // const expaand = document.getElementById('expnd');
      // console.log(e.id);
      if (e === 'close') {
        this.expanded = false;
        this.boxHeight = 172;
        this.expndHeight = 72;
      } else {
        // open
        this.expanded = true;
        this.expndHeight = 172;
        this.boxHeight = 496;
      }
    },
    getTeacherName() {
      axios({
        method: 'get',
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
        url: `${this.baseURL}/api/v${this.V}/Teachers/${this.course.teacherId}`,
      }).then((response) => {
        // JSON responses are automatically parsed.
        this.posts = response.data;
        if (response.data.isSuccess) {
          this.teachername = `${this.posts.data.user.firstName} ${this.posts.data.user.lastName}`;
          // console.log('course row - ', this.teachername);
          this.lTeacher = true;
        }
        // console.log(this.permissionsArray);
      }, (error) => {
        this.lTeacher = true;
        this.teachername = 'بارگزاری نشد';
        this.makeToast('error', this.errorHandler(error), 2000);
      });
    },
    getLessonName() {
      const l = [];
      l.push(this.course.lessonId);
      // console.log('█', l);
      axios({
        method: 'post',
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
        url: `${this.baseURL}/api/v${this.V}/Lessons/ids`,
        data: {
          lessonsId: l,
        },
      }).then((response) => {
        // JSON responses are automatically parsed.
        this.posts = response.data;
        if (response.data.isSuccess) {
          // eslint-disable-next-line
          this.lessonFullName = `${this.posts.data[0].title} ${this.posts.data[0].gradeName} (${this.sayFieldName(this.posts.data[0].field)})`;
          // console.log('course row - ', this.lessonFullName);
          this.lLesson = true;
        }
        // console.log(this.permissionsArray);
      }, (error) => {
        this.lessonFullName = 'بارگزاری نشد';
        this.makeToast('error', this.errorHandler(error), 2000);
        this.lLesson = true;
      });
    },
    getGrades(f) {
      this.isDataLoad = false;
      this.responseFalse = false;
      this.responseEmpty = false;
      this.responseError = false;
      this.responseLoad = true;
      const reqUrl = `${this.baseURL}/api/v${this.V}/Grades/${f}`;
      axios({
        method: 'get',
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
        url: reqUrl,
      }).then((response) => {
        // JSON responses are automatically parsed.
        this.responseLoad = false;
        this.posts = response.data;
        if (this.posts.isSuccess) {
          // this.makeToast('info', 'اطلاعات پایه های تحصیلی با موفقیت دریافت شد', 2000);
          this.responseFalse = false;
          // اگه درست بود همه چی
          this.isDataLoad = true;
          this.reqGradeName = response.data.data.title;
          switch (response.data.data.field) {
            case 1: {
              this.reqGradeField = 'ریاضی و فیزیک';
              break;
            }
            case 2: {
              this.reqGradeField = 'علوم تجربی';
              break;
            }
            case 3: {
              this.reqGradeField = 'علوم انسانی';
              break;
            }
            case 4: {
              this.reqGradeField = 'فنی و حرفه ای';
              break;
            }
            case 5: {
              this.reqGradeField = 'هنر';
              break;
            }
            case 6: {
              this.reqGradeField = 'زبان';
              break;
            }
            default:
              break;
          }
          // alert(this.reqGradeName);
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
    commaSep(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    createElementFromHTML() {
      const div = document.createElement('div');
      div.innerHTML = this.course.description.trim();
      // Change this to div.childNodes to support multiple top-level nodes
      // console.log(div.firstChild);
      this.des = div;
      this.$refs.desc.append(div);
      // return div.firstChild;
    },
  },
  computed: {
    nowShowRow() {
      return this.lTeacher && this.lLesson;
    },
  },
  watch: {
    nowShowRow() {
      setTimeout(() => {
        // this.createElementFromHTML();
      }, 400);
    },
  },
  mounted() {
    this.getTeacherName();
    this.getLessonName();
  },
};
</script>

<style lang="scss" scoped>
.descBox *{
  text-align: right !important;
}
.note{
  padding: 4px 8px;
  font-size: 10px;
}

.descHolder{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 5000000000;
}

.descHolder .descCloser{
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.274);
  z-index: 30000000000;
}

.descHolder .descBox{
  padding: 24px;
  width: calc(100% - 326px);
  max-height: calc(100vh - 128px);
  border-radius: 8px;
  box-shadow: 0 16px 32px 0 rgba($color: #000000, $alpha: 0.5);
  background-color: white;
  z-index: 40000000000;
  overflow: hidden auto;
}

.showDescBtn{
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 8px;
  color: white;
  box-shadow: 0 4px 4px 0 rgba($color: #000000, $alpha: 0.2);
  cursor: pointer;
}
.item{
  padding: 4px 8px;
  margin-right: 8px;
  font-size: 13px;
  font-weight: 500;
  text-align: right;
  border-right: solid 1px rgba($color: #000000, $alpha: 0.15);
}
.item.mini{
  padding: 0px 8px;
  font-size: 10px;
  font-weight: 500;
  text-align: right;
}

.item.lesson{
  border-radius: 64px;
  font-size: 10px;
  font-size: bold;
  background-color: white;
  margin: 0 0 4px 4px;
}
.gradeRow.opened{
    background-color: rgba($color: #000000, $alpha: 0.05) !important;
    margin: 8px 0px;
    border-right: solid 2px #00000069;
    overflow: hidden;
    border-radius: 0px !important;
}

.blur{
  filter: blur(8px);
}

.gradeRow .arrow{
  position: absolute;
  top: 78px;
  right: 8px;
  height: 16px;
  width: 16px;
  transition: all cubic-bezier(0.5, 0, 0, 1) 0.3s;
  pointer-events: none;
}

.arrow i{
  font-size: 10px;
  opacity: 0.3;
  width: 16px;
  height: 16px;
}

.arrow.open {
  transform: rotate(-180deg);
}

.expandList{
    transform-origin: top center;
    flex-grow: 1;
    overflow: hidden;
    background-color: rgba($color: #000000, $alpha: 0.05);
    transition: all cubic-bezier(0.5,0,0,1) 0.5s;
}

.gradeRow {
  transition: all cubic-bezier(0.5,0,0,1) 0.5s;
  border-radius: 0px;
  overflow: auto;
  position: relative;
  height: 96px;
  margin: 4px 0px;
  border-right: solid 2px #00000023;
}

.gradeRow .load{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  display: none;
  z-index: 3000;
  background-color: rgba(255, 255, 255, 0.747);
}

.load.open {
  display: flex;
}

.load i{
  width: 16px;
  height: 16px;
  display: flex;
  border-radius: 50%;
  background-color: rgba($color: #000000, $alpha: 0.25);
  font-size: 12px;
  animation: loadi infinite cubic-bezier(1,0,0,1) 1s;
}

@keyframes loadi{
  0%{
    box-shadow: 0 0 0 8px rgba($color: #000000, $alpha: 0.05);
    transform: rotate(0deg);
  }
  50%{
    box-shadow: 0 0 0 16px rgba($color: #000000, $alpha: 0.15);
  }
  100%{
    box-shadow: 0 0 0 8px rgba($color: #000000, $alpha: 0.05);
    transform: rotate(-360deg);
  }
}

</style>
