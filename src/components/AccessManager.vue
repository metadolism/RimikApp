<template>
  <div class="fullWidth wrap fRow aStart jAround">
    <!-- card header -->
    <div class='fRow fullWidth jStart aStart'>
      <div class='growFull fCol jStart aStart'>
        <h3 class='growFull text-right'>{{ct}}</h3>
        <p class='note'>{{cd}}</p>
      </div>
    </div>
    <div class='sepLine' v-if='!this.isDelete'></div>
    <progress-bar w='100%' h='324px' msg='لطفا کمی صبر کنید' v-if="this.plsWait && !loadError"/>
    <error-bar w='100%' h='324px' :msg='msgError' v-if="!this.plsWait && loadError"/>
    <!-- add or edit form ↓ -->
    <div class="fullWidth wrap fRow aStart jAround"
    v-if="!this.plsWait && !this.isDelete && !loadError">
      <div class="inputWrapper fCol aStart jStart atitle">
        <span>عنوان</span>
        <input v-bind:class="{err: titleError}"
        placeholder="عنوان مجوز" type="text" v-model="aTitle"/>
      </div>
      <div class="inputWrapper fCol aStart jStart adesc">
        <span>توضیحات کوتاه</span>
        <input v-bind:class="{err: descError}"
        placeholder="توضیحات کوتاه" type="text" v-model="aDesc"/>
      </div>

      <div class="inputWrapper fCol aStart jStart astate">
        <span>وضعیت</span>
        <div class="fullWidth fRow aCenter jCenter switchHolder"
        style="height: 38px;" @click="changeState">
          <label class="growFull rtlText switchLabel">وضعیت دسترسی</label>
          <switch-button :val='this.stateSwitch' activeLabel='فعال' deactiveLabel='غیرفعال'/>
        </div>
      </div>

      <div id="allPermissions" class="fullWidth fRow jStart aStart wrap"
      style="margin-bottom: 16px;">
        <progress-bar w='100%' h='112px' msg='لطفا کمی صبر کنید' v-if="!this.isDataLoad"/>
        <div class="fullWidth fRow jStart aCenter"
        style="margin-bottom: 16px;" v-if="this.isDataLoad">
          <p class="selectPermissions"
           v-bind:class="{err: emptyError}"
          style="margin-left: 16px">مجوز ها را انتخاب کنید</p>
          <label class="container checkBoxHolder dark" style="border: none;">
            <input @change="checkAll($event)" type="checkbox" v-model="selectAllPermissions"/>
            <span class="checkmark dark"></span>
            <span class="checkText fRow jCenter aCenter">
              <div>انتخاب همه</div>
            </span>
          </label>
        </div>
        <div v-if="!this.plsWait"
        class="fullWidth fRow jStart aStart wrap" v-bind:class="{err: emptyError}">
          <div v-for="item in fullPermissionList" v-bind:key="item.id"
          style="width: calc(33.3333% - 8px)" class="checkGroup">
            <label class="container checkBoxHolder dark fullWidth">
              <input type="checkbox" :id="item.permission.id"
              v-on:change="ch($event, 'parent')"
              :data-pId="item.permission.id"/>
              <span class="checkmark dark"></span>
              <span class="checkText fRow jCenter aCenter">
                <i class="material-icons-round">{{item.permission.icon}}</i>
                <div>{{item.permission.title}}</div>
                <i v-if="item.permission.hasChild"
                class="material-icons-round arrow">keyboard_arrow_down</i>
              </span>
            </label>
              <!-- zirmajmooee -->
            <div class="subs fullWidth fCol jStart ">
              <label v-for="items in item.permissions" v-bind:key="items.index"
              class="container checkBoxHolder level2 dark fullWidth">
                <input type="checkbox"
                v-on:change="ch($event, 'child')"
                :data-pId="items.id"
                :id="items.id"
                :class="items.parentId"/>
                <span class="checkmark dark"></span>
                <span class="checkText fRow jCenter aCenter">
                  <i class="material-icons-round">{{items.icon}}</i>
                  <div>{{items.title}}</div>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <btn :label="this.cbl" btnWidth='70%' class="flexGrow"
      :icon="this.cbi" @click.native="mainFunction"/>
    </div>
    <!-- if delete ↓ -->
    <div class="fullWidth wrap aStart jStart fRow btnRow" v-if="!this.plsWait && this.isDelete">
      <btn label="بله، حذف شود" btnWidth='auto' bc='#ff0533'
      icon="delete_sweep" @click.native="deleteAccess"/>
      <btn label="نه" btnWidth='auto' bc='#aaaaaa' icon="close" @click.native="closeModal"/>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import Btn from '@/components/Btn.vue';
import SwitchButton from '@/components/SwitchButton.vue';
import ProgressBar from '@/components/ProgressBar.vue';
import ErrorBar from '@/components/ErrorBar.vue';
import errorHandler from '@/mixins/mixin';
import makeToast from '@/mixins/makeToast';

