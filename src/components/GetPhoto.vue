<template>
  <div class="getPhotoHolder fCol jStart aStart"
    v-bind:style="{minWidth: `${w}`}">
    <input type="file" id="getPhotoInput" name="getPhoto"
    ref="file" @change="handleFileUpload($event)"
    accept="image/x-png, image/jpg, image/jpeg">
    <div class="getPhoto primary fRow jStart aCenter" v-bind:class="{disable: uploading}"
     v-if="!this.firstUpload" @click="selectPhoto">
      <div class="btnEffect"></div>
      <i class="material-icons-round">add_a_photo</i>
      <div class="fCol jStart aStart" style="pointer-events: none;">
        <div class="label">{{uploadLabel}}</div>
        <div class="tips">{{uploadMsg}}</div>
      </div>
    </div>
    <div class="imgHolder" v-if="this.firstUpload" v-bind:class="{disable: uploading}">
      <img @click="selectPhoto" class="preview" :src="`${this.uploaded}`">
      <i class="material-icons-round reloadImage fRow aCenter jCenter"
       title="انتخاب تصویر جایگزین" @click="selectPhoto">loop</i>
    </div>
    <div class="fullWidth fCol jStart aStart">
      <div class="tipItem" v-for="item in tipsss" v-bind:key="item">{{item}}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import errorHandler from '@/mixins/mixin';
import makeToast from '@/mixins/makeToast';

export default {
  mixins: [makeToast, errorHandler],
  data() {
    return {
      tipsss: [
        'فقط پسوند‌های JPG، JPEG و PNG مورد قبول هستند.',
        'عکس شما باید در قالب مربع باشد. (طول و عرض برابر باشد)',
        'حداکثر حجم مجاز 300KB، اندازه پیشنهادی 256×256 پیکسل',
      ],
      file: [],
      defImg: `${this.$store.state.baseUrl}/photo/ni.svg`,
      uploaded: '',
      isPhotoSelected: false,
      firstUpload: false,
      uploading: false,
      baseURL: this.$store.state.baseUrl,
      V: this.$store.state.apiVersion,
    };
  },
  props: ['w', 'uploadLabel', 'uploadMsg', 'photoFor', 'initImg'],
  methods: {
    selectPhoto() {
      console.log('this.selectPhoto');
      document.getElementById('getPhotoInput').click();
    },
    handleFileUpload(event) {
      [this.file] = [this.$refs.file.files[0]];
      let isSquare = false;
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          if (img.width === img.height) {
            isSquare = true;
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(event.target.files[0]);
      const fileSize = this.file.size < 307200;
      const fileType = this.file.type === 'image/jpeg' || this.file.type === 'image/png';
      if (fileSize && fileType) {
        this.submitFile();
        return;
      }
      if (!fileSize) {
        this.makeToast('warning', 'حجم فایل بیش از حد مجاز است', 3000);
      } else if (!fileType) {
        this.makeToast('warning', 'پسوند فایل مورد تأیید نیست', 3000);
      } else if (!isSquare) {
        this.makeToast('warning', 'تصویر مربع نیست', 3000);
      }
      console.log(this.file);
    },
    submitFile() {
      const formData = new FormData();
      formData.append('files', this.file);
      this.uploading = true;
      axios({
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: this.$authObeject.authToken(),
        },
        url: `${this.baseURL}/api/v${this.V}/Uploads/photo`,
        data: formData,
      }).then((response) => {
        this.uploading = false;
        if (response.data.isSuccess) {
          this.uploaded = `${this.$store.state.baseUrl}/photo/${response.data.data}`;
          this.$emit('photoupload', response.data.data);
          this.firstUpload = true;
          this.makeToast('info', 'تصویر آپلود شد', 2000);
        } else {
          this.makeToast('info', 'خطا در آپلود تصویر', 2000);
          this.responseFalse = true;
        }
      }, (error) => {
        this.uploading = false;
        this.makeToast('error', this.errorHandler(error), 3000);
        console.log(error);
      });
    },
  },
  mounted() {
    this.uploaded = this.defImg;
    if (this.initImg === 'none') {
      this.firstUpload = false;
    } else {
      this.firstUpload = true;
      this.uploaded = `${this.$store.state.baseUrl}/photo/${this.initImg}`;
    }
  },
};
</script>

<style lang='scss' scoped>
.imgHolder{
  position: relative;
}

.reloadImage{
  position: absolute;
  top: 8px;
  right: 8px;
  border-radius: 80px;
  font-size: 16px;
  color: #525252;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.24);
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.getPhotoHolder{
  margin-bottom: 16px;
  padding: 8px;
}
.getPhoto{
  border-radius: 4px;
  padding: 16px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: all cubic-bezier(0.5, 0, 0, 0.5) 0.2s;
}

.getPhoto.disable{
  pointer-events: none;
  opacity: 0.2;
}

.getPhoto .btnEffect{
    position: absolute;
    right: 40px;
    top: 50%;
    width: 0px;
    height: 0px;
    pointer-events: none;
    transform: translate(50%, -50%);
    border-radius: 50%;
    border: solid 0px rgba(255, 255, 255, 0.123);
    background-color: rgba(0, 0, 0, 0.096);
    transition: all cubic-bezier(0.5, 0, 0, 1) 0.8s;
    z-index: 10;
}

.getPhoto:hover .btnEffect{
    width: 512px;
    height: 512px;
    border: solid 64px rgba(255, 255, 255, 0);
}

.getPhoto:active .btnEffect{
    width:  64px;
    height: 64px;
    border: solid 8px rgba(255, 255, 255, 0);
}

.getPhoto i{
  font-size: 48px;
  pointer-events: none;
  color: white;
  padding-left: 16px;
  margin-left: 16px;
  border-left: solid 2px rgba($color: #ffffff, $alpha: 0.2);
}

#getPhotoInput{
  display: none;
}

.label{
  font-size: 18px;
  font-weight: bold;
  color: white;
  text-align: right;
  z-index: 20;
}

.tips{
  font-size: 12px;
  font-weight: 200;
  color: white;
  text-align: right;
  z-index: 20;
}

.tipItem{
  font-size: 10px;
  font-weight: 200;
  text-align: right;
  position: relative;
  margin: 8px 0 0 0;
  padding-right: 16px;
}

.tipItem::after{
  position: absolute;
  content: ' ';
  top: 50%;
  right: 0px;
  transform: translateY(-50%);
  border-radius: 80px;
  width: 8px;
  height: 8px;
  background-color: rgba($color: #000000, $alpha: 0.2);
}

$previewSize: 196px;
.preview {
  width: $previewSize;
  height: $previewSize;
  border-radius: 4px;
  margin: 0 0 16px 0;
  box-shadow: 0 8px 16px 0 rgba($color: #000000, $alpha: 0.1);
}

</style>
