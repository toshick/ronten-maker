<template lang="pug">

header
  .container
    a.btn-logo(href="/")
      Logo(:small="small")
    //- .user(v-if="loginUser")
    //-   .user-name
    //-     b-dropdown(hoverable)
    //-       a(slot="trigger")
    //-         span {{loginUser.name}}
    //-       b-dropdown-item(aria-role="listitem" @click="startLogout") ログアウト
    .btns
      //- b-button(@click="startBackup" :disabled="sending" size="is-small" type="is-info") backup
      b-tooltip(
        label="ディスカッションを作成するとurlが変わります"
        type="is-light"
        position="is-left"
        )
        b-button(@click="startCreateProject" :disabled="sending" size="is-small" type="is-info") 新規ディスカッション

</template>
<!------------------------------->

<!------------------------------->
<script lang="ts">
import Vue from 'vue';
import { randomText, goProject, toastNG, toastOK, goTop } from '@/common/util';
import { projectStore, appStore } from '@/store';
import { LoginUser, Ronten } from '@/types/app';

type State = {
  sending: boolean;
  result: string;
};

export default Vue.extend({
  props: {
    small: {
      default: false,
      type: Boolean,
    },
  },
  data(): State {
    return {
      sending: false,
      result: '',
    };
  },
  computed: {
    loginUser(): LoginUser {
      return this.$store.state.loginUser;
    },
    rontenList(): Ronten[] {
      return this.$store.getters['ronten/rontenList'] || [];
    },
  },

  created() {},

  methods: {
    /**
     * startLogout
     */
    async startLogout() {
      this.sending = true;
      this.result = '';
      const res = await appStore.Logout();
      this.sending = false;
      if (res.error) {
        toastNG('ログアウトに失敗しました');
        return;
      }

      goTop();
    },
    /**
     * startCreateProject
     */
    async startCreateProject() {
      this.sending = true;
      this.result = '';
      const res = await projectStore.CreateProject(randomText());
      this.sending = false;
      if (res.error) {
        toastNG('ディスカッション作成に失敗しました');
        return;
      }

      if (res.hash) {
        goProject(res.hash);
      }
    },
    /**
     * startBackup
     */
    async startBackup() {
      this.sending = true;
      this.result = '';
      const res = await appStore.BackupAction();
      this.sending = false;
      if (res.error) {
        toastNG('バックアップに失敗しました');
        return;
      }
      toastOK('バックアップした');
    },
  },
});
</script>
<!------------------------------->

<!------------------------------->
<style scoped lang="sass">
@import @/assets/sass/_mixin
@import @/assets/sass/_variables

//----------------------
// header
//----------------------
header
  // +topLeft(0, 0, fixed)
  // background-color: #FFF
  box-shadow: 0 0 3px 1px rgba($ronten-red, 0.3)
  width: 100%
  height: 65px
  z-index: 10

  .container
    display: flex
    justify-content: flex-start
    align-items: center
    padding: 10px 20px
    height: 100%

.btn-logo
  display: block
.user
  margin-left: 20px

.user-name
  .dropdown-trigger > a
    color: $ronten-red

.btns
  margin-left: auto
  button
    margin-left: 10px
</style>