export default {
  mixins: [errorHandler, makeToast],
  data() {
    return {
      selectAllPermissions: false,
      inputIndex: 0,
      aTitle: '',
      aDesc: '',
      aStatus: 0,
      loadError: false,
      msgError: false,
      // aArray: ['5f7a4c49e70c80bc59d16cc5', '5f7a4efde70c80bc59d16cc8'],
      aArray: [],
      firstLoadArray: [],
      titleError: false,
      descError: false,
      emptyError: false,
      peLocalPath: '',
      peServerPath: '',
      peIcon: '',
      peMethod: '',
      peHasChild: false,
      peState: Number,
      showChild: this.childSwitch,
      mi: ['3d_rotation', 'ac_unit', 'access_alarm',
        'access_alarms', 'access_time', 'accessibility', 'accessible', 'account_balance',
        'account_balance_wallet', 'account_box', 'account_circle', 'adb', 'add', 'add_a_photo',
        'add_alarm', 'add_alert', 'add_box', 'add_circle', 'add_circle_outline',
        'add_location', 'add_shopping_cart', 'add_to_photos', 'add_to_queue', 'adjust',
        'airline_seat_flat', 'airline_seat_flat_angled', 'airline_seat_individual_suite',
        'airline_seat_legroom_extra', 'airline_seat_legroom_normal', 'airline_seat_legroom_reduced',
        'airline_seat_recline_extra', 'airline_seat_recline_normal', 'airplanemode_active',
        'airplanemode_inactive', 'airplay', 'airport_shuttle', 'alarm', 'alarm_add',
        'alarm_off', 'alarm_on', 'album', 'all_inclusive', 'all_out', 'android',
        'announcement', 'apps', 'archive', 'arrow_back', 'arrow_downward', 'arrow_drop_down',
        'arrow_drop_down_circle', 'arrow_drop_up', 'arrow_forward', 'arrow_upward', 'art_track',
        'aspect_ratio', 'assessment', 'assignment', 'assignment_ind', 'assignment_late',
        'assignment_return', 'assignment_returned', 'assignment_turned_in', 'assistant',
        'assistant_photo', 'attach_file', 'attach_money', 'attachment', 'audiotrack', 'autorenew',
        'av_timer', 'backspace', 'backup', 'battery_alert', 'battery_charging_full',
        'battery_full', 'battery_std', 'battery_unknown', 'beach_access', 'beenhere', 'block',
        'bluetooth', 'bluetooth_audio', 'bluetooth_connected', 'bluetooth_disabled',
        'bluetooth_searching', 'blur_circular', 'blur_linear', 'blur_off', 'blur_on',
        'book', 'bookmark', 'bookmark_border', 'border_all', 'border_bottom', 'border_clear',
        'border_color', 'border_horizontal', 'border_inner', 'border_left', 'border_outer',
        'border_right', 'border_style', 'border_top', 'border_vertical', 'branding_watermark',
        'brightness_1', 'brightness_2', 'brightness_3', 'brightness_4', 'brightness_5',
        'brightness_6', 'brightness_7', 'brightness_auto', 'brightness_high', 'brightness_low',
        'brightness_medium', 'broken_image', 'brush', 'bubble_chart', 'bug_report', 'build',
        'burst_mode', 'business', 'business_center', 'cached', 'cake', 'call', 'call_end',
        'call_made', 'call_merge', 'call_missed', 'call_missed_outgoing', 'call_received',
        'call_split', 'call_to_action', 'camera', 'camera_alt', 'camera_enhance', 'camera_front',
        'camera_rear', 'camera_roll', 'cancel', 'card_giftcard', 'card_membership', 'card_travel',
        'casino', 'cast', 'cast_connected', 'center_focus_strong', 'center_focus_weak',
        'change_history', 'chat', 'chat_bubble', 'chat_bubble_outline', 'check', 'check_box',
        'check_box_outline_blank', 'check_circle', 'chevron_left', 'chevron_right',
        'child_care', 'child_friendly', 'chrome_reader_mode', 'class', 'clear', 'clear_all', 'close',
        'closed_caption', 'cloud', 'cloud_circle', 'cloud_done', 'cloud_download', 'cloud_off',
        'cloud_queue', 'cloud_upload', 'code', 'collections', 'collections_bookmark', 'color_lens',
        'colorize', 'comment', 'compare', 'compare_arrows', 'computer', 'confirmation_number',
        'contact_mail', 'contact_phone', 'contacts', 'content_copy', 'content_cut', 'content_paste',
        'control_point', 'control_point_duplicate', 'copyright', 'create', 'create_new_folder',
        'credit_card', 'crop', 'crop_16_9', 'crop_3_2', 'crop_5_4', 'crop_7_5', 'crop_din',
        'crop_free', 'crop_landscape', 'crop_original', 'crop_portrait', 'crop_rotate', 'crop_square',
        'dashboard', 'data_usage', 'date_range', 'dehaze', 'delete', 'delete_forever',
        'delete_sweep', 'description', 'desktop_mac', 'desktop_windows', 'details',
        'developer_board', 'developer_mode', 'device_hub', 'devices', 'devices_other', 'dialer_sip',
        'dialpad', 'directions', 'directions_bike', 'directions_boat', 'directions_bus',
        'directions_car', 'directions_railway', 'directions_run', 'directions_subway',
        'directions_transit', 'directions_walk', 'disc_full', 'dns', 'do_not_disturb',
        'do_not_disturb_alt', 'do_not_disturb_off', 'do_not_disturb_on', 'dock', 'domain',
        'done', 'done_all', 'donut_large', 'donut_small', 'drafts', 'drag_handle', 'drive_eta',
        'dvr', 'edit', 'edit_location', 'eject', 'email', 'enhanced_encryption', 'equalizer', 'error',
        'error_outline', 'euro_symbol', 'ev_station', 'event', 'event_available', 'event_busy',
        'event_note', 'event_seat', 'exit_to_app', 'expand_less', 'expand_more', 'explicit',
        'explore', 'exposure', 'exposure_neg_1', 'exposure_neg_2', 'exposure_plus_1', 'exposure_plus_2',
        'exposure_zero', 'extension', 'face', 'fast_forward', 'fast_rewind', 'favorite',
        'favorite_border', 'featured_play_list', 'featured_video', 'feedback', 'fiber_dvr',
        'fiber_manual_record', 'fiber_new', 'fiber_pin', 'fiber_smart_record', 'file_download',
        'file_upload', 'filter', 'filter_1', 'filter_2', 'filter_3', 'filter_4', 'filter_5',
        'filter_6', 'filter_7', 'filter_8', 'filter_9', 'filter_9_plus', 'filter_b_and_w',
        'filter_center_focus', 'filter_drama', 'filter_frames', 'filter_hdr', 'filter_list',
        'filter_none', 'filter_tilt_shift', 'filter_vintage', 'find_in_page', 'find_replace',
        'fingerprint', 'first_page', 'fitness_center', 'flag', 'flare', 'flash_auto', 'flash_off',
        'flash_on', 'flight', 'flight_land', 'flight_takeoff', 'flip', 'flip_to_back',
        'flip_to_front', 'folder', 'folder_open', 'folder_shared', 'folder_special',
        'font_download', 'format_align_center', 'format_align_justify', 'format_align_left',
        'format_align_right', 'format_bold', 'format_clear', 'format_color_fill',
        'format_color_reset', 'format_color_text', 'format_indent_decrease',
        'format_indent_increase', 'format_italic', 'format_line_spacing', 'format_list_bulleted',
        'format_list_numbered', 'format_paint', 'format_quote', 'format_shapes', 'format_size',
        'format_strikethrough', 'format_textdirection_l_to_r', 'format_textdirection_r_to_l',
        'format_underlined', 'forum', 'forward', 'forward_10', 'forward_30', 'forward_5',
        'free_breakfast', 'fullscreen', 'fullscreen_exit', 'functions', 'g_translate',
        'gamepad', 'games', 'gavel', 'gesture', 'get_app', 'gif', 'golf_course', 'gps_fixed',
        'gps_not_fixed', 'gps_off', 'grade', 'gradient', 'grain', 'graphic_eq', 'grid_off',
        'grid_on', 'group', 'group_add', 'group_work', 'hd', 'hdr_off', 'hdr_on', 'hdr_strong',
        'hdr_weak', 'headset', 'headset_mic', 'healing', 'hearing', 'help', 'help_outline',
        'high_quality', 'highlight', 'highlight_off', 'history', 'home', 'hot_tub', 'hotel',
        'hourglass_empty', 'hourglass_full', 'http', 'https', 'image', 'image_aspect_ratio',
        'import_contacts', 'import_export', 'important_devices', 'inbox', 'indeterminate_check_box',
        'info', 'info_outline', 'input', 'insert_chart', 'insert_comment', 'insert_drive_file',
        'insert_emoticon', 'insert_invitation', 'insert_link', 'insert_photo', 'invert_colors',
        'invert_colors_off', 'iso', 'keyboard', 'keyboard_arrow_down', 'keyboard_arrow_left',
        'keyboard_arrow_right', 'keyboard_arrow_up', 'keyboard_backspace', 'keyboard_capslock',
        'keyboard_hide', 'keyboard_return', 'keyboard_tab', 'keyboard_voice', 'kitchen', 'label',
        'label_outline', 'landscape', 'language', 'laptop', 'laptop_chromebook', 'laptop_mac',
        'laptop_windows', 'last_page', 'launch', 'layers', 'layers_clear', 'leak_add', 'leak_remove',
        'lens', 'library_add', 'library_books', 'library_music', 'lightbulb_outline', 'line_style',
        'line_weight', 'linear_scale', 'link', 'linked_camera', 'list', 'live_help', 'live_tv',
        'local_activity', 'local_airport', 'local_atm', 'local_bar', 'local_cafe', 'local_car_wash',
        'local_convenience_store', 'local_dining', 'local_drink', 'local_florist', 'local_gas_station',
        'local_grocery_store', 'local_hospital', 'local_hotel', 'local_laundry_service',
        'local_library', 'local_mall', 'local_movies', 'local_offer', 'local_parking',
        'local_pharmacy', 'local_phone', 'local_pizza', 'local_play', 'local_post_office',
        'local_printshop', 'local_see', 'local_shipping', 'local_taxi', 'location_city',
        'location_disabled', 'location_off', 'location_on', 'location_searching', 'lock', 'lock_open',
        'lock_outline', 'looks', 'looks_3', 'looks_4', 'looks_5', 'looks_6', 'looks_one',
        'looks_two', 'loop', 'loupe', 'low_priority', 'loyalty', 'mail', 'mail_outline', 'map',
        'markunread', 'markunread_mailbox', 'memory', 'menu', 'merge_type', 'message', 'mic',
        'mic_none', 'mic_off', 'mms', 'mode_comment', 'mode_edit', 'monetization_on',
        'money_off', 'monochrome_photos', 'mood', 'mood_bad', 'more', 'more_horiz', 'more_vert',
        'motorcycle', 'mouse', 'move_to_inbox', 'movie', 'movie_creation', 'movie_filter',
        'multiline_chart', 'music_note', 'music_video', 'my_location', 'nature', 'nature_people',
        'navigate_before', 'navigate_next', 'navigation', 'near_me', 'network_cell', 'network_check',
        'network_locked', 'network_wifi', 'new_releases', 'next_week', 'nfc', 'no_encryption',
        'no_sim', 'not_interested', 'note', 'note_add', 'notifications', 'notifications_active',
        'notifications_none', 'notifications_off', 'notifications_paused', 'offline_pin',
        'ondemand_video', 'opacity', 'open_in_browser', 'open_in_new', 'open_with', 'pages',
        'pageview', 'palette', 'pan_tool', 'panorama', 'panorama_fish_eye', 'panorama_horizontal',
        'panorama_vertical', 'panorama_wide_angle', 'party_mode', 'pause', 'pause_circle_filled',
        'pause_circle_outline', 'payment', 'people', 'people_outline', 'perm_camera_mic',
        'perm_contact_calendar', 'perm_data_setting', 'perm_device_information', 'perm_identity',
        'perm_media', 'perm_phone_msg', 'perm_scan_wifi', 'person', 'person_add', 'person_outline',
        'person_pin', 'person_pin_circle', 'personal_video', 'pets', 'phone', 'phone_android',
        'phone_bluetooth_speaker', 'phone_forwarded', 'phone_in_talk', 'phone_iphone',
        'phone_locked', 'phone_missed', 'phone_paused', 'phonelink', 'phonelink_erase',
        'phonelink_lock', 'phonelink_off', 'phonelink_ring', 'phonelink_setup', 'photo',
        'photo_album', 'photo_camera', 'photo_filter', 'photo_library', 'photo_size_select_actual',
        'photo_size_select_large', 'photo_size_select_small', 'picture_as_pdf', 'picture_in_picture',
        'picture_in_picture_alt', 'pie_chart', 'pie_chart_outlined', 'pin_drop', 'place', 'play_arrow',
        'play_circle_filled', 'play_circle_outline', 'play_for_work', 'playlist_add',
        'playlist_add_check', 'playlist_play', 'plus_one', 'poll', 'polymer', 'pool',
        'portable_wifi_off', 'portrait', 'power', 'power_input', 'power_settings_new',
        'pregnant_woman', 'present_to_all', 'print', 'priority_high', 'public', 'publish',
        'query_builder', 'question_answer', 'queue', 'queue_music', 'queue_play_next', 'radio',
        'radio_button_checked', 'radio_button_unchecked', 'rate_review', 'receipt', 'recent_actors',
        'record_voice_over', 'redeem', 'redo', 'refresh', 'remove', 'remove_circle',
        'remove_circle_outline', 'remove_from_queue', 'remove_red_eye', 'remove_shopping_cart',
        'reorder', 'repeat', 'repeat_one', 'replay', 'replay_10', 'replay_30', 'replay_5',
        'reply', 'reply_all', 'report', 'report_problem', 'restaurant', 'restaurant_menu',
        'restore', 'restore_page', 'ring_volume', 'room', 'room_service', 'rotate_90_degrees_ccw',
        'rotate_left', 'rotate_right', 'rounded_corner', 'router', 'rowing', 'rss_feed', 'rv_hookup',
        'satellite', 'save', 'scanner', 'schedule', 'school', 'screen_lock_landscape',
        'screen_lock_portrait', 'screen_lock_rotation', 'screen_rotation', 'screen_share',
        'sd_card', 'sd_storage', 'search', 'security', 'select_all', 'send',
        'sentiment_dissatisfied', 'sentiment_neutral', 'sentiment_satisfied',
        'sentiment_very_dissatisfied', 'sentiment_very_satisfied', 'settings',
        'settings_applications', 'settings_backup_restore', 'settings_bluetooth',
        'settings_brightness', 'settings_cell', 'settings_ethernet', 'settings_input_antenna',
        'settings_input_component', 'settings_input_composite', 'settings_input_hdmi',
        'settings_input_svideo', 'settings_overscan', 'settings_phone', 'settings_power',
        'settings_remote', 'settings_system_daydream', 'settings_voice', 'share', 'shop',
        'shop_two', 'shopping_basket', 'shopping_cart', 'short_text', 'show_chart', 'shuffle',
        'signal_cellular_4_bar', 'signal_cellular_connected_no_internet_4_bar',
        'signal_cellular_no_sim', 'signal_cellular_null', 'signal_cellular_off', 'signal_wifi_4_bar',
        'signal_wifi_4_bar_lock', 'signal_wifi_off', 'sim_card', 'sim_card_alert',
        'skip_next', 'skip_previous', 'slideshow', 'slow_motion_video', 'smartphone',
        'smoke_free', 'smoking_rooms', 'sms', 'sms_failed', 'snooze', 'sort', 'sort_by_alpha',
        'spa', 'space_bar', 'speaker', 'speaker_group', 'speaker_notes', 'speaker_notes_off',
        'speaker_phone', 'spellcheck', 'star', 'star_border', 'star_half', 'stars',
        'stay_current_landscape', 'stay_current_portrait', 'stay_primary_landscape',
        'stay_primary_portrait', 'stop', 'stop_screen_share', 'storage', 'store',
        'store_mall_directory', 'straighten', 'streetview', 'strikethrough_s', 'style',
        'subdirectory_arrow_left', 'subdirectory_arrow_right', 'subject', 'subscriptions',
        'subtitles', 'subway', 'supervisor_account', 'surround_sound', 'swap_calls', 'swap_horiz',
        'swap_vert', 'swap_vertical_circle', 'switch_camera', 'switch_video', 'sync', 'sync_disabled',
        'sync_problem', 'system_update', 'system_update_alt', 'tab', 'tab_unselected', 'tablet',
        'tablet_android', 'tablet_mac', 'tag_faces', 'tap_and_play', 'terrain', 'text_fields',
        'text_format', 'textsms', 'texture', 'theaters', 'thumb_down', 'thumb_up', 'thumbs_up_down',
        'time_to_leave', 'timelapse', 'timeline', 'timer', 'timer_10', 'timer_3', 'timer_off',
        'title', 'toc', 'today', 'toll', 'tonality', 'touch_app', 'toys', 'track_changes',
        'traffic', 'train', 'tram', 'transfer_within_a_station', 'transform', 'translate',
        'trending_down', 'trending_flat', 'trending_up', 'tune', 'turned_in', 'turned_in_not',
        'tv', 'unarchive', 'undo', 'unfold_less', 'unfold_more', 'update', 'usb', 'verified_user',
        'vertical_align_bottom', 'vertical_align_center', 'vertical_align_top', 'vibration',
        'video_call', 'video_label', 'video_library', 'videocam', 'videocam_off', 'videogame_asset',
        'view_agenda', 'view_array', 'view_carousel', 'view_column', 'view_comfy', 'view_compact',
        'view_day', 'view_headline', 'view_list', 'view_module', 'view_quilt', 'view_stream',
        'view_week', 'vignette', 'visibility', 'visibility_off', 'voice_chat', 'voicemail',
        'volume_down', 'volume_mute', 'volume_off', 'volume_up', 'vpn_key', 'vpn_lock', 'wallpaper',
        'warning', 'watch', 'watch_later', 'wb_auto', 'wb_cloudy', 'wb_incandescent', 'wb_iridescent',
        'wb_sunny', 'wc', 'web', 'web_asset', 'weekend', 'whatshot', 'widgets', 'wifi', 'wifi_lock',
        'wifi_tethering', 'work', 'wrap_text', 'youtube_searched_for', 'zoom_in', 'zoom_out', 'zoom_out_map'],
      parentDropDown: false,
      iconDropDown: false,
      stateDropDown: false,
      methodDropDown: false,
      isDataLoad: false,
      pArray: [],
      stateSwitch: true,
      childSwitch: false,
      ct: '',
      cd: '',
      cbl: '',
      cbi: '',
      addMode: false,
      editMode: false,
      baseURL: this.$store.state.baseUrl,
      V: this.$store.state.apiVersion,
      modalStates: this.$store.state.modalState,
      plsWait: true,
      isDelete: false,
      fullPermissionList: [],
      message: 'payame aval',
    };
  },
  props: ['mode'],
  computed: {
    computedId() {
      this.plusplus();
      // console.log('after plus', this.inputIndex);
      return this.inputIndex;
    },
  },
  methods: {
    chBackup(event, chType) {
      switch (chType) {
        case 'child': {
          if (event.target.checked) {
            console.log('its a child with parent -> ', event.target.className);
            this.aArray.push(event.target.getAttribute('data-pId'));
            document.getElementById(event.target.className).checked = true;
            if (!this.aArray.includes(event.target.className)) {
              this.aArray
                .push(document.getElementById(event.target.className).getAttribute('data-pId'));
            }
          } else {
            const iii = this.aArray.indexOf(event.target.getAttribute('data-pId'));
            this.aArray.splice(iii, 1);
          }
          console.log(chType, this.aArray);
          break;
        }
        case 'parent': {
          if (event.target.checked) {
            console.log('its a parent with id -> ', event.target.id);
            this.aArray.push(event.target.getAttribute('data-pId'));
            document.getElementsByClassName(event.target.getAttribute('data-pId')).checked = true;
          } else {
            const iii = this.aArray.indexOf(event.target.getAttribute('data-pId'));
            this.aArray.splice(iii, 1);
          }
          console.log(chType, this.aArray);
          break;
        }
        default:
          break;
      }
    },
    ch(event, chType) {
      switch (chType) {
        case 'child': {
          if (event.target.checked) {
            // console.log('its a child with parent -> ', event.target.className);
            this.aArray.push(event.target.getAttribute('data-pId'));
            document.getElementById(event.target.className).checked = true;
            if (!this.aArray.includes(event.target.className)) {
              this.aArray
                .push(document.getElementById(event.target.className).getAttribute('data-pId'));
            }
          } else {
            const iii = this.aArray.indexOf(event.target.getAttribute('data-pId'));
            this.aArray.splice(iii, 1);
            // console.log('loglog', event.target.className);
            // اینجا چک میکنیم اگه همه بچه ها آنچک بودن پرنت رو هم آنچک کنه
            let uncheckParent = true;
            const rchof = this.returnChildsOf(event.target.className);
            for (let xx = 0; xx < rchof.length; xx += 1) {
              if (document.getElementById(rchof[xx]).checked) {
                uncheckParent = false;
                break;
              }
            }
            if (uncheckParent) {
              document.getElementById(event.target.className).click();
            }
          }
          // console.log(chType, this.aArray);
          break;
        }
        case 'parent': {
          const thisIndex = this.findWithAttr(this.fullPermissionList, event.target.id);
          const haveChild = this.fullPermissionList[thisIndex].permission.hasChild;
          if (event.target.checked) {
            if (haveChild) {
              // console.log('child of -> ', this.returnChildsOf(event.target.id));
              this.checkByArray(this.returnChildsOf(event.target.id));
            } else {
              this.aArray.push(event.target.getAttribute('data-pId'));
            }
          } else {
            const iii = this.aArray.indexOf(event.target.id);
            this.aArray.splice(iii, 1);
            this.uncheckByArray(this.returnChildsOf(event.target.id));
          }
          break;
        }
        default:
          break;
      }
      // console.clear();
      // console.log(chType, this.aArray);
    },
    returnChildsOf(perid) {
      // aval indexesho peyda mikonim
      const ind = this.findWithAttr(this.fullPermissionList, perid);
      // bad toole araye ro migirim
      const len = this.fullPermissionList[ind].permissions.length;
      const childs = [];
      // childs.push(this.fullPermissionList[ind].permission.id);
      if (len > 0) {
        for (let j = 0; j < len; j += 1) {
          childs.push(this.fullPermissionList[ind].permissions[j].id);
        }
      }
      return childs;
    },
    findWithAttr(array, value) {
      // return index of object in array
      for (let i = 0; i < array.length; i += 1) {
        if (array[i].permission.id === value) {
          return i;
        }
      }
      return -1;
    },
    plusplus() {
      this.inputIndex += 1;
    },
    getParents() {
      this.isDataLoad = false;
      this.parentDropDown = false;
      axios({
        method: 'get',
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
        url: `${this.baseURL}/api/v${this.V}/Permissions`,
      }).then((response) => {
        this.loadError = false;
        this.parentDropDown = true;
        this.posts = response.data;
        document.getElementById('parent').focus();
        if (this.response.isSuccess) {
          this.isDataLoad = true;
          // consolee.log('pArray', this.posts.data);
          this.pArray = JSON.parse(JSON.stringify(this.posts));
        }
      }, (error) => {
        this.loadError = true;
        this.msgError = this.errorHandler(error);
        this.makeToast('error', this.errorHandler(error), 2000);
      });
    },
    getAllPermissions() {
      this.isDataLoad = false;
      axios({
        method: 'get',
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
        url: `${this.baseURL}/api/v${this.V}/Permissions/all`,
      }).then((response) => {
        this.posts = response.data;
        if (response.data.isSuccess) {
          this.isDataLoad = true;
          this.fullPermissionList = JSON.parse(JSON.stringify(this.posts.data));
          // console.log('از اکسس منیجر', this.fullPermissionList);
        }
      }, (error) => {
        this.makeToast('error', this.errorHandler(error), 2000);
      });
    },
    selectParent(value) {
      this.peParentId = value;
      setTimeout(() => {
        this.parentDropDown = false;
      }, 50);
    },
    closeParent() {
      setTimeout(() => {
        this.parentDropDown = false;
      }, 160);
    },
    getIcon() {
      document.getElementById('icon').focus();
      this.iconDropDown = true;
    },
    closeIcon() {
      setTimeout(() => {
        this.iconDropDown = false;
      }, 160);
    },
    selectIcon(value) {
      this.peIcon = value;
      setTimeout(() => {
        this.iconDropDown = false;
      }, 90);
    },
    getState() {
      this.stateDropDown = true;
    },
    closeState() {
      setTimeout(() => {
        this.stateDropDown = false;
      }, 160);
    },
    selectState(value) {
      this.peState = value;
      setTimeout(() => {
        this.stateDropDown = false;
      }, 160);
    },
    getMethod() {
      document.getElementById('method').focus();
      this.methodDropDown = true;
    },
    closeMethod() {
      setTimeout(() => {
        this.methodDropDown = false;
      }, 160);
    },
    selectMethod(value) {
      this.peMethod = value;
      setTimeout(() => {
        this.methodDropDown = false;
      }, 100);
    },
    accessValidate() {
      if (this.aTitle === '') {
        this.titleError = true;
        return false;
      }
      this.titleError = false;

      if (this.aDesc === '') {
        this.descError = true;
        return false;
      }
      this.iconError = false;

      if (this.aArray.length === 0) {
        // alert(this.aArray.length);
        this.emptyError = true;
        return false;
      }
      this.emptyError = false;

      return true;
    },
    postNewAccess() {
      if (this.accessValidate()) {
        let swchtmp = 0;
        if (this.stateSwitch) {
          swchtmp = 1;
        } else {
          swchtmp = 2;
        }
        axios({
          method: 'post',
          url: `${this.baseURL}/api/v${this.V}/Accesses`,
          headers: {
            Authorization: this.$authObeject.authToken(),
          },
          data: {
            title: this.aTitle,
            description: this.aDesc,
            status: swchtmp,
            permissionsId: this.aArray,
          },
        }).then((response) => {
          // console.log('JAVAB', response);
          if (response.data.isSuccess) {
            this.$store.commit('closeCard');
            this.changeMsg();
            this.makeToast('success', 'دسترسی جدید با موفقیت ایجاد شد', 3000);
          }
        }, (error) => {
          this.makeToast('error', this.errorHandler(error), 2000);
        });
      }
    },
    editAccess() {
      // consolee.log('start edit permission');
      this.accessValidate();
      // console.log('child switch', this.childSwitch);
      let swchtmp = 0;
      if (this.stateSwitch) {
        swchtmp = 1;
      } else {
        swchtmp = 2;
      }
      axios({
        method: 'put',
        url: `${this.baseURL}/api/v${this.V}/Accesses/${this.$store.state.focusPermissionId}`,
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
        data: {
          title: this.aTitle,
          description: this.aDesc,
          status: swchtmp,
          permissionsId: this.aArray,
        },
      }).then((response) => {
        // console.log('after edit permission', response);
        if (response.data.isSuccess) {
          this.showChild = !this.showChild;
          this.$store.commit('closeCard');
          this.changeMsg();
          this.makeToast('success', 'ویرایش با موفقیت انجام شد', 2000);
        }
      }, (error) => {
        this.makeToast('error', this.errorHandler(error), 2000);
      });
    },
    changeMsg() {
      this.$emit('changeMsg', 'hey');
      // console.log('message emit from child component');
    },
    mainFunction() {
      switch (this.mode) {
        case 'add': {
          this.postNewAccess();
          break;
        }
        case 'edit': {
          this.editAccess();
          break;
        }
        default:
          break;
      }
    },
    deleteAccess() {
      // alert('focus access id: ', this.$store.state.focusPermissionId);
      axios({
        method: 'delete',
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
        url: `${this.baseURL}/api/v${this.V}/Accesses/${this.$store.state.focusPermissionId}`,
      }).then((response) => {
        // console.log('delete', response);
        if (response.data.isSuccess) {
          this.$store.commit('closeCard');
          this.changeMsg();
          this.makeToast('success', 'دسترسی مورد نظر با موفقیت حذف شد', 2000);
        }
      }, (error) => {
        // console.log(error);
        this.makeToast('error', this.errorHandler(error), 2000);
      });
    },
    closeModal() {
      this.$store.commit('closeCard');
    },
    changeState() {
      this.stateSwitch = !this.stateSwitch;
      // consolee.log(this.stateSwitch);
    },
    changeChildState() {
      this.childSwitch = !this.childSwitch;
      // console.log(this.childSwitch);
    },
    notAllow(inp) {
      // alert(inp);
      switch (inp) {
        case 'method': {
          this.peMethod = this.peMethod.slice(0, this.peMethod.length - 1);
          break;
        }
        case 'icon': {
          this.peIcon = this.peIcon.slice(0, this.peIcon.length - 1);
          break;
        }
        case 'parent': {
          this.peParentId = this.peParentId.slice(0, this.peParentId.length - 1);
          break;
        }
        default:
          break;
      }
    },
    checkAllBackup() {
      this.aArray = [];
      for (let i = 0; i < this.fullPermissionList.length; i += 1) {
        // console.log(this.fullPermissionList[i].permission.title);
        this.aArray.push(this.fullPermissionList[i].permission.id);
        if (this.fullPermissionList[i].permission.hasChild) {
          for (let j = 0; j < this.fullPermissionList[i].permissions.length; j += 1) {
            this.aArray.push(this.fullPermissionList[i].permissions[j].id);
            // console.log(' - ', this.fullPermissionList[i].permissions[j].title);1
          }
        }
      }
      if (this.selectAllPermissions) {
        // console.log('aArray: checkedAll: ', this.aArray);
        this.checkByArray(this.aArray);
      } else {
        // console.log('aArray: uncheckedAll: ', this.firstLoadArray);
        this.uncheckByArray(this.aArray);
      }
    },
    checkAll(event) {
      if (event.target.checked) {
        for (let ji = 0; ji < this.fullPermissionList.length; ji += 1) {
          if (!document.getElementById(this.fullPermissionList[ji].permission.id).checked) {
            document.getElementById(this.fullPermissionList[ji].permission.id).click();
          }
        }
      } else {
        for (let ji = 0; ji < this.fullPermissionList.length; ji += 1) {
          if (document.getElementById(this.fullPermissionList[ji].permission.id).checked) {
            document.getElementById(this.fullPermissionList[ji].permission.id).click();
          }
        }
      }
    },
    checkByArray(ar) {
      for (let ii = 0; ii < ar.length; ii += 1) {
        if (!document.getElementById(`${ar[ii]}`).checked) {
          document.getElementById(`${ar[ii]}`).click();
        }
      }
    },
    uncheckByArray(ar) {
      for (let ij = 0; ij < ar.length; ij += 1) {
        if (document.getElementById(`${ar[ij]}`).checked) {
          document.getElementById(`${ar[ij]}`).click();
        }
      }
    },
    updateMessage() {
      this.message = 'payame dovom';
      console.log(this.message);
      this.$nextTick(() => {
        console.log(this.message);
        // Scroll Down
      });
    },
  },
  components: {
    Btn,
    SwitchButton,
    ProgressBar,
    ErrorBar,
  },
  created() {
    this.getAllPermissions();
    switch (this.mode) {
      case 'add': {
        this.isDelete = false;
        this.ct = 'اضافه کردن دسترسی جدید';
        this.cd = 'فرم زیر را تکمیل کنید';
        this.cbl = 'اضافه کردن دسترسی جدید';
        this.cbi = 'add';
        this.addMode = true;
        this.editMode = false;
        this.plsWait = false;
        break;
      }
      case 'edit': {
        this.isDelete = false;
        this.ct = 'ویرایش کردن دسترسی';
        this.cd = 'اطلاعات زیر را ویرایش و ذخیره کنید';
        this.cbl = 'ثبت تغییرات';
        this.cbi = 'save';
        this.addMode = false;
        this.editMode = true;
        axios({
          method: 'get',
          headers: {
            Authorization: this.$authObeject.authToken(),
          },
          url: `${this.baseURL}/api/v${this.V}/Accesses/${this.$store.state.focusPermissionId}`,
        }).then((response) => {
          console.log('from permission manager in edit mode →', response.data);
          if (response.data.isSuccess) {
            this.aTitle = response.data.data.title;
            this.aDesc = response.data.data.description;
            this.aStatus = response.data.data.status;
            // this.aArray = response.data.data.permissionsId;
            this.firstLoadArray = response.data.data.permissionsId;
            // console.log('hhhhhhh', this.firstLoadArray);
            if (response.data.data.status === 1) {
              this.stateSwitch = true;
            } else {
              this.stateSwitch = false;
            }
            this.childSwitch = response.data.data.hasChild;
            // console.clear();
            // console.log('az mounte edit', this.aArray);
            // this.checkByArray(this.aArray);
            setTimeout(() => {
              this.checkByArray(this.firstLoadArray);
            }, 600);
          }
          this.plsWait = false;
        }, (error) => {
          this.makeToast('error', this.errorHandler(error), 2000);
        });
        break;
      }
      case 'delete': {
        this.plsWait = false;
        this.isDelete = true;
        this.ct = `آیا از حذف دسترسی " ${this.$store.state.focusPermissionName}" مطمئن هستید؟`;
        this.cd = 'این عملیات قابل بازیابی نیست.';
        break;
      }
      default:
        break;
    }
  },
};
</script>

<style lang='scss' scoped>

.inputWrapper{
    margin-bottom: 24px;
    position: relative;
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
    top: calc(24px - 0px);
    left: -8px;
    right: -8px;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 264px;
    background-color: white;
    box-shadow: 0 8px 32px 0 rgba($color: #000000, $alpha: 0.25);
    border-radius: 8px;
    z-index: 300;
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
    background-color: rgba($color: #000000, $alpha: 0.05);
    color: #61187A;
}

.atitle{
    width: calc(30% - 8px);
}
.adesc{
    width: calc(45% - 8px);
}
.astate{
    width: calc(25% - 8px);
}
.pMethod{
    width: calc(25% - 8px);
}
.pHasChild{
    width: calc(60% - 8px);
}

.switchHolder{
  cursor: pointer;
}

.switchLabel{
  font-size: 12px;
  font-weight: 300;
  pointer-events: none;
}

.btnRow{
  margin-top: 16px;
}

p.selectPermissions{
  font-size: 14px;
  font-weight: 300;
}
</style>
