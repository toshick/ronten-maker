<template lang="pug">
.container
  .view.view-login
    ValidationObserver.form(tag="form" v-slot="{invalid}")
      .form-body
        .title
          Logo
        .columns
          .column
            OInput(
              label="メール"
              name="email"
              placeholder="メール"
              v-model="form.email"
              validate="required|email"
              )
          .column
            OInput(
              label="合言葉"
              name="pass"
              placeholder="パスワード"
              v-model="form.pass"
              validate="required|max:150"
              type="password"
              )
      .buttons.has-text-centered
        b-button.is-medium(type="is-info" @click="startLogin" :disabled="invalid || sending") ログイン
    Footer(bottom)
</template>
<!------------------------------->

<!------------------------------->
<script lang="ts">
import Vue from 'vue';
import { sleep, toastNG, goTop } from '@/common/util';
import { appStore } from '@/store';
import { LoginRequest } from '@/types/app';

// ----------------------
// type
// ----------------------
type State = {
  sending: boolean;
  form: LoginRequest;
  result: string;
};

// ----------------------
// default
// ----------------------
export default Vue.extend({
  name: 'Login',
  components: {},
  data(): State {
    return {
      sending: false,
      form: {
        email: 'test@origami.com',
        pass: 'xxx',
      },
      result: '',
    };
  },
  computed: {},
  async created() {
    // if (this.logined) {
    //   this.goTop();
    // }
  },
  methods: {
    /**
     * goTop
     */
    goTop() {
      goTop();
    },
    /**
     * startLogin
     */
    async startLogin() {
      this.sending = true;
      this.result = '';
      const res = await appStore.Login({ ...this.form });
      this.sending = false;
      if (res.error) {
        toastNG('ログインに失敗しました');
        this.result = res.message;
        await sleep(1000);
        return;
      }
      this.goTop();
    },
  },
});
</script>
<!------------------------------->

<!------------------------------->
<style scoped lang="sass">
.title
  padding: 40px 0
  text-align: center

.form
  width: 600px
  text-align: left
  padding: 20px
  margin: 40px auto
  border-radius: 6px

.buttons
  margin: 30px 0 0

  .button
    width: 100%
</style>
