<template>
  <div class="gradeRow fullWidth fCol aStart jStart"
  v-bind:class="{opened: expanded}" v-bind:style="{height: boxHeight + 'px'}">
  <!-- لودینک روی بار ↓ -->
    <div v-bind:class="{open: whileLoading}" class="load fCol aCenter jCenter">
      <i class="material-icons-round fCol aCenter jCenter">loop</i>
    </div>
    <div class="arrow" v-bind:class="{open: expanded}">
      <i class="material-icons-round">keyboard_arrow_down</i>
    </div>
    <!-- main item renders s here ↓ -->
    <teacher-item
      :name="this.teacher.firstName"
      :lname="this.teacher.lastName"
      :id="this.teacher.id"
      :status='this.teacher.status'
      :lock='this.teacher.lockoutEnable'
      :access='this.teacher.accessId'
      :username="this.teacher.username"
      :phone="this.teacher.mobile"
      :summary="this.teacher.summary"
      :avatar="this.teacher.avatar"
      :description="this.teacher.description"
      :lessonIds="this.teacher.lessonIds"
      :loginAt="this.teacher.loginAt"
      :indx="this.index"
      @showTeacherInfo='manageTeacherInfo($event)'
      @closeRow='closeThisRow'
    />
    <!-- expand list render here ↓ -->
    <div v-if="expanded" id="expnd" class="expandList fullWidth fRow wrap jBetween aStart">
      <div class="firstCol w66 fRow jStart aStart wrap">
        <div class="w25 fCol jCenter aStart">
          <p class="note">تاریخ ایجاد</p>
          <!-- eslint-disable-next-line -->
          <span class="item">{{this.displayTime(this.tCreateDate).DD}} {{this.displayTime(this.tCreateDate).MN}} {{this.displayTime(this.tCreateDate).YY}}
          </span>
          <!-- eslint-disable-next-line -->
          <span class="item mini">{{this.displayTime(this.tCreateDate).H}}:{{this.displayTime(this.tCreateDate).M}}</span>
        </div>
        <div class="w25 fCol jCenter aStart">
          <p class="note">تاریخ ویرایش</p>
          <!-- eslint-disable-next-line -->
          <span class="item">{{this.displayTime(this.tModifiedDate).DD}} {{this.displayTime(this.tModifiedDate).MN}} {{this.displayTime(this.tModifiedDate).YY}}
          </span>
          <!-- eslint-disable-next-line -->
          <span class="item mini" v-if='this.tModifiedDate === 0'>ویرایش نشده</span>
          <!-- eslint-disable-next-line -->
          <span class="item mini" v-if='this.tModifiedDate !== 0'>{{this.displayTime(this.tModifiedDate).H}}:{{this.displayTime(this.tModifiedDate).M}}</span>
        </div>
        <div class="w25 fCol jCenter aStart">
          <p class="note">امتیاز</p>
          <span class="item">{{tScore}}</span>
        </div>
        <div class="w25 fCol jCenter aStart">
          <p class="note">تعداد دوره ها</p>
          <span class="item">{{tTrainings}}</span>
        </div>
        <div class="sepLine"></div>
        <div class="w50 fCol jStart aStart">
          <p class="note">توضیحات خلاصه</p>
          <span class="item">{{tSummary}}</span>
        </div>
        <div class="w50 fCol jStart aStart">
          <p class="note">توضیحات کامل</p>
          <span class="item">{{tDescription}}</span>
        </div>
      </div>
      <div class="firstCol w33">
        <div class="fullWidth fRow jStart aStart wrap">
          <p class="note fullWidth" style="margin-bottom: 8px">لیست دروس مربوط</p>
          <span class="item lesson" v-for="item in tLessons" v-bind:key='item.id'>
            {{item.title}} {{item.gradeName}} {{sayFieldName(item.field)}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TeacherItem from '@/components/teacher/TeacherItem.vue';
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
      expanded: false,
      whileLoading: false,
      reqGradeName: '',
      reqGradeField: '',
      boxHeight: 100,
      t: [],
      tCreateDate: '',
      tScore: 0,
      tTrainings: 0,
      tLessons: [],
      tModifiedDate: '',
      tSummary: '',
      tDescription: '',
      // permissionData: [],
      // permissionsData: [],
      // isPermissionsLoaded: false,
      baseURL: this.$store.state.baseUrl,
      V: this.$store.state.apiVersion,
    };
  },
  props: ['teacher', 'index'],
  components: {
    TeacherItem,
  },
  methods: {
    closeThisRow() {
      this.expanded = false;
      this.boxHeight = 96;
      this.expndHeight = 72;
    },
    manageTeacherInfo(event) {
      this.t = event.teacher;
      if (event.order === 'open') {
        this.expandRow(this.t);
      }
    },
    expandRow(e) {
      // const expaand = document.getElementById('expnd');
      // console.log(e.id);
      if (true) {
        if (this.expanded) {
          this.expanded = false;
          this.boxHeight = 96;
          this.expndHeight = 72;
        } else {
          // open
          // this.displayTime(e.createdAt);
          this.tCreateDate = e.createdAt;
          this.tModifiedDate = e.modifiedAt;
          this.tScore = e.score;
          this.tTrainings = e.numberOfTrainingsOfThisTeacher;
          this.tSummary = e.summary;
          this.tDescription = e.description;
          axios({
            method: 'post',
            url: `${this.baseURL}/api/v${this.V}/Lessons/Ids`,
            headers: {
              Authorization: this.$authObeject.authToken(),
            },
            data: {
              lessonsId: e.lessonIds,
            },
          }).then((response) => {
            // JSON responses are automatically parsed.
            this.posts = response.data;
            if (response.data.isSuccess) {
              // console.log(response.data.data);
              this.tLessons = response.data.data;
            }
            // console.log(this.permissionsArray);
          }, (error) => {
            this.whileLoading = false;
            this.makeToast('error', this.errorHandler(error), 2000);
          });
          this.expanded = true;
          this.expndHeight = 72;
          this.boxHeight = 346;
        }
      }
    },
    getPermissions() {
      if (false) {
        // اگر بسته بود
        if (this.expanded === false) {
          // اگر زیر مجموعه داست
          if (this.permissionObject.hasChild) {
            this.whileLoading = true;
            const perid = this.permissionObject.id;
            axios({
              method: 'get',
              headers: {
                Authorization: this.$authObeject.authToken(),
              },
              url: `${this.baseURL}/api/v${this.V}/Permissions?parentId=${perid}`,
            }).then((response) => {
              // JSON responses are automatically parsed.
              this.posts = response.data;
              if (response.data.isSuccess) {
                this.permissionsData = JSON.parse(JSON.stringify(this.posts.data));
                this.whileLoading = false;
                if (this.permissionObject.hasChild) {
                  this.expandRow();
                }
              }
              // console.log(this.permissionsArray);
            }, (error) => {
              this.whileLoading = false;
              this.makeToast('error', this.errorHandler(error), 2000);
            });
          }
        } else {
          this.expandRow();
        }
      }
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
  },
  mounted() {
    // console.log(this.displayTime(637397754760853000));
    // this.permissionData = this.permissionObject;
    // const p = JSON.parse(JSON.stringify(this.permissionObject));
    // this.permissionData = p.data[0].permission;
    // this.permissionsData = JSON.parse(JSON.stringify(p.data[1].permissions[0]));
    // this.pTtl = p.data[0].permission.title;
    // this.isDataLoaded = true;
    // console.log('hey', this.teacher);
    // console.log(this.teacher.lockoutEnable);
  },
};
</script>

<style lang="scss" scoped>
.note{
  padding: 4px 8px;
  font-size: 10px;
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

.gradeRow .arrow{
  position: absolute;
  top: 72px;
  display: none;
  right: 8px;
  height: 16px;
  width: 16px;
  transition: all cubic-bezier(0.5, 0, 0, 1) 0.3s;
  pointer-events: none;
}

.arrow i{
  font-size: 16px;
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
  height: 72px;
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
