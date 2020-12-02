<template>
  <div class="gRow fRow jBetween aCenter fullWidth">
    <span class="index">{{ indx }}</span>
    <div class="tableHead itemImg big">
      <img
        :src="courseImage"
        :alt="`تصویر ${this.title}`"
        :title="`تصویر ${this.title}`"
      />
    </div>
    <div class="tableHead title big fCol aStart jCenter">
      <div class="teacherName">{{ title }}</div>
      <div class="fRow jStart aCenter infoItemHolder">
        <i class="material-icons-round miniIcon">menu_book</i>
        <div class="teacherUsername">{{ lessonName }}</div>
      </div>
      <div class="fRow jStart aCenter infoItemHolder">
        <i class="material-icons-round miniIcon">school</i>
        <div class="teacherUsername">{{ teachername }}</div>
      </div>
      <div class="fRow jStart aCenter infoItemHolder">
        <i class="material-icons-round miniIcon">date_range</i>
        <div class="teacherUsername" v-if='this.createdAt !== 0'
          :title='`تاریخ ایجاد دوره: ${this.displayTime(createdAt).full}`'
          >{{ this.displayTime(createdAt).date }}</div>
      </div>
      <!-- <div class="teacherLoginAt" v-if='this.loginAt === 0'>ل</div> -->
      <!-- // eslint-disable-next-line date_range-->
    </div>
    <div class="tableHead state aCenter jCenter fCol">
      <switch-button
        @mouseover.native="disableExpand"
        @click.native="invertState"
        @mouseleave.native="enableExpand"
        :val="this.teacherStatus"
        :load="whileState"
        activeLabel="فعال"
        deactiveLabel="غیرفعال"
      />
    </div>
    <div class="tableHead state aCenter jCenter fCol">
      <switch-button
        @mouseover.native="disableExpand"
        @mouseleave.native="enableExpand"
        @click.native="invertLockout"
        :val="this.teacherLock"
        :load="this.whileStatus"
        activeLabel="رایگان"
        deactiveLabel="رایگان"
      />
    </div>
    <div class="tableHead actions big fRow wrap jCenter aCenter">
      <i
        @mouseover="disableExpand"
        @click="toggleDetaile"
        @mouseleave="enableExpand"
        class="material-icons-round">info</i>
      <i
        @mouseover="disableExpand"
        @click="editCourse"
        @mouseleave="enableExpand"
        class="material-icons-round">edit</i>
      <i
        @mouseover="disableExpand"
        @click="deleteCourse"
        @mouseleave="enableExpand"
        class="material-icons-round">clear</i>
      <div @click="goToVideoUpload"
        class="addVideo fRow jCenter aCenter primary transition-fast">
        <label>اضافه کردن ویدئو</label>
        <i class="material-icons-round">missed_video_call</i>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import SwitchButton from '@/components/SwitchButton.vue';
import ticks from '@/mixins/ticks';
import errorHandler from '@/mixins/mixin';
// che vaze kosSherie
import makeToast from '@/mixins/makeToast';

