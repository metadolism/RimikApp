<template>
  <div class="gRow fRow jBetween aCenter fullWidth">
    <span class="index">{{ indx }}</span>
    <div class="tableHead itemImg">
      <img
        :src="lessonImage"
        :alt="`تصویر ${this.name} ${this.lname}`"
        :title="`تصویر ${this.name} ${this.lname}`"
      />
    </div>
    <div class="tableHead title big fCol aStart jCenter">
      <div class="teacherName">{{ name }} {{ lname }}</div>
      <div class="teacherUsername">نام کاربری: {{ username }}</div>
      <!-- <div class="teacherLoginAt" v-if='this.loginAt === 0'>ل</div> -->
      <!-- // eslint-disable-next-line -->
      <div class="teacherLoginAt"
        v-if='this.loginAt !== 0'>آخرین ورود: {{ this.displayTime(loginAt).full }}</div>
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
        :load="whileState"
        activeLabel="بلاک"
        deactiveLabel="بلاک"
      />
    </div>
    <div class="tableHead actions big">
      <i
        @mouseover="disableExpand"
        @click="getTeacherInfo()"
        @mouseleave="enableExpand"
        class="material-icons-round">info
      </i>
      <i
        @mouseover="disableExpand"
        @click="editTeacher"
        @mouseleave="enableExpand"
        class="material-icons-round"
        >edit</i
      >
      <i
        @mouseover="disableExpand"
        @click="deleteTeacher"
        @mouseleave="enableExpand"
        class="material-icons-round"
        >clear</i
      >
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
  props: ['username', 'name', 'lname', 'loginAt', 'access', 'phone', 'summary', 'avatar',
    'status', 'lock', 'id', 'indx', 'photo', 'description', 'lessonIds', 'page', 'pages'],
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
      lessonId: [],
      lessonImage: `${this.$store.state.baseUrl}/photo/${this.avatar}`,
      whileState: false,
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
    editTeacher() {
      // alert(`edit premision id = ${this.perId}`);
      // alert(this.lId);
      this.$store.commit('setWorkOn', 'teachers');
      this.$store.commit('setTeacherEditMode', `${this.id}`);
      // this.$store.commit('openLessonCard', this.id);
    },
    deleteTeacher() {
      // console.log(`delete premision id = ${pid}`);
      this.$store.commit('setWorkOn', 'teachers');
      this.$store.commit('openTeacherCard', this.id);
      this.$store.commit('setTeacherDeleteMode', `${this.name} ${this.lname}`);
    },
    // عوض کردن وضعیت
    invertState() {
      // alert('change teacher state');
      let tempState = 0;
      console.log('teacherStatus', this.teacherStatus);
      // alert(this.id);
      this.whileState = true;
      if (this.teacherStatus) {
        tempState = 2;
      } else {
        tempState = 1;
      }
      // console.log(`${this.access} - ${this.name}
      // - ${this.lessonIds}`);
      axios({
        method: 'patch',
        url: `${this.baseURL}/api/v${this.V}/Teachers/${this.id}`,
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
        data: {
          Status: tempState,
          LockoutEnable: this.teacherLock,
        },
      }).then(
        (response) => {
          this.whileState = false;
          if (response.data.isSuccess) {
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
          this.whileState = false;
          // console.log(error);
          this.makeToast('error', this.errorHandler(error), 2000);
        },
      );
    },
    // عوض کردن lockout
    invertLockout() {
      let tempState = 0;
      if (!this.teacherStatus) {
        tempState = 2;
      } else {
        tempState = 1;
      }
      console.log('lockout', this.teacherLock);
      axios({
        method: 'patch',
        url: `${this.baseURL}/api/v${this.V}/Teachers/${this.id}`,
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
        data: {
          Status: tempState,
          LockoutEnable: !this.teacherLock,
        },
      }).then(
        (response) => {
          if (response.data.isSuccess) {
            console.log(response);
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
    // تابع دریافت اطلاعات اطلاعات مخصوص دبیر
    getTeacherInfo(init) {
      if (!this.expanded) {
        axios({
          method: 'get',
          url: `${this.baseURL}/api/v${this.V}/Teachers/${this.id}/info`,
          headers: {
            Authorization: this.$authObeject.authToken(),
          },
        }).then(
          (response) => {
            if (response.data.isSuccess) {
              this.expanded = true;
              this.tDesc = JSON.parse(JSON.stringify(response.data.data.description));
              this.tSummary = JSON.parse(JSON.stringify(response.data.data.summary));
              if (!init || init === undefined) {
                this.lessonId = response.data.data.lessonIds;
                this.$emit('showTeacherInfo', {
                  teacher: JSON.parse(JSON.stringify(response.data.data)),
                  order: 'open',
                });
              } else {
                this.lessonId = response.data.data.lessonIds;
                this.$emit('showTeacherInfo', {
                  teacher: JSON.parse(JSON.stringify(response.data.data)),
                  order: 'init',
                });
              }
              // console.log(JSON.parse(JSON.stringify(response.data.data)));
              // alert(this.lessonsId);
            }
          },
          (error) => {
            // console.log(error);
            this.makeToast('error', this.errorHandler(error), 2000);
          },
        );
      } else {
        this.expanded = false;
        this.$emit('closeRow');
      }
    },
  },
  components: {
    SwitchButton,
  },
  computed: {},
  mounted() {
    // this.getTeacherInfo(true);
    // alert(this.lessonIds);
    // console.log('▄▄▄', this.status);
    // this.perId = this.pId;
    if (this.status === 1) {
      this.teacherStatus = true;
    } else {
      this.teacherStatus = false;
    }
    this.teacherLock = this.lock;
    // alert(this.teacherLock);
    // this.lessonId = this.lId;
  },
};
</script>

<style lang="scss" scoped>
.gRow {
  padding: 16px 0px;
  transition: all cubic-bezier(0.5, 0, 0, 1) 0.5s;
  height: 100%;
  max-height: 96px;
}

.teacherName {
  font-size: 16px;
  font-weight: 600;
  word-spacing: -2px;
}

.teacherUsername {
  font-size: 13px;
  font-weight: 100;
  margin-bottom: 8px;
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
</style>
