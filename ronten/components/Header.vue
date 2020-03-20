<template lang="pug">

header
  .container
    Logo(:small="small")
    .user(v-if="loginUser")
      .user-name
        b-dropdown(hoverable)
          a(slot="trigger")
            span {{loginUser.name}}
          b-dropdown-item(aria-role="listitem" @click="startLogout") ログアウト
    .btns
      b-button(@click="startCreateRonten" :disabled="sending" size="is-medium" type="is-info") 論点追加
      
</template>
<!------------------------------->

<!------------------------------->
<script lang="ts">
import Vue from 'vue';
import { toastNG, toastOK } from '@/common/util';
import { CreateRontenAction, LogoutAction, LoginCheckAction } from '@/store';
import { LoginUser } from '@/types/app';

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
  },

  created() {
    this.$store.dispatch(LoginCheckAction());
  },

  methods: {
    /**
     * startLogout
     */
    async startLogout() {
      this.sending = true;
      this.result = '';
      const res = await this.$store.dispatch(LogoutAction());
      if (res.error) {
        this.$buefy.toast.open({
          duration: 1000,
          message: `ログアウトに失敗しました`,
          position: 'is-top',
          type: 'is-danger',
        });
        this.sending = false;
        return;
      }

      window.location.reload();
    },
    /**
     * startCreateRonten
     */
    async startCreateRonten() {
      this.sending = true;

      const res = await this.$store.dispatch(
        CreateRontenAction({
          user_id: +this.loginUser.id,
          name: '新論点',
          memo: '',
        }),
      );

      if (res.error) {
        toastNG('論点作成に失敗しました');
        this.result = res.message;
        this.sending = false;
        return;
      }
      toastOK('論点を作成しました');
      this.sending = false;
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
  +topLeft(0, 0, fixed)
  background-color: #FFF
  box-shadow: 0 0 3px 1px rgba($ronten-red, 0.3)
  width: 100%
  height: 65px
  z-index: 10

  .container
    display: flex
    justify-content: flex-start
    align-items: center
    padding: 10px 20px

.user
  margin-left: 20px

.user-name
  .dropdown-trigger > a
    color: $ronten-red

.btns
  margin-left: auto
</style>