export default {
  mixins: [errorHandler, makeToast, ticks],
  props: ['lessonId', 'teacherId', 'photo', 'title', 'summary', 'description',
    'discountPercent', 'price', 'score', 'status', 'state', 'teachername', 'lessonName',
    'duration', 'numberOfVideos', 'id', 'indx', 'createdAt', 'modifiedAt', 'page', 'pages'],
  data() {
    return {
      teacherStatus: false,
      teacherLock: false,
      expanded: false,
      expndHeight: 0,
      lessonStatus: false,
      lessonGrade: '',
      lessonField: '',
      tDesc: '',
      tSummary: '',
      lessonsId: [],
      courseImage: `${this.$store.state.baseUrl}/photo/${this.photo}`,
      toggleRow: false,
      whileState: false,
      whileStatus: false,
      baseURL: this.$store.state.baseUrl,
      V: this.$store.state.apiVersion,
    };
  },
  methods: {
    expandRow() {},
    disableExpand() {
      this.$store.commit('disExpand');
      // consolee.log(this.$store.state.letExpand);
    },
    enableExpand() {
      this.$store.commit('enExpand');
      // consolee.log(this.$store.state.letExpand);
    },
    editCourse() {
      // alert(`edit premision id = ${this.perId}`);
      // alert(this.lId);
      this.$store.commit('setWorkOn', 'course');
      this.$store.commit('setCourseEditMode', `${this.id}`);
      this.$store.commit('setCourseName', `${this.title}`);
      // this.$store.commit('openLessonCard', this.id);
    },
    deleteCourse() {
      // console.log(`delete premision id = ${pid}`);
      this.$store.commit('setWorkOn', 'course');
      this.$store.commit('openCourseCard', this.id);
      this.$store.commit('setCourseDeleteMode', `${this.title}`);
    },
    // عوض کردن وضعیت
    invertState() {
      // alert('change teacher state');
      this.whileStatus = true;
      let tempState = 0;
      // console.log('teacherStatus', this.teacherStatus);
      // alert(this.id);
      this.whileState = true;
      if (this.teacherStatus) {
        tempState = 2;
      } else {
        tempState = 1;
      }
      let courseState = 0;
      if (!this.teacherLock) {
        courseState = 1;
      } else {
        courseState = 2;
      }
      // console.log(`${this.access} - ${this.name}
      // - ${this.lessonIds}`);
      axios({
        method: 'patch',
        url: `${this.baseURL}/api/v${this.V}/Courses/${this.id}`,
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
        data: {
          Status: tempState,
          State: courseState,
        },
      }).then(
        (response) => {
          this.whileState = false;
          if (response.data.isSuccess) {
            this.whileStatus = false;
            // alert(response);
            this.teacherStatus = !this.teacherStatus;
            if (this.teacherStatus) {
              this.makeToast('success', 'دبیر مورد نظر فعال شد', 2000);
            } else {
              this.makeToast('success', 'دبیر مورد نظر غیرفعال شد', 2000);
            }
          }
        },
        (error) => {
          this.whileStatus = false;
          // console.log(error);
          this.makeToast('error', this.errorHandler(error), 2000);
        },
      );
    },
    goToVideoUpload() {
      this.$store.commit('setVideoUploaderData', {
        Id: this.id,
        Name: this.title,
        Teacher: this.teachername,
        Summary: this.summary,
        Photo: this.photo,
        Lesson: this.lessonName,
        TeacherId: this.teacherId,
        Videos: this.numberOfVideos,
      });
      this.$router.push('/videoUpload');
    },
    // عوض کردن lockout
    invertLockout() {
      let tempState = 0;
      if (!this.teacherStatus) {
        tempState = 2;
      } else {
        tempState = 1;
      }
      let courseState = 0;
      if (!this.teacherLock) {
        courseState = 1;
      } else {
        courseState = 2;
      }
      // console.log('lockout', this.teacherLock);
      axios({
        method: 'patch',
        url: `${this.baseURL}/api/v${this.V}/Courses/${this.id}`,
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
        data: {
          Status: tempState,
          State: courseState,
        },
      }).then(
        (response) => {
          if (response.data.isSuccess) {
            // console.log(response);
            this.teacherLock = !this.teacherLock;
            if (this.teacherLock) {
              this.makeToast('success', 'دسترسی دبیر مورد بلاک شد', 2000);
            } else {
              this.makeToast('success', 'دسترسی دبیر مورد نظر آنبلاک شد', 2000);
            }
          }
        },
        (error) => {
          this.whileState = false;
          // console.log(error);
          this.makeToast('error', this.errorHandler(error), 2000);
        },
      );
    },
    toggleDetaile() {
      if (this.toggleRow) {
        this.toggleRow = false;
        this.$emit('toggleRow', 'close');
      } else {
        this.toggleRow = true;
        this.$emit('toggleRow', 'open');
      }
    },
  },
  components: {
    SwitchButton,
  },
  computed: {},
  mounted() {
    // alert(this.lessonIds);
    // console.log('▄▄▄', this.courseImage);
    // this.perId = this.pId;
    if (this.status === 1) {
      this.teacherStatus = true;
    } else {
      this.teacherStatus = false;
    }
    if (this.state === 1) {
      this.teacherLock = true;
    } else {
      this.teacherLock = false;
    }
    // this.teacherLock = this.state;
    // alert(this.teacherLock);
    // this.lessonId = this.lId;
  },
};
</script>

<style lang="scss" scoped>
.addVideo{
  margin-top: 8px;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 4px 8px 0 rgba($color: #000000, $alpha: 0.02);
}

.addVideo *{
  pointer-events: none;
}

.addVideo:hover{
  filter: brightness(120%);
  box-shadow: 0 12px 8px 0 rgba($color: #000000, $alpha: 0.03);
}

.addVideo label{
  font-size: 10px;
  color: white;
  padding-right: 8px;
}

.addVideo i{
  font-size: 16px;
  color: white;
}

.gRow {
  padding: 16px 0px;
  transition: all cubic-bezier(0.5, 0, 0, 1) 0.5s;
  height: 100%;
  height: 172px;
}

.teacherName {
  font-size: 14px;
  font-weight: 400;
  text-align: right;
  word-spacing: -2px;
  margin-bottom: 8px;
}

.teacherUsername {
  font-size: 13px;
  font-weight: 100;
  margin-right: 8px;
  word-spacing: -2px;
}

.teacherLoginAt {
  font-size: 12px;
  font-weight: 200;
}

.gRow:hover {
  background-color: rgba($color: #000000, $alpha: 0.02);
}

.wait {
  opacity: 0.3;
  filter: grayscale(100%);
}

.miniIcon{
  font-size: 16px;
  color: purple;
}

.infoItemHolder{
  padding: 0px 8px 4px;
}
</style>
